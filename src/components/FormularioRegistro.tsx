import React, { useState, FormEvent, FC } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { api } from '../api/service/index'; 
import { RegisterRequest } from '../api/api'; 
// Asume que esta API solo requiere nombreUsuario, email y password.
// Los campos adicionales (región, comuna, etc.) serán solo para el frontend.


// --- MOCK DATA para el campo Región (necesario para el select) ---
const mockRegiones = [
    'Selecciona una región', // Opción por defecto
    'Metropolitana',
    'Valparaíso',
    'Biobío',
    'Antofagasta',
    // ... añadir más regiones si es necesario
];

const FormularioRegistro: FC = () => {
    const [nombreCompleto, setNombreCompleto] = useState<string>(''); // Usado como 'Nombre de Usuario' para la API
    const [edad, setEdad] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>(''); 
    const [confirmarPassword, setConfirmarPassword] = useState<string>('');
    const [region, setRegion] = useState<string>(mockRegiones[0]);
    const [comuna, setComuna] = useState<string>(''); 

    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navegar = useNavigate();

    const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
        evento.preventDefault();
        setError('');
        setSuccess('');

        // 1. Validaciones de Frontend
        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (region === mockRegiones[0]) {
            setError('Por favor, selecciona una región válida.');
            return;
        }
        if (nombreCompleto === '' || email === '' || password === '' || edad === '' || comuna === '') {
            setError('Todos los campos son requeridos');
            return;
        }
        
        // 2. Preparación de datos para la API
        // NOTA: Usamos 'nombreCompleto' como 'nombreUsuario' para tu payload de API existente
        const userData: RegisterRequest = { nombreUsuario: nombreCompleto, email, password }; 

        try {
            // 🚀 LLAMADA REAL AL BACKEND: POST /api/v1/auth/registro
            await api.Auth.register(userData);

            setSuccess('Registro exitoso! Serás redirigido para iniciar sesión.');
            
            setTimeout(() => {
                navegar('/login'); 
            }, 1500); 

        } catch (err: any) {
            console.error('Error durante el registro:', err);
            // Usamos un parseo simple para extraer el mensaje de error de la API
            setError(`Error: ${err.message.split(':').pop()?.trim() || 'No se pudo completar el registro.'}`);
        }
    };

    return (
        // Contenedor principal para centrar el formulario en la página
        <div className="d-flex justify-content-center align-items-center py-5">
            {/* Usamos la clase 'panel' de tu theme.css para el fondo oscuro y borde */}
            <div className="panel p-4 shadow-lg" style={{ maxWidth: '450px', width: '100%' }}>
                
                {/* Título de Neón (usa tu clase .neon-title) */}
                <h2 className="neon-title text-center mb-4">Registro</h2>

                {/* Mensajes de Estado */}
                {error && <div className="alert alert-danger p-2" style={{ color: 'red' }}>{error}</div>}
                {success && <div className="alert alert-success p-2" style={{ color: 'green' }}>{success}</div>}

                <form onSubmit={manejarEnvio}>
                    
                    {/* Campo: Nombre completo */}
                    <div className="mb-3">
                        <label htmlFor="nombreCompleto" className="form-label">Nombre completo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nombreCompleto" 
                            value={nombreCompleto} 
                            onChange={(e) => setNombreCompleto(e.target.value)} 
                            placeholder="Ingresa tu nombre completo" 
                            required 
                        />
                    </div>

                    {/* Campo: Edad */}
                    <div className="mb-3">
                        <label htmlFor="edad" className="form-label">Edad</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            id="edad" 
                            value={edad} 
                            onChange={(e) => setEdad(e.target.value)} 
                            placeholder="Ingresa tu edad" 
                            required 
                        />
                    </div>
                    
                    {/* Campo: Correo electrónico */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Ingresa tu correo electrónico" 
                            required 
                        />
                    </div>

                    {/* Campo: Contraseña */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Ingresa tu contraseña" 
                            required 
                        />
                    </div>

                    {/* Campo: Confirmar contraseña */}
                    <div className="mb-3">
                        <label htmlFor="confirmarPassword" className="form-label">Confirmar contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="confirmarPassword" 
                            value={confirmarPassword} 
                            onChange={(e) => setConfirmarPassword(e.target.value)} 
                            placeholder="Confirma tu contraseña" 
                            required 
                        />
                    </div>

                    {/* Campo: Región (Select) */}
                    <div className="mb-3">
                        <label htmlFor="region" className="form-label">Región</label>
                        <select 
                            className="form-select" 
                            id="region" 
                            value={region} 
                            onChange={(e) => setRegion(e.target.value)}
                            required
                        >
                            {mockRegiones.map((r, index) => (
                                <option 
                                    key={r} 
                                    value={r} 
                                    disabled={index === 0}
                                >
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Campo: Comuna */}
                    <div className="mb-4">
                        <label htmlFor="comuna" className="form-label">Comuna</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="comuna" 
                            value={comuna} 
                            onChange={(e) => setComuna(e.target.value)}
                            placeholder="Ingresa tu comuna" 
                            required 
                        />
                    </div>

                    {/* Botón de Registro (btn-success de tu tema) */}
                    <button type="submit" className="btn btn-success w-100" disabled={!!success}>
                        Registrarse
                    </button>
                    
                    {/* Link para ingresar (Login) */}
                    <div className="mt-3 text-center">
                        <p className="text-muted">
                            ¿Ya tienes cuenta? <NavLink to="/login" className="text-primary" style={{ textDecoration: 'none' }}>Ingresa</NavLink>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default FormularioRegistro;