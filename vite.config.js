import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Dev (and the Codespaces preview) serve from root "/"; the production build is
// based at "/Vault876/" so it works as a GitHub Pages project site.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Vault876/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
}))
