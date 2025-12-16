import { render, screen } from '@testing-library/react';
import Carrito from '../src/pages/Carrito';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

test('shouldRenderEmptyCartState', () => {
  render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  );

  const mensajeVacio = screen.getByText(/Tu carrito de compras está vacío/i);
  expect(mensajeVacio).toBeInTheDocument();

  const botonIrACategorias = screen.getByRole('link', { name: /Volver a la tienda/i });
  expect(botonIrACategorias).toBeInTheDocument();
});
