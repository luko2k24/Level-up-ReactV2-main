// vite.config.ts

import { defineConfig } from 'vitest/config'; 
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173, // Puerto de tu frontend
    // 🛑 CORRECCIÓN FINAL: Configuración del PROXY
    proxy: {
      // Todas las peticiones que empiecen con /api/v1 serán redirigidas a http://localhost:8080
      '/api/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true, // Necesario para que el origen sea localhost:8080
        secure: false, // Desactiva la verificación de SSL (si tu API no usa HTTPS)
      },
    }
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
});