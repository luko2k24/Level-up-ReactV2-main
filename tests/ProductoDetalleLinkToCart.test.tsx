import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import '@testing-library/jest-dom';


vi.mock('@/api/service', () => ({
  api: {
    Productos: {
      obtenerPorId: vi.fn(),
    },
  },
}));

const mockProductoBackend = {
  idProducto: 1,
  nombre: 'Producto Test',
  descripcion: 'Descripción Test',
  precio: 1000,
  categoria: { id: 10, nombre: 'Categoría Test' },
  urlImagen: 'test.jpg',
  oferta: true,
};


test('shouldRenderLinkToCart', async () => {
  const { api } = await import('@/api/service');
  (api.Productos.obtenerPorId as any).mockResolvedValue({ data: mockProductoBackend });

  const { default: ProductoDetalle } = await import('@/pages/ProductoDetalle');

  render(
    <MemoryRouter initialEntries={[`/producto/${mockProductoBackend.idProducto}`]}>
      <Routes>
        <Route path="/producto/:id" element={<ProductoDetalle />} />
      </Routes>
    </MemoryRouter>
  );

  // Verifica que el enlace "Ir al carrito" esté presente si el producto existe
  const link = await screen.findByRole('link', { name: /ir al carrito/i });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/carrito'); // Verifica el href del enlace
});