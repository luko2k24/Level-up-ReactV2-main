# Level‑Up Gamer — Migración a React (Starter)

Este proyecto es un **starter** diseñado para migrar tu tienda a React, con un enfoque en ofrecer una arquitectura limpia, rutas predefinidas y simulación de datos para acelerar el desarrollo y reducir el tiempo de configuración inicial.

---

## Características principales
- **Rutas:** Manejo de múltiples páginas como:
  - `Home`
  - `Categorías`
  - `Ofertas`
  - `Carrito`
  - `Checkout`
  - `Compra Exitosa/Fallida`
  - `Admin`
  - `Detalle del Producto`
- **Simulación de datos:** CRUD con almacenamiento local en `localStorage` usando el archivo `src/data/db.js`.
- **Diseño responsivo:** Integrado con Bootstrap para una experiencia fluida en diferentes tamaños de pantalla.
- **Pruebas unitarias:** Configuración lista con Jasmine y Karma para probar renderizado, propiedades (`props`), estado (`state`) y manejo de eventos.

---

## Composición del repositorio
El proyecto utiliza principalmente las siguientes tecnologías y lenguajes:
- **TypeScript:** 56.5%
- **HTML:** 25%
- **CSS:** 11.4%
- **JavaScript:** 7.1%

---

## Estructura del código
- **`src/components`:** Componentes pequeños como Header, Footer, ProductCard.
- **`src/pages`:** Vistas principales (Home, Categorías, Ofertas, entre otras).
- **`src/data/db.js`:** CRUD simulado y datos locales.
- **`tests/`:** Especificaciones y pruebas unitarias con Jasmine.

---

## Instalación y Uso
### Requisitos previos
- Node.js (se recomienda la última versión estable).

### Instalar dependencias
```bash
npm i
