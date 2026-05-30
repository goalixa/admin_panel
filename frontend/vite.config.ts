import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/admin/api': {
        target: 'http://admin-panel:80',
        changeOrigin: true,
      },
    },
  },
})