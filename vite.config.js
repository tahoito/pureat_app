import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // ← これがかなり重要。絶対URLを出させない
  base: '/',

  plugins: [
    laravel({
      // CSSもあるなら ['resources/css/app.css', 'resources/js/app.jsx'] にしてOK
      input: 'resources/js/app.jsx',
      refresh: true,
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // public 配下の静的アセットを確実にキャッシュへ
      includeAssets: [
        'offline.html',
        'icons/icon-192.png',
        'icons/icon-512.png',
        // 必要なら 'icons/apple-touch-icon.png', 'favicon.ico' なども
      ],
      manifest: {
        name: 'RecipeApp',
        short_name: 'Recipe',
        start_url: '/',
        scope: '/',                // ← 追加：PWAのスコープを明示
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#F59E0B',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // オフライン時のフォールバック
        navigateFallback: '/offline.html',

        runtimeCaching: [
          {
            // 画像: キャッシュ優先
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1週間
              },
            },
          },
          {
            // API: ネット優先
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 3,
            },
          },
        ],
      },
    }),
  ],

  // ← HMR を ngrok の https ページ上で使うなら有効化。
  // 本番ビルドだけで見るなら不要。
  // server: {
  //   https: true,
  //   host: true,
  //   hmr: {
  //     protocol: 'wss',
  //     host: 'mabel-bicolor-approvably.ngrok-free.dev',
 //     clientPort: 443,
  //   },
  // },
})
