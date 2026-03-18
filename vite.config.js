import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 前端使用 /api/* 访问后端，开发时由 Vite 转发到 Express
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
