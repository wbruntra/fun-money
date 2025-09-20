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
        name: 'Fun Money – Marble Budget Tracker',
        short_name: 'Fun Money',
        description: 'A playful PWA for tracking your personal fun budget using marbles. Log spending, add funds, and visualize your available budget!',
        start_url: '/fun-money/',
        display: 'standalone',
        background_color: '#e3ecf7',
        theme_color: '#3a7bb7',
        icons: [
          {
            src: '/fun-money/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/fun-money/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
