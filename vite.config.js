import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.jsx',
      refresh: true,
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'RecipeApp',
        short_name: 'Recipe',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#F59E0B',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // HTML ナビゲーション時は offline.html にフォールバック
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
});
