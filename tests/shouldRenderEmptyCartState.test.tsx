import { render, screen } from '@testing-library/react';
import Carrito from '../src/pages/Carrito';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';  // Importa jest-dom para que 'expect' funcione correctamente

test('shouldRenderEmptyCartState', () => {
  render(
    <Router>
      <Carrito />
    </Router>
  );

  const mensajeVacio = screen.getByText(/Tu carrito de compras está vacío/i);
  expect(mensajeVacio).toBeInTheDocument();

  const botonIrACategorias = screen.getByRole('link', { name: /Ir a comprar/i });
  expect(botonIrACategorias).toBeInTheDocument();
});
