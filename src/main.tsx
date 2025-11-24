import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';


// Intenta obtener el contenedor raíz del DOM
const container = document.getElementById('root');

if (container) {
  // Crea la raíz de React para renderizar la aplicación
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App /> {/* 🚨 ¡Asegúrate que solo diga <App /> aquí! */}
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  // Manejo de error si no se encuentra el elemento 'root'
  console.error("Error: No se encontró el elemento 'root' en el documento HTML.");
}