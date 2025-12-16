import { Producto } from "@/api/api";

export interface ProductoNormalizado {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  urlImagen: string;
  oferta: boolean;
  categoria: {
    id: number;
    nombre: string;
  };
}

const FALLBACK_IMG = "/img/productos/placeholder.png";

export function normalizarProducto(p: any): ProductoNormalizado {
  const id = p.idProducto ?? p.id;

  const rawImage =
    p.urlImagen ||
    p.imagen ||
    "";

  return {
    id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: Number(p.precio),
    oferta: Boolean(p.oferta),
    categoria: {
      id: p.categoria?.id ?? 0,
      nombre: p.categoria?.nombre ?? "Sin categoría",
    },

    // ✅ RUTA CORRECTA DESDE /public
    urlImagen: rawImage
      ? `/img/productos/${rawImage}`
      : FALLBACK_IMG,
  };
}
