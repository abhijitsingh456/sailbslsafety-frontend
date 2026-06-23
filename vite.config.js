import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  build: {
    // Strip ALL console.* calls and debugger statements from the production
    // bundle. Users opening DevTools will see nothing — logs only exist in dev.
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
