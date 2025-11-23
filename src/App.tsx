import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import CompraExitosa from './pages/CompraExitosa';
import CompraFallida from './pages/CompraFallida';
import Admin from './pages/Admin';
import ProductoDetalle from './pages/ProductoDetalle';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

/**
 * Componente principal de la aplicación.
 * Define la estructura de la aplicación y las rutas de navegación.
 */
export default function App() {
  return (
    // Contenedor principal para asegurar que el pie de página siempre esté al final (sticky footer)
    <div className="d-flex min-vh-100 flex-column">
      
      {/* Encabezado visible en todas las páginas */}
      <Header />

      {/* Contenido principal que se expande para ocupar el espacio restante */}
      <main className="container my-4 flex-fill">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa" element={<CompraExitosa />} />
          <Route path="/compra-fallida" element={<CompraFallida />} />
          
          {/* Ruta con parámetro para ver el detalle de un producto específico */}
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          
          {/* Rutas de autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Ruta de administración (normalmente protegida) */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Redirección para cualquier ruta no definida (404) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Pie de página visible en todas las páginas */}
      <Footer />
    </div>
  );
}
