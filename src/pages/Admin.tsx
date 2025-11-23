import React, { useEffect, useMemo, useState, FormEvent, ChangeEvent } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/admin.css';

// 🚀 IMPORTAMOS SERVICIOS Y TIPOS REALES
import { api } from '../api/service'; 
import { Producto } from '../types/api'; 
// NOTA: Si ProductoPayload no está en src/types/api.ts, debe definirse aquí:
type ProductoPayload = { nombre: string; descripcion: string; precio: number; categoria: { id: number }; };


// --- Tipos de la API para la gestión ---
interface FormularioProducto {
    id: number | string;
    nombre: string;
    descripcion: string; 
    precio: number | string;
    categoriaId: number | string; 
    oferta: boolean;
}

// Interfaz simple para los pedidos recibidos
interface Pedido {
    id: number;
    estado: string;
    fechaCreacion: string;
    usuario: { nombreUsuario: string };
}

const CLP = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
});

// Estado inicial del formulario
const FORMULARIO_INICIAL: FormularioProducto = { 
    id: '', 
    nombre: '', 
    descripcion: '',
    precio: '', 
    categoriaId: 1, 
    oferta: false 
};

// --- Funciones Auxiliares ---
const customConfirm = (message: string): boolean => {
    const result = window.prompt(`${message}\n\nEscribe "ELIMINAR" para confirmar:`);
    return result === 'ELIMINAR';
}

// --- Componente Principal ---

export default function AdminPanel() {
    const navigate = useNavigate();
    const location = useLocation();

    // Estado local para los datos
    const [productos, setProductos] = useState<Producto[]>([]); 
    const [pedidos, setPedidos] = useState<Pedido[]>([]); 
    const [form, setForm] = useState<FormularioProducto>(FORMULARIO_INICIAL); 
    const [editing, setEditing] = useState<boolean>(false);
    const [err, setErr] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);


    // 1. LÓGICA DE CARGA DE DATOS DESDE LA API (ASÍNCRONA)
    const cargarDatos = async () => {
        setLoading(true);
        setErr('');
        try {
            // Carga Productos (GET /api/v1/productos)
            const productosData = await api.Productos.listar();
            setProductos(productosData);

            // Carga Pedidos (GET /api/v1/pedidos - Requiere ADMIN/VENDEDOR)
            const pedidosData = await api.Pedidos.listarTodos();
            setPedidos(pedidosData);

        } catch (e) {
            console.error('Error cargando datos de la API:', e);
            setErr('No se pudieron cargar los datos (Verifique su conexión o token).');
            setProductos([]);
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    };
    
    // 2. CONTROL DE ACCESO y Carga Inicial
    useEffect(() => {
        // Redirige si no está logueado o no tiene el rol ADMIN
        if (!api.Auth.isAuthenticated() || !api.Auth.isAdmin()) {
            alert('Acceso denegado: Se requiere rol de Administrador.');
            navigate('/'); 
            return;
        }
        
        cargarDatos();
    }, [navigate]);

    // Lista ordenada de productos
    const listaOrdenada = useMemo(
        () => [...productos].sort((a, b) => (a.id > b.id ? 1 : -1)),
        [productos]
    );

    const onChange = (k: keyof FormularioProducto, v: string | number | boolean) => setForm(prev => ({ ...prev, [k]: v }));

    /** Valida los campos del formulario. */
    const validar = (): string => {
        if (!String(form.nombre).trim()) return 'El nombre es obligatorio'; 
        
        const price = Number(form.precio);
        if (!Number.isFinite(price) || price <= 0) return 'El precio debe ser un número mayor a 0';
        
        const categoriaId = Number(form.categoriaId);
        if (!Number.isInteger(categoriaId) || categoriaId <= 0) return 'El ID de categoría es inválido';
        
        return '';
    };

    /** Maneja la creación o actualización del producto. */
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const msg = validar();
        if (msg) {
            setErr(msg);
            return;
        }
        setErr('');

        // 🚀 CONSTRUCCIÓN DEL PAYLOAD (Utiliza el tipo ProductoPayload)
        const payloadBase: ProductoPayload = {
            nombre: String(form.nombre).trim(), 
            descripcion: form.descripcion || '',
            precio: Number(form.precio),
            categoria: { id: Number(form.categoriaId) },
        };

        try {
            if (editing) {
                // 🚀 ACTUALIZACIÓN (PUT /api/v1/admin/productos/{id})
                const id = Number(form.id);
                if (isNaN(id)) throw new Error('ID no válido para edición.');
                
                await api.Productos.actualizar(id, payloadBase); 
                alert('Producto actualizado exitosamente!');

            } else {
                // 🚀 CREACIÓN (POST /api/v1/admin/productos)
                await api.Productos.crear(payloadBase); 
                alert('Producto creado exitosamente!');
            }

            // Limpiar formulario y estado
            setForm(FORMULARIO_INICIAL);
            setEditing(false);
            cargarDatos(); // Recargar datos desde la API
        } catch (e2) {
            console.error('onSubmit error:', e2);
            setErr(`No se pudo guardar. Mensaje: ${e2 instanceof Error ? e2.message : String(e2)}`);
        }
    };

    /** Carga los datos de un producto en el formulario para su edición. */
    const onEdit = (p: Producto) => {
        setForm({
            id: p.id,
            nombre: p.nombre ?? '', 
            descripcion: p.descripcion ?? '',
            precio: p.precio ?? '',
            // Usamos el ID del objeto categoría
            categoriaId: p.categoria?.id ?? 1,
            // Asumimos 'oferta' no viene de la API, por simplicidad, lo dejamos como falso.
            oferta: false 
        });
        setEditing(true);
        setErr('');
    };

    /** Elimina un producto. */
    const onDelete = async (id: number | string) => {
        if (!id) return;
        
        if (customConfirm(`¿Estás seguro de eliminar el producto ${id}? Esta acción no se puede deshacer.`)) {
            try {
                // 🚀 ELIMINACIÓN (DELETE /api/v1/admin/productos/{id})
                await api.Productos.eliminar(Number(id)); 
                cargarDatos();
            } catch (e) {
                console.error('onDelete error:', e);
                setErr('No se pudo eliminar el producto. Revisa los permisos.');
            }
        }
    };

    /** Limpia el formulario y sale del modo edición. */
    const onClear = () => {
        setForm(FORMULARIO_INICIAL);
        setEditing(false);
        setErr('');
    };

    // Renderizado del panel
    if (loading) {
        return <div className="text-center p-5 text-info">Cargando dashboard...</div>;
    }
    
    // Datos para las métricas
    const stats = { compras: pedidos.length, productos: productos.length, usuarios: 892, pendientes: pedidos.filter(p => p.estado === 'PENDIENTE').length };

    // Componente visual para las métricas (usando datos ficticios por ahora)
    const kpiBox = (title: string, value: number, color: string) => (
        <div className="col-12 col-md-4 mb-3">
            <div
                className="card shadow-sm h-100"
                style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', background: '#0f0f0f' }}
            >
                <div
                    className="p-3"
                    style={{
                        background: color,
                        color: '#000',
                        fontWeight: 700,
                        letterSpacing: .2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <span>{title}</span>
                    <span style={{ opacity: .8, fontSize: 12 }}>Dashboard</span>
                </div>
                <div className="p-4 d-flex align-items-end justify-content-between">
                    <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, color: '#fff' }}>{value}</div>
                    <div style={{ color: 'rgba(255,255,255,.75)' }} className="small">Última act.</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="mb-0" style={{ color: '#fff' }}>Panel de administración</h2>
            </div>

            <div className="row">
                {kpiBox('Pedidos', stats.compras, '#30A4FF')}
                {kpiBox('Productos', stats.productos, '#47D16E')}
                {kpiBox('Pendientes', stats.pendientes, '#FFC44D')}
            </div>

            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="form-container">
                        <h2>{editing ? 'Editar Producto' : 'Crear Producto'}</h2>
                        {err && <div className="alert">{err}</div>}
                        <form onSubmit={onSubmit}>
                            <div className="form-group">
                                <label htmlFor="producto-id">ID</label>
                                <input
                                    id="producto-id"
                                    value={form.id}
                                    onChange={e => onChange('id', e.target.value)}
                                    disabled={editing}
                                    placeholder="(auto si lo dejas vacío)"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="producto-nombre">Nombre</label>
                                <input
                                    id="producto-nombre"
                                    value={form.nombre} 
                                    onChange={e => onChange('nombre', e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="producto-descripcion">Descripción</label>
                                <textarea
                                    id="producto-descripcion"
                                    value={form.descripcion} 
                                    onChange={e => onChange('descripcion', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="producto-precio">Precio</label>
                                <input
                                    id="producto-precio"
                                    type="number"
                                    value={form.precio}
                                    onChange={e => onChange('precio', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="producto-categoriaid">ID Categoría (1, 2, 3...)</label>
                                <input
                                    id="producto-categoriaid"
                                    type="number"
                                    value={form.categoriaId}
                                    onChange={e => onChange('categoriaId', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group checkbox-group">
                                <input
                                    id="producto-oferta"
                                    type="checkbox"
                                    checked={form.oferta}
                                    onChange={e => onChange('oferta', e.target.checked)}
                                />
                                <label htmlFor="producto-oferta">En oferta (No usado en API)</label>
                            </div>
                            <div className="form-actions">
                                <button type="submit">{editing ? 'Guardar cambios' : 'Crear'}</button>
                                <button type="button" onClick={onClear}>Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="products-list">
                        <h2>Listado de productos</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Cat.</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaOrdenada.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{p.nombre}</td> 
                                        <td>{p.categoria?.nombre || p.categoria?.id}</td>
                                        <td>{CLP.format(Number(p.precio))}</td>
                                        <td>
                                            <button onClick={() => onEdit(p as any)}>Editar</button>
                                            <button onClick={() => onDelete(p.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                                {listaOrdenada.length === 0 && (
                                    <tr>
                                        <td colSpan={6}>No hay productos.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        <h2 className="mt-5">Pedidos (Requiere ADMIN/VENDEDOR)</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{p.usuario?.nombreUsuario}</td>
                                        <td>{p.estado}</td>
                                        <td>{new Date(p.fechaCreacion).toLocaleDateString('es-CL')}</td>
                                    </tr>
                                ))}
                                {pedidos.length === 0 && <tr><td colSpan={4}>No hay pedidos.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}