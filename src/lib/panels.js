// The editable panels on the live site, in the order the owner sees them in the
// "Edit Website" media picker. Each panel's `aspect` is the crop ratio the
// cropper locks to so her photo fills that slot cleanly; `aspectClass` is the
// matching Tailwind box used for the picker preview. `group` just labels the
// section headings in the grid.
//
// IDs here must match what the website components look up (Hero → 'hero',
// the five gallery figures → 'work_1'…'work_5').
export const PANELS = [
  { id: 'hero', label: 'Homepage hero', group: 'Hero', aspect: 16 / 9, aspectClass: 'aspect-[16/9]' },
  { id: 'work_1', label: 'Braid extensions', group: 'The Work', aspect: 3 / 4, aspectClass: 'aspect-[3/4]' },
  { id: 'work_2', label: 'Extensions', group: 'The Work', aspect: 3 / 4, aspectClass: 'aspect-[3/4]' },
  { id: 'work_3', label: 'The Space', group: 'The Work', aspect: 3 / 4, aspectClass: 'aspect-[3/4]' },
  { id: 'work_4', label: 'Length & Finish', group: 'The Work', aspect: 16 / 10, aspectClass: 'aspect-[16/10]' },
  { id: 'work_5', label: 'Locs & Styling', group: 'The Work', aspect: 3 / 4, aspectClass: 'aspect-[3/4]' },
]

export const panelById = (id) => PANELS.find((p) => p.id === id) || null
