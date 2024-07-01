import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// const { resolve } = require('path')
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
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
      output:{
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames(assetInfo){
          if (assetInfo.name.endsWith('.css')) {
            return `css/[name]-[hash][extname]`
          }
          const imgExts = ['.png', '.jpeg', '.jpg', '.gif', '.svg', '.ico', '.webp']
          if (imgExts.some(ext => assetInfo.name.endsWith(ext))) {
              return `images/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    }
  }
})


