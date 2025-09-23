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
                name: 'Tastie',
                short_name: 'Tastie',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#f59e0b',
                icons: [
                    {
                        src: '/icons/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    server: {
        https: false, // dev時だけ
    },
    base: process.env.ASSET_URL ? process.env.ASSET_URL + '/' : '/build/',
});
