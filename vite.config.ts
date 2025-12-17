// vite.config.ts

import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8080';

  return {
    plugins: [react()],

    server: {
      port: 5173, // Puerto de tu frontend

      proxy: {
        // Todas las peticiones que empiecen con /api/v1 serán redirigidas al backend.
        // Cambia VITE_API_PROXY_TARGET si tu backend corre en otro host/puerto.
        '/api/v1': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    test: {
      globals: true,
      environment: 'jsdom',
      include: ['**/*.test.ts', '**/*.test.tsx'],
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});