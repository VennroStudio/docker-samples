import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    manifest: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            },
            {
              name: 'vendor-router',
              test: /[\\/]node_modules[\\/]react-router[\\/]/,
            },
            {
              name: 'vendor-query',
              test: /[\\/]node_modules[\\/]@tanstack[\\/]react-query[\\/]/,
            },
            {
              name: 'vendor-forms',
              test: /[\\/]node_modules[\\/](@hookform|react-hook-form|zod)[\\/]/,
            },
            {
              name: 'vendor-http',
              test: /[\\/]node_modules[\\/]axios[\\/]/,
            },
            {
              name: 'vendor-ui',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    allowedHosts: ['mono-web.local'],
    host: '0.0.0.0',
    port: 5173,
  },
})
