// Premium, aunty-proof photo looks. These are tasteful CSS-filter *styles* — a
// warm grade, a soft focus, a sheen — NOT AI retouching. "Skin smoothness" is a
// gentle soft-focus and "Hair gloss" a contrast/saturation sheen; honest about
// what they are. The same filter string works as a live CSS preview AND is baked
// into the uploaded image via canvas, so every visitor sees the finished result.

export const PRESETS = [
  { id: 'none', label: 'Original' },
  { id: 'golden-hour', label: 'Golden Hour' },
  { id: 'studio-light', label: 'Studio Light' },
  { id: 'bw-editorial', label: 'B&W Editorial' },
  { id: 'warm-glow', label: 'Warm Glow' },
]

const PRESET_CSS = {
  none: '',
  'golden-hour': 'sepia(0.28) saturate(1.35) brightness(1.06) contrast(1.03)',
  'studio-light': 'brightness(1.09) contrast(1.10) saturate(1.06)',
  'bw-editorial': 'grayscale(1) contrast(1.14) brightness(1.03)',
  'warm-glow': 'sepia(0.16) saturate(1.22) brightness(1.08) contrast(0.98)',
}

export const FILTER_DEFAULTS = { preset: 'none', smoothness: 0, gloss: 0 }

// Build the CSS `filter` value from a preset + the two sliders (0–100 each).
// Multiple filter functions compose, so stacking preset + sliders is fine.
export function buildFilterCss(f = {}) {
  const { preset = 'none', smoothness = 0, gloss = 0 } = f
  const parts = []
  if (PRESET_CSS[preset]) parts.push(PRESET_CSS[preset])
  if (smoothness > 0) {
    const blur = ((smoothness / 100) * 1.1).toFixed(2) // up to ~1.1px soft focus
    const bright = (1 + (smoothness / 100) * 0.05).toFixed(3)
    parts.push(`blur(${blur}px)`, `brightness(${bright})`)
  }
  if (gloss > 0) {
    const contrast = (1 + (gloss / 100) * 0.16).toFixed(3)
    const sat = (1 + (gloss / 100) * 0.22).toFixed(3)
    parts.push(`contrast(${contrast})`, `saturate(${sat})`)
  }
  return parts.join(' ').trim()
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Bake the chosen crop + filter into a JPEG blob ready to upload. `crop` is the
// `croppedAreaPixels` react-easy-crop reports. We cap the long edge so uploads
// stay light on the salon's phone data.
export async function getCroppedImg(src, crop, filterCss = '', maxEdge = 1800) {
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  const scale = crop.width > maxEdge ? maxEdge / crop.width : 1
  canvas.width = Math.max(1, Math.round(crop.width * scale))
  canvas.height = Math.max(1, Math.round(crop.height * scale))
  const ctx = canvas.getContext('2d')
  // A clean base so any blur at the edges blends to the image, not transparency.
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  if (filterCss) ctx.filter = filterCss
  ctx.drawImage(
    img,
    crop.x, crop.y, crop.width, crop.height,
    0, 0, canvas.width, canvas.height,
  )
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not render image'))),
      'image/jpeg',
      0.9,
    ),
  )
}
