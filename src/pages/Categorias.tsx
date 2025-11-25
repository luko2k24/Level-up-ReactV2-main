import React, { useState, useEffect } from 'react';
import { obtenerProductos, obtenerCategorias } from '../data/db';
import ProductCard from '../components/ProductCard';

import { Producto } from '../api/api';


import { useCart } from '../hooks/useCart';

function Categorias() {

   
    const { agregar: addToCart } = useCart();

    // Función para pasar al ProductCard
    const handleAddToCart = (producto: Producto) => {
        console.log("Producto agregado:", producto);
        addToCart(producto); 
    };

    // STATES
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');

    // FETCH PRODUCTOS + CATEGORÍAS
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [productosApi, categoriasApi] = await Promise.all([
                    obtenerProductos(),
                    obtenerCategorias()
                ]);

                setProductos(productosApi);
                setCategorias(categoriasApi);

            } catch (err) {
                console.error("Error al cargar los datos:", err);
                setError("No se pudo conectar con el servidor para cargar los productos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDatos();
    }, []);

    const productosFiltrados = filtroCategoria === 'Todas'
        ? productos
        : productos.filter(p => p.categoria.nombre === filtroCategoria);

    // ESTADOS DE CARGA Y ERROR
    if (isLoading) {
        return (
            <div className="container my-5 text-center">
                <h2>Cargando productos... 🔄</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5 alert alert-danger">
                <h3>Error de Conexión</h3>
                <p>{error}</p>
            </div>
        );
    }

    // RENDER PRINCIPAL
    return (
        <div className="container my-5">
            <h1>Catálogo de Productos</h1>

            {/* FILTROS */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <span>{productosFiltrados.length} resultados</span>
                <div className="btn-group">
                    <button
                        className={`btn ${filtroCategoria === 'Todas' ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => setFiltroCategoria('Todas')}
                    >
                        Todas
                    </button>
                    {categorias.map(cat => (
                        <button
                            key={cat}
                            className={`btn ${filtroCategoria === cat ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => setFiltroCategoria(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="row">
                {productosFiltrados.map(producto => (
                    <div key={producto.id} className="col-lg-4 col-md-6 mb-4">
                        <ProductCard
                            producto={producto}
                            onAdd={handleAddToCart}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Categorias;
