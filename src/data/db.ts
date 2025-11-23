// ====================================================================
// INTERFACES (Alineadas con la estructura del Backend)
// ====================================================================

/**
 * Interfaz para la Categoria anidada en el objeto Producto del API.
 */
export interface CategoriaAPI {
  id: number;
  nombre: string;
}

/**
 * Interfaz para la estructura del Producto que devuelve el API REST.
 * Nota: El backend usa id: number, descripcion: string y categoria: objeto.
 * Se añadieron 'oferta' e 'imagen' como opcionales por si tu frontend los espera.
 */
export interface ProductoAPI {
  id: number; // ID numérico (Long de Java)
  nombre: string;
  descripcion: string; // Campo del backend (Producto.java)
  precio: number;
  categoria: CategoriaAPI; // Objeto anidado (Categoria.java)
  
  // Propiedades opcionales que estaban en el modelo local
  oferta?: boolean; 
  imagen?: string; 
}


/**
 * Interfaz para definir la estructura de un Item dentro del Carrito (Sigue local).
 */
export interface ItemCarrito {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number; // Cantidad de unidades de este producto en el carrito
}

// ====================================================================
// CONFIGURACIÓN API & LOCAL STORAGE (Solo para Carrito)
// ====================================================================

// URL del backend Spring Boot
const API_URL = 'http://localhost:8080/api/v1';

// Claves de almacenamiento para el Carrito (se mantienen locales)
const CLAVES_ALMACENAMIENTO = {
  carrito: 'lvl_carrito'
}

/**
 * Lee un valor de localStorage y lo parsea a JSON.
 */
function leer<T>(clave: string, valorAlternativo: T): T {
  const crudo = localStorage.getItem(clave)
  if (!crudo) return valorAlternativo
  try {
    return JSON.parse(crudo) as T
  } catch {
    return valorAlternativo
  }
}

/**
 * Escribe un valor en localStorage, serializándolo a JSON.
 */
function escribir<T>(clave: string, valor: T): void {
  localStorage.setItem(clave, JSON.stringify(valor))
}


// ====================================================================
// GESTIÓN DE PRODUCTOS (CONECTADO AL API)
// ====================================================================

/**
 * Obtiene la lista completa de productos desde el backend.
 */
export async function obtenerProductos(): Promise<ProductoAPI[]> {
    try {
        const response = await fetch(`${API_URL}/productos`);
        
        if (!response.ok) {
            // Maneja errores HTTP (ej. 404, 500)
            console.error(`Error al obtener productos. Status: ${response.status}`);
            return [];
        }
        
        const data: ProductoAPI[] = await response.json();
        
        // El campo 'oferta' no existe en el backend. Puedes añadir una lógica de mapeo simple aquí
        // para asegurar la compatibilidad con tu frontend si es necesario, 
        // pero por simplicidad se omite, ya que fue definido como opcional.
        
        return data;

    } catch (error) {
        console.error("Error de conexión con el API de productos:", error);
        return []; 
    }
}

/**
 * Busca un producto por su ID (función ahora asíncrona).
 * Nota: El ID en el backend es un número.
 */
export async function obtenerProductoPorId(id: string): Promise<ProductoAPI | undefined> {
    // Convierte el ID de string (del router/UI) a number para el API
    const productoIdNumerico = parseInt(id);
    
    // Si el ID no es un número válido, detiene la ejecución
    if (isNaN(productoIdNumerico)) {
        return undefined;
    }
    
    try {
        const response = await fetch(`${API_URL}/productos/${productoIdNumerico}`);
        
        if (response.status === 404) {
            return undefined;
        }

        if (!response.ok) {
             console.error(`Error al obtener producto. Status: ${response.status}`);
             return undefined;
        }
        
        const data: ProductoAPI = await response.json();
        return data;

    } catch (error) {
        console.error(`Error de conexión al obtener producto ID ${id}:`, error);
        return undefined;
    }
}

/**
 * Obtiene una lista de categorías únicas de los productos devueltos por el API.
 */
export async function obtenerCategorias(): Promise<string[]> {
    const productos = await obtenerProductos();
    
    // Mapea y obtiene solo el nombre de la categoría, luego usa Set para unicidad
    const categorias = Array.from(new Set(productos.map(p => p.categoria.nombre)));
    
    return categorias.sort();
}

// ⚠️ NOTA: Las funciones crearProducto, actualizarProducto, eliminarProducto, etc.
// ⚠️ para el CRUD administrativo deben migrarse a llamadas POST/PUT/DELETE
// ⚠️ al backend (ej. /api/v1/admin/productos) y usar un token JWT.
// ⚠️ Por ahora, las dejo vacías para evitar conflictos.

export function crearProducto(producto: any): any {
    console.warn("CRUD en Producto: Debes implementar la llamada POST al API.");
    return producto;
}

export function actualizarProducto(id: string, parcial: any): any {
    console.warn("CRUD en Producto: Debes implementar la llamada PUT al API.");
    return parcial;
}

export function eliminarProducto(id: string): void {
    console.warn("CRUD en Producto: Debes implementar la llamada DELETE al API.");
}

// ====================================================================
// GESTIÓN DEL CARRITO (Mantiene la lógica de LocalStorage)
// ====================================================================

/**
 * Obtiene el contenido actual del carrito.
 */
export function obtenerCarrito(): ItemCarrito[] {
  return leer<ItemCarrito[]>(CLAVES_ALMACENAMIENTO.carrito, [])
}

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe.
 */
export function agregarAlCarrito(producto: ProductoAPI, cantidad: number = 1): ItemCarrito[] {
  if (producto.precio <= 0) {
    throw new Error('El precio del producto debe ser mayor a cero para agregarlo al carrito.');
  }
    
  const carrito = obtenerCarrito()
  
  // Nota: Aquí se usa producto.id, que ahora es un number del API. 
  // Podría haber un problema si tu lógica de carrito espera un string.
  // Por compatibilidad con ItemCarrito, se convierte a string si es necesario.
  const productoId = String(producto.id); 
  
  const indice = carrito.findIndex(i => i.id === productoId)
  
  if (indice >= 0) {
    // Si ya existe, incrementa la cantidad
    carrito[indice].cantidad += cantidad
  } else {
    // Si no existe, agrega un nuevo item
    carrito.push({
      id: productoId,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad
    })
  }
  escribir(CLAVES_ALMACENAMIENTO.carrito, carrito)
  return carrito
}

/**
 * Elimina un item completamente del carrito por ID.
 */
export function eliminarDelCarrito(id: string): ItemCarrito[] {
  const carrito = obtenerCarrito().filter(i => i.id !== id)
  escribir(CLAVES_ALMACENAMIENTO.carrito, carrito)
  return carrito
}

/**
 * Vacía completamente el carrito.
 */
export function vaciarCarrito(): void {
  escribir(CLAVES_ALMACENAMIENTO.carrito, [])
}

/**
 * Calcula el valor total de todos los items en el carrito.
 */
export function totalCarrito(): number {
  return obtenerCarrito().reduce((acumulador, item) => {
    return item.precio > 0 ? acumulador + item.precio * item.cantidad : acumulador;
  }, 0)
}