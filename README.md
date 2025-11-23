# Level‑Up Gamer — Migración a React (Starter)

Este proyecto es un **starter** listo para migrar tu tienda a React con:
- Rutas (Home, Categorías, Ofertas, Carrito, Checkout, Compra Exitosa/Fallida, Admin, Detalle).
- Datos simulados + CRUD en `localStorage` (`src/data/db.js`).
- Bootstrap para diseño responsivo.
- Pruebas unitarias con **Jasmine + Karma** (render, props, estado, eventos).

## Uso
```bash
npm i
npm run dev
```

## Pruebas
```bash
npm test
```

## Estructura
- `src/components` — Header, Footer, ProductCard
- `src/pages` — Home, Categorias, Ofertas, Carrito, Checkout, CompraExitosa, CompraFallida, Admin, ProductoDetalle
- `src/data/db.js` — Datos y funciones CRUD
- `tests/` — Specs Jasmine
