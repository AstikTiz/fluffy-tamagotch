import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const BASE = process.env.VITE_BASE || '/fluffy-tamagotch/';

export default defineConfig(() => {
  return {
    base: BASE,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg'],
        manifest: {
          id: BASE,
          start_url: BASE,
          name: 'Пушистик Тамагочи 1950s',
          short_name: 'Тамагочи',
          description: 'Кукольный тамагочи-виджет в стиле покадровой анимации 1950-х с эмоциями и прогулками.',
          theme_color: '#1c1917',
          background_color: '#0c0a09',
          display: 'standalone',
          scope: BASE,
          icons: [
            {
              src: `${BASE}icon.svg`,
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: `${BASE}icon.svg`,
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
