import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Send /api requests to the Flask backend (wildbridge/app.py) during development.
    proxy: {
      '/api': 'http://127.0.0.1:5000',
    },
  },
})
