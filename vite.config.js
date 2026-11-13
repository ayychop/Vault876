import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Base path by target:
//   - dev / Codespaces preview .......... "/"            (served at root)
//   - Vercel build (VERCEL=1) ........... "/"            (served at its own domain root, SPA rewrites in vercel.json)
//   - GitHub Pages build ................ "/Vault876/"   (project-site sub-path)
export default defineConfig(({ command }) => ({
  base: command === 'build' && !process.env.VERCEL ? '/Vault876/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
}))
