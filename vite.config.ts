// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Necesitas path para el alias @/ si lo configuraste
import path from 'path'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Opciones de configuración de Vitest
  test: { 
    globals: true, // Habilita las funciones globales como describe, test, expect
    environment: 'jsdom', // Usa jsdom para las pruebas en el navegador
    include: ['tests/**/*.test.tsx', 'tests/**/*.spec.tsx'], // Archivos de prueba específicos
  },
  
  
  resolve: { 
   alias: {
   '@': path.resolve(__dirname, './src'),
   },
  },

});