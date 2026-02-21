import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['three-mesh-bvh'],
    include: [
      'use-sync-external-store/shim/with-selector',
    ],
  },
  resolve: {
    alias: {
      'use-sync-external-store/shim/with-selector':
        'use-sync-external-store/shim/with-selector.js',
    },
  },
})
