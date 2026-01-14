import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://44.201.41.10:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://44.201.41.10:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
