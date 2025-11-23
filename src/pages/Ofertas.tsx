// src/pages/Ofertas.tsx

import { useState, useEffect } from "react";
// Importación de tipos usando alias
import type { Producto } from "@/types/api"; 
// Importación de componente usando alias
import ProductCard from "@/components/ProductCard";
import { useNavigate } from 'react-router-dom';

// Importación de servicios y hook usando alias
import { ProductosService } from "@/api/service"; 
// ✅ ÚNICA IMPORTACIÓN DEL HOOK
import { useCart } from "@/hooks/useCart"; 


export default function Ofertas() {
    // 1. Inicializamos productos como un array vacío de tipo Producto
    const [productos, setProductos] = useState<Producto[]>([]);
    const nav = useNavigate();

    // 🚨 OBTENEMOS la función 'agregar' renombrada a 'agregarAlCarrito' desde el hook
    const { agregar: agregarAlCarrito } = useCart();


    // 2. Usamos useEffect para cargar los datos asíncronamente
    useEffect(() => {
        async function cargarProductos() {
            try {
                // await para obtener los datos reales (no la Promesa)
                const todosProductos = await ProductosService.listar();

                // Filtramos los productos que tienen "oferta" en su descripción
                const productosEnOferta = todosProductos.filter(p =>
                    p.descripcion.toLowerCase().includes('oferta')
                );

                setProductos(productosEnOferta);

            } catch (error) {
                console.error("Error al cargar productos de oferta:", error);
            }
        }

        cargarProductos();
    }, []); // El array vacío asegura que se ejecute solo al montar

    return (
        <div className="container my-5">
            <h2 className="neon-title text-warning mb-4">Ofertas</h2>
            <div className="row g-4 dark-text-white rounded-3 shadow-lg">

                {productos.map((p) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
                        <ProductCard
                            producto={p}
                            onView={() => nav(`/productos/${p.id}`)}
                            onAdd={() => agregarAlCarrito(p)} // Función obtenida del hook
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}