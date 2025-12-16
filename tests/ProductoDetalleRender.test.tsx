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


test('shouldRenderProductDetails', async () => {
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

  // Verifica que el texto de producto, categoría y precio esté en el documento
  expect(await screen.findByText(/Producto Test/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Categoría Test/i).length).toBeGreaterThan(0);

  const precioEsperado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(1000);
  expect(screen.getByText(precioEsperado)).toBeInTheDocument();
  expect(await screen.findByAltText('Producto Test')).toBeInTheDocument();
});