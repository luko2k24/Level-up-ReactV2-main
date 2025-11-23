import { render, screen } from '@testing-library/react';
import ProductoDetalle from '../src/pages/ProductoDetalle';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';
import '@testing-library/jest-dom';




vi.mock('../data/db', () => ({
  getProductById: vi.fn(() => undefined), // Devuelve undefined
  addToCart: vi.fn(),
}));


test('shouldShowProductNotFound', () => {
  render(
    <Router>
      <ProductoDetalle />
    </Router>
  );

  // Verifica que el mensaje "Producto no encontrado." se muestre en pantalla
  expect(screen.getByText('Producto no encontrado.')).toBeInTheDocument();
});