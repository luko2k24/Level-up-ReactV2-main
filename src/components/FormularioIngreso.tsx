// src/components/FormularioIngreso.tsx
import React, { useState, ChangeEvent, FormEvent, FC } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { api } from '@/api/service/index'; // Importación corregida
import type { LoginRequest } from '@/api/api'; 

const FormularioIngreso: FC = () => {
    const navigate = useNavigate();

    // Estados
    const [nombreUsuario, setNombreUsuario] = useState<string>(''); 
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
        evento.preventDefault();
        setError(''); 
        setLoading(true);

        if (!nombreUsuario.trim() || !password.trim()) {
            setError('Ambos campos son requeridos.');
            setLoading(false);
            return;
        }

        const credentials: LoginRequest = { nombreUsuario, password };

        try {
            // 1. Llamada al backend
            const response = await api.Auth.login(credentials);
            
            // 2. Verificar y guardar el token
            if (response && response.token) {
                localStorage.setItem('jwt_token', response.token);
                
                // 3. Avisar al resto de la app (Header)
                window.dispatchEvent(new Event('storage'));

                // 4. Redirigir al home
                navigate('/'); 
            } else {
                throw new Error('Respuesta sin token');
            }

        } catch (err: any) {
            console.error('Error login:', err);
            setError('Usuario o contraseña incorrectos.'); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
            <div className="card shadow-lg p-4 border-0" style={{ width: '100%', maxWidth: '400px' }}>
                
                <h2 className="text-center mb-4 text-primary fw-bold">Iniciar Sesión</h2>
                
                {error && (
                    <div className="alert alert-danger text-center" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Nombre de Usuario</label>
                        <input
                            type="text" 
                            className="form-control"
                            value={nombreUsuario}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNombreUsuario(e.target.value)}
                            placeholder="Ej: gamer123"
                            autoFocus
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-success w-100 py-2 fw-bold shadow-sm"
                        disabled={loading}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-muted small mb-1">
                        Si tu correo termina en <b className="text-dark">@duocuc.cl</b> obtienes 20% de descuento.
                    </p>
                    <hr />
                    <p className="mb-0">
                        ¿No tienes cuenta? <NavLink to="/register" className="text-decoration-none fw-bold">Regístrate aquí</NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FormularioIngreso;