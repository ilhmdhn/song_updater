// renderer/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // penting untuk file:// protocol di Electron
  server: {
    port: 3000, // ⬅️ ini penting biar sesuai dengan wait-on
  },
  build: {
    outDir: 'dist',
  }
});