import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, UsuarioAPI } from '@/api/service'; // Asegúrate de importar la interfaz UsuarioAPI
import { Producto, Pedido } from '@/api/api';
import { FaBoxOpen, FaUsers, FaClipboardList, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import '../styles/admin.css'; // Asegúrate de que este archivo exista o usa estilos inline si prefieres

// --- Interfaces Locales ---
interface FormularioProducto {
    id: number | string;
    nombre: string;
    descripcion: string;
    precio: number | string;
    categoriaId: number | string;
    oferta: boolean;
}

const FORMULARIO_INICIAL: FormularioProducto = { id: '', nombre: '', descripcion: '', precio: '', categoriaId: 1, oferta: false };

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export default function AdminPanel() {
    const navigate = useNavigate();

    // --- Estados ---
    const [activeTab, setActiveTab] = useState<'productos' | 'usuarios' | 'pedidos'>('productos');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // Datos
    const [productos, setProductos] = useState<Producto[]>([]);
    const [usuarios, setUsuarios] = useState<UsuarioAPI[]>([]); // Estado para usuarios
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    // Formulario Productos
    const [prodForm, setProdForm] = useState<FormularioProducto>(FORMULARIO_INICIAL);
    const [editingProd, setEditingProd] = useState<boolean>(false);

    // --- Carga de Datos ---
    const cargarTodo = async () => {
        setLoading(true);
        setError('');
        try {
            // 1. Productos (Público o Admin)
            const dataProd = await api.Productos.listar();
            setProductos(dataProd);

            // 2. Usuarios (Solo Admin)
            try {
                const dataUsers = await api.Usuarios.listar();
                setUsuarios(dataUsers);
            } catch (e) { console.warn("No se pudieron cargar usuarios (quizás no eres SuperAdmin)"); }

            // 3. Pedidos (Solo Admin)
            try {
                const dataPedidos = await api.Pedidos.listar();
                setPedidos(dataPedidos);
            } catch (e) { console.warn("No se pudieron cargar pedidos"); }

        } catch (e) {
            console.error(e);
            setError('Error de conexión. Verifica que el backend esté encendido (puerto 8080) y tengas sesión activa.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!api.Auth.isAuthenticated() || !api.Auth.isAnAdmin()) {
            alert('Acceso denegado. Debes ser Administrador.');
            navigate('/');
            return;
        }
        cargarTodo();
    }, [navigate]);

    // --- Lógica Productos ---
    const handleProdSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nombre: prodForm.nombre,
                descripcion: prodForm.descripcion,
                precio: Number(prodForm.precio),
                categoria: { id: Number(prodForm.categoriaId) }
            };

            if (editingProd) {
                await api.Productos.actualizar(Number(prodForm.id), payload);
            } else {
                await api.Productos.crear(payload);
            }
            setProdForm(FORMULARIO_INICIAL);
            setEditingProd(false);
            cargarTodo(); // Recargar tablas
            alert(editingProd ? 'Producto actualizado' : 'Producto creado');
        } catch (err) {
            alert('Error al guardar producto');
        }
    };

    const borrarProducto = async (id: number) => {
        if (confirm('¿Eliminar producto?')) {
            await api.Productos.eliminar(id);
            cargarTodo();
        }
    };

    // --- Lógica Usuarios ---
    const borrarUsuario = async (id: number) => {
        if (confirm('¿Seguro que deseas eliminar a este usuario? Esta acción es irreversible.')) {
            try {
                await api.Usuarios.eliminar(id);
                cargarTodo();
            } catch (e) {
                alert('Error al eliminar usuario (puede tener pedidos asociados).');
            }
        }
    };

    if (loading) return <div className="text-center mt-5 text-white"><h2>Cargando Panel...</h2></div>;

    return (
        <div className="container-fluid py-4 bg-dark min-vh-100 text-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-success">Panel de Administración</h2>
                <button onClick={cargarTodo} className="btn btn-outline-light btn-sm">Refrescar Datos</button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* --- PESTAÑAS DE NAVEGACIÓN --- */}
            <ul className="nav nav-pills mb-4 gap-2">
                <li className="nav-item">
                    <button 
                        className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'productos' ? 'active bg-success' : 'bg-secondary text-white'}`}
                        onClick={() => setActiveTab('productos')}
                    >
                        <FaBoxOpen /> Productos ({productos.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'usuarios' ? 'active bg-primary' : 'bg-secondary text-white'}`}
                        onClick={() => setActiveTab('usuarios')}
                    >
                        <FaUsers /> Usuarios ({usuarios.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'pedidos' ? 'active bg-warning text-dark' : 'bg-secondary text-white'}`}
                        onClick={() => setActiveTab('pedidos')}
                    >
                        <FaClipboardList /> Pedidos ({pedidos.length})
                    </button>
                </li>
            </ul>

            {/* --- CONTENIDO PESTAÑA: PRODUCTOS --- */}
            {activeTab === 'productos' && (
                <div className="row">
                    {/* Formulario */}
                    <div className="col-md-4 mb-4">
                        <div className="card bg-secondary text-white border-0 shadow">
                            <div className="card-header bg-success fw-bold">
                                {editingProd ? 'Editar Producto' : 'Crear Nuevo Producto'}
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleProdSubmit}>
                                    <div className="mb-2">
                                        <label className="form-label small">Nombre</label>
                                        <input className="form-control form-control-sm" value={prodForm.nombre} onChange={e => setProdForm({...prodForm, nombre: e.target.value})} required />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">Descripción</label>
                                        <textarea className="form-control form-control-sm" value={prodForm.descripcion} onChange={e => setProdForm({...prodForm, descripcion: e.target.value})} />
                                    </div>
                                    <div className="row">
                                        <div className="col-6 mb-2">
                                            <label className="form-label small">Precio</label>
                                            <input type="number" className="form-control form-control-sm" value={prodForm.precio} onChange={e => setProdForm({...prodForm, precio: e.target.value})} required />
                                        </div>
                                        <div className="col-6 mb-2">
                                            <label className="form-label small">ID Categoría</label>
                                            <input type="number" className="form-control form-control-sm" value={prodForm.categoriaId} onChange={e => setProdForm({...prodForm, categoriaId: e.target.value})} required />
                                        </div>
                                    </div>
                                    <div className="d-grid gap-2 mt-3">
                                        <button type="submit" className="btn btn-light btn-sm fw-bold">
                                            {editingProd ? 'Guardar Cambios' : 'Crear Producto'}
                                        </button>
                                        {editingProd && (
                                            <button type="button" className="btn btn-outline-light btn-sm" onClick={() => {setProdForm(FORMULARIO_INICIAL); setEditingProd(false)}}>
                                                Cancelar Edición
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Tabla Productos */}
                    <div className="col-md-8">
                        <div className="table-responsive rounded shadow">
                            <table className="table table-dark table-hover align-middle mb-0">
                                <thead className="table-success text-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Categoría</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.nombre}</td>
                                            <td>{CLP.format(p.precio)}</td>
                                            <td>{p.categoria?.nombre || p.categoria?.id}</td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-info me-2" onClick={() => {
                                                    setProdForm({ id: p.id, nombre: p.nombre, descripcion: p.descripcion || '', precio: p.precio, categoriaId: p.categoria?.id || 1, oferta: false });
                                                    setEditingProd(true);
                                                }}><FaEdit /></button>
                                                <button className="btn btn-sm btn-danger" onClick={() => borrarProducto(p.id)}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CONTENIDO PESTAÑA: USUARIOS --- */}
            {activeTab === 'usuarios' && (
                <div className="table-responsive rounded shadow">
                    <div className="alert alert-info d-flex align-items-center">
                        <FaUsers className="me-2"/> Gestión de Usuarios registrados en la base de datos.
                    </div>
                    <table className="table table-dark table-hover align-middle mb-0">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.length > 0 ? usuarios.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td className="fw-bold">{u.nombreUsuario}</td>
                                    <td>{u.nombreCompleto || 'No registrado'}</td>
                                    <td>{u.email}</td>
                                    <td><span className={`badge ${u.rol === 'ADMIN' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{u.rol}</span></td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-danger" onClick={() => borrarUsuario(u.id)} title="Eliminar Usuario">
                                            <FaTrash /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="text-center py-4">No se encontraron usuarios.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- CONTENIDO PESTAÑA: PEDIDOS --- */}
            {activeTab === 'pedidos' && (
                <div className="table-responsive rounded shadow">
                    <table className="table table-dark table-hover align-middle mb-0">
                        <thead className="table-warning text-dark">
                            <tr>
                                <th>ID Pedido</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.length > 0 ? pedidos.map(p => (
                                <tr key={p.id}>
                                    <td>#{p.id}</td>
                                    <td>{p.usuario?.nombreUsuario || 'Desconocido'}</td>
                                    <td><span className="badge bg-info">{p.estado}</span></td>
                                    <td>{new Date(p.fechaCreacion).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-light">Ver Detalle</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="text-center py-4">No hay pedidos registrados.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}