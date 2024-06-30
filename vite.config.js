import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// const { resolve } = require('path')
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 4000,
    // 是否开启 https
    https: false,
    hmr: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notes: resolve(__dirname, 'notes/index.html')
      }
    }
  }
})


