import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/fun-money/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Fun Money',
        short_name: 'FunMoney',
        description: 'Track your fun money and spending as marbles!',
        start_url: '/fun-money/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#41D1FF',
        icons: [
          {
            src: '/fun-money/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/fun-money/vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
