import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss(), VitePWA({ registerType: 'prompt' })],
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'],
  },
})
