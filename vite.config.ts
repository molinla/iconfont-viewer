import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use environment variable to set base path
  // GitHub Pages: /iconfont-viewer/
  // Vercel: / (default)
  base: process.env.VITE_BASE_PATH || '/',
})
