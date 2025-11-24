// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 🚀 CONFIGURACIÓN DEL PROXY (CORS FIX)
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true, 
        secure: false,      
      },
    },
  },
  
  resolve: { 
   alias: {
   '@': path.resolve(__dirname, './src'),
   },
  },

  // ❌ IMPORTANTE: ASEGÚRATE QUE EL OBJETO 'test' NO ESTÉ AQUÍ. ❌
  // Debe ser manejado por Vitest por convención o en otro archivo.
});