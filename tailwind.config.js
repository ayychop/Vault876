/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware semantic tokens (driven by CSS vars in index.css).
        // These invert between dark and light; gold holds in both.
        canvas: 'rgb(var(--canvas) / <alpha-value>)', // page background
        ink: 'rgb(var(--ink) / <alpha-value>)', // foreground / text
        surface: 'rgb(var(--surface) / <alpha-value>)', // raised panels
        obsidian: {
          DEFAULT: '#0A0A0A',
          raised: '#121212', // slightly lifted panels on the black ground
          line: '#1F1F1F', // hairline dividers
        },
        gold: {
          DEFAULT: '#D4AF37',
          soft: '#E7CC6E', // lit edge of the metal
          deep: '#A8862A', // shadow side of the metal
        },
      },
      fontFamily: {
        // Warm high-contrast display serif + heavy poster sans + clean UI sans
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        // Didone lockup face — a tight, extreme-contrast clone of the VAULT 876 logo
        logo: ['"Bodoni Moda"', '"Playfair Display"', 'Georgia', 'serif'],
        accent: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Editorial display scale (clamped fluid sizes live in index.css utilities)
      },
      letterSpacing: {
        tightest: '-0.045em',
        luxe: '0.22em', // wide tracking for small label caps
      },
      maxWidth: {
        measure: '68ch',
      },
      transitionTimingFunction: {
        // Exponential ease-out — the house motion curve
        luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        lift: '0 24px 60px -24px rgba(0, 0, 0, 0.85)',
      },
    },
  },
  plugins: [],
}
