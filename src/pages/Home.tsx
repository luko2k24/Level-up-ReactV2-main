import React, { JSX, useEffect, useState } from 'react'

// 🚨 CORRECCIÓN: Usamos el alias absoluto @/ para referirnos a carpetas dentro de src/
import { api } from '../api/service/index'; // Asegúrate de
import { Producto } from '@/api/api'; 
import ProductCard from '@/components/ProductCard'; 

// 🚨 Nueva Función para manejar la lógica del carrito
const handleAddToCart = (producto: Producto) => {
    // CLAVE: Esta función ahora se pasa al ProductCard, habilitando el botón.
    // Aquí es donde harías la llamada a tu API de Carrito o actualizarías tu estado local/global.
    console.log(`[CARRITO] Producto añadido: ${producto.nombre} (ID: ${producto.id})`);
    
    // Usamos alert temporalmente para confirmar que el botón funciona:
    // **NOTA:** En una aplicación real, usarías un modal o notificación, no alert().
    alert(`¡Producto "${producto.nombre}" añadido al carrito! (Implementa la lógica real aquí)`);
};

export default function Home(): JSX.Element {
    // 1. Estado para almacenar los productos reales de la API
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    

    // --- Datos Simulados de Noticias y Eventos (RESTAURADOS) ---
    const noticiasFijas = [
        {
            id: 'worlds-2025',
            titulo: 'Worlds 2025: fechas y sede en China',
            resumen:
                'Riot adelantó calendario y ciudades sede del Mundial de League of Legends 2025. La definición promete estadio lleno y nuevo formato.',
            link: 'https://lolesports.com/es-MX/news/worlds-2025-primer',
            img: '/img/inicio/Faker.jpeg',
            etiqueta: 'Nuevo'
        },
        {
            id: 'switch2',
            titulo: 'Adios al mercado del videjuego CS2',
            resumen:
                'El mercado de skins de CS2 ha bajado de valor debido a una actualización de Valve que permitió revertir los intercambios durante 7 días.',
            img: '/img/inicio/CS2.jpg',
            link: 'https://azat.tv/en/valve-cs2-knife-trade-up-update-skin-market-crash/#:~:text=Immediate%20Market%20Impact:%20Billions%20Wiped,the_CS2_economy_was_shattered',
            etiqueta: 'Actualizado'
        }
    ]


    return (
        <div className="container py-4">
            <div className="text-center my-5">
                <h1 className="display-4 text-light">¡Arma tu setup con nuestra selección de hardware y periféricos!</h1>
                <p className="text-muted">Encuentra lo mejor para tu experiencia gamer</p>
            </div>

            {/* ======= Cabecera Noticias (RESTAURADO) ======= */}
            <div className="d-flex align-items-center justify-content-between mb-2">
                <h2 className="h4 m-0 text-brand">Noticias</h2>
                <span className="badge bg-accent">En tiempo real</span>
            </div>

            {/* ======= Trending / Atajos (RESTAURADOS) ======= */}
            <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge rounded-pill bg-success-subtle text-success-emphasis border border-success-subtle">#Worlds2025</span>
                <span className="badge rounded-pill bg-success-subtle text-success-emphasis border border-success-subtle">#Switch2</span>
                <span className="badge rounded-pill bg-success-subtle text-success-emphasis border border-success-subtle">#eSports</span>
                <span className="badge rounded-pill bg-success-subtle text-success-emphasis border border-success-subtle">#NextGen</span>
            </div>

            {/* ======= Widgets ligeros (RESTAURADOS) ======= */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card card-glow h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <div className="text-soft small">Torneos activos</div>
                                <div className="fs-5 fw-semibold">18</div>
                            </div>
                            {/* Icono de Trofeo de Bootstrap Icons */}
                            <i className="bi bi-trophy fs-3 text-accent"></i>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card card-glow h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <div className="text-soft small">Lanzamientos del mes</div>
                                <div className="fs-5 fw-semibold">9</div>
                            </div>
                            {/* Icono de Control de Bootstrap Icons */}
                            <i className="bi bi-controller fs-3 text-accent"></i>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card card-glow h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <div className="text-soft small">Ofertas destacadas</div>
                                <div className="fs-5 fw-semibold">12</div>
                            </div>
                            {/* Icono de Rayo de Bootstrap Icons */}
                            <i className="bi bi-lightning-charge fs-3 text-accent"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* ======= Tarjetas de Noticias (Fijas) ======= */}
            <section>
                <div className="row g-4">
                    {noticiasFijas.map((n: any) => (
                        <div className="col-12 col-lg-6" key={n.id}>
                            <article className="card card-glow h-100">
                                <div className="ratio ratio-21x9">
                                    <img src={n.img} alt={n.titulo} className="rounded-top object-cover" />
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                        <h5 className="card-title mb-0 text-brand">{n.titulo}</h5>
                                        {n.etiqueta && (
                                            <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle">
                                                {n.etiqueta}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-soft">{n.resumen}</p>
                                    <a className="btn btn-primary" href={n.link} target="_blank" rel="noreferrer">
                                        Ver más
                                    </a>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </section>
           
       

            {/* ======= Próximos eventos y lanzamientos (RESTAURADOS) ======= */}
            <div className="mt-5">
                <h3 className="h5 text-brand mb-3">🎮 Próximos eventos y lanzamientos</h3>
                <div className="row g-3">
                    <div className="col-md-4">
                        <div className="card card-glow p-3 text-center">
                            <i className="bi bi-calendar-event fs-3 text-accent"></i>
                            <p className="mt-2 mb-0 fw-semibold">The Game Awards 2025</p>
                            <small className="text-soft">12 de diciembre</small>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-glow p-3 text-center">
                            <i className="bi bi-controller fs-3 text-accent"></i>
                            <p className="mt-2 mb-0 fw-semibold">Nuevo Doom Eternal 2</p>
                            <small className="text-soft">Enero 2026</small>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-glow p-3 text-center">
                            <i className="bi bi-rocket fs-3 text-accent"></i>
                            <p className="mt-2 mb-0 fw-semibold">Lanzamiento Unreal Engine 6</p>
                            <small className="text-soft">Marzo 2026</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}