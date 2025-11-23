import React, { useState, useEffect } from 'react';
import { obtenerProductos, ProductoAPI, obtenerCategorias } from '../data/db'; // Asumiendo que db.ts está en '../data/db'
import ProductCard from '../components/ProductCard'; // Asumiendo que tienes un componente ProductCard
import Header from '../components/Header'; // Componente de cabecera
import Footer from '../components/Footer'; // Componente de pie de página

function Categorias() {
    // 1. Estados para manejar los datos y el proceso de carga
    const [productos, setProductos] = useState<ProductoAPI[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. Estado para filtros (opcional, basado en tu captura)
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');


    // 3. Efecto para cargar los datos del API al montar el componente
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // 🚨 Uso de await para la función asíncrona
                const [productosApi, categoriasApi] = await Promise.all([
                    obtenerProductos(),
                    obtenerCategorias()
                ]);
                
                setProductos(productosApi);
                setCategorias(categoriasApi);
                
            } catch (err) {
                console.error("Error al cargar los datos:", err);
                // Muestra un mensaje de error si la conexión falla
                setError("No se pudo conectar con el servidor para cargar los productos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDatos();
    }, []); 
    // El array vacío asegura que se ejecute solo al montar el componente.


    // Lógica de filtrado (usando la nueva estructura)
    const productosFiltrados = filtroCategoria === 'Todas'
        ? productos
        : productos.filter(p => p.categoria.nombre === filtroCategoria);


    // 4. Renderizado condicional para evitar el pantallazo en blanco

    if (isLoading) {
        // Muestra un mensaje de carga mientras se espera la respuesta del API
        return (
            <>
                <Header />
                <div className="container my-5 text-center">
                    <h2>Cargando productos... 🔄</h2>
                </div>
                <Footer />
            </>
        );
    }
    
    if (error) {
        // Muestra un error si la conexión falló
        return (
            <>
                <Header />
                <div className="container my-5 alert alert-danger">
                    <h3>Error de Conexión</h3>
                    <p>{error}</p>
                </div>
                <Footer />
            </>
        );
    }
    
    // 5. Renderizado principal

    return (
        <>
     
            <div className="container my-5">
                <h1>Catálogo de Productos</h1>

                {/* --- SECCIÓN DE FILTROS --- */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <span>{productosFiltrados.length} resultados</span>
                    <div className="btn-group">
                        <button 
                            className={`btn ${filtroCategoria === 'Todas' ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => setFiltroCategoria('Todas')}
                        >
                            Todas
                        </button>
                        {categorias.map((cat) => (
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

                {/* --- LISTA DE PRODUCTOS --- */}
                <div className="row">
                    {productosFiltrados.map((producto) => (
                        <div key={producto.id} className="col-lg-4 col-md-6 mb-4">
                            {/* 🚨 Importante: Pasar el objeto ProductoAPI al componente hijo */}
                            <ProductCard producto={producto} /> 
                        </div>
                    ))}
                </div>
            </div>
           
        </>
    );
}

export default Categorias;
