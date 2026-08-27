import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        }
      }
    })
  ],
  // In dev, proxy the enquiry/contact API to a locally-running backend (contact-server.mjs on :8787),
  // mirroring the nginx `location /api/` prefix in production. No-op if nothing is listening there.
  server: {
    proxy: {
      '/api': { target: 'http://127.0.0.1:8787', changeOrigin: false },
    },
  },
})
