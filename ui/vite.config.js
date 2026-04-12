import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    fs: {
      allow: ['..']
    },
    cors: true,
    allowedHosts: [
      'internetted-rickey-unvibrantly.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok-free.app'
    ],
  },
  plugins: [
    react(),
    VitePWA({
      base: '/',
      scope: '/',
      strategy: 'generateSW',
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          // 1. Rule for POST requests
          {
            // Using a Regex ensures we catch all endpoints (e.g., /users, /data)
            urlPattern: /^https:\/\/ismr-engine-service\.onrender\.com\/.*/,
            handler: 'NetworkOnly', // Must be NetworkOnly for Background Sync
            method: 'POST',         // Explicitly target POST
            options: {
              backgroundSync: {
                name: 'ismr-post-sync-queue', // Name of the IndexedDB queue
                options: {
                  maxRetentionTime: 24 * 60 // Keep in queue for up to 24 hours
                },
              },
            }
          },
          // 2. Rule for PUT requests
          {
            urlPattern: /^https:\/\/ismr-engine-service\.onrender\.com\/.*/,
            handler: 'NetworkOnly',
            method: 'PUT',          // Explicitly target PUT
            options: {
              backgroundSync: {
                name: 'ismr-put-sync-queue', // Shares the same queue as POST
                options: {
                  maxRetentionTime: 24 * 60
                },
              },
            }
          },
          // 3. Your original static assets rule
          {
            urlPattern: /\.(?:png|jpg|svg)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'ismr-assets' }
          }
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module', // Changed from 'classic' to 'module' for better Vite compatibility
        navigateFallback: 'index.html',
      },
      manifest: {
        name: 'ismr',
        short_name: 'ismr',
        description: 'Aplicativo Text-to-Speech',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'logo512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ],
})