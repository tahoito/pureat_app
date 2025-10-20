import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const useTunnel = process.env.VITE_USE_TUNNEL === 'true'
const hmrHost   = process.env.VITE_HMR_HOST || 'localhost'
const hmrPort   = Number(process.env.VITE_HMR_CLIENT_PORT || (useTunnel ? 443 : 5173))

export default defineConfig({
  base: '/',

  plugins: [
    laravel({
      input: 'resources/js/app.jsx', // CSSもあるなら配列にしてOK
      refresh: true,
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // dev中はSWを無効化（404や登録失敗を防ぐ）
      devOptions: { enabled: false },

      includeAssets: [
        'offline.html',
        'images/recipe_icon.png',
      ],
      manifest: {
        name: 'RecipeApp',
        short_name: 'Recipe',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#F59E0B',
        icons: [
          { src: '/images/recipe_icon.png', sizes: '192x192', type: 'image/png' },
          { src: '/images/recipe_icon.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        navigateFallback: '/offline.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', networkTimeoutSeconds: 3 },
          },
        ],
      },
    }),
  ],

  server: {
    host: true,
    https: useTunnel, // トンネル時だけ https
    hmr: useTunnel
      ? { protocol: 'wss', host: hmrHost, clientPort: hmrPort }
      : { host: 'localhost', port: hmrPort },
  },
})
