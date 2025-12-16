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

test('shouldShowProductNotFound', async () => {
  const { api } = await import('@/api/service');
  (api.Productos.obtenerPorId as any).mockRejectedValue(new Error('404'));

  const { default: ProductoDetalle } = await import('@/pages/ProductoDetalle');

  render(
    <MemoryRouter initialEntries={['/producto/999']}>
      <Routes>
        <Route path="/producto/:id" element={<ProductoDetalle />} />
      </Routes>
    </MemoryRouter>
  );

  // Verifica que el mensaje "Producto no encontrado" se muestre en pantalla
  expect(await screen.findByText(/Producto no encontrado/i)).toBeInTheDocument();
});