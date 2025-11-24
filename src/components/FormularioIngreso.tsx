// src/components/FormularioIngreso.tsx
import React, { useState, ChangeEvent, FormEvent, FC } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../styles/FormularioIngreso.css';

// ⚠️ Importamos el servicio de la API y el tipo de petición
import { api } from '../api/service/index'; // Asegúrate de
import { LoginRequest } from '../api/api'; 

const FormularioIngreso: FC = () => {
    // Los nombres de estado coinciden con el DTO (nombreUsuario y password)
    const [nombreUsuario, setNombreUsuario] = useState<string>(''); 
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    
    const navegar = useNavigate();

    const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
        evento.preventDefault();
        setError(''); 

        if (nombreUsuario === '' || password === '') {
            setError('Ambos campos son requeridos');
            return;
        }

        const credentials: LoginRequest = { nombreUsuario, password };

        try {
            // 🚀 LLAMADA REAL AL BACKEND: POST /api/v1/auth/login
            await api.Auth.login(credentials);
            
            alert('Ingreso exitoso');
            
            // Redirigir a la página principal
            navegar('/'); 
            // Esto asegura que el Header se actualice para mostrar "Cerrar Sesión"
            window.location.reload(); 

        } catch (err: any) {
            console.error('Error durante el login:', err);
            // Mensaje de error genérico para el usuario
            setError('Usuario o contraseña incorrectos.'); 
        }
    };

    return (
        <div className="formulario-ingreso">
            <h2>Ingreso</h2>
            <form onSubmit={manejarEnvio}>
                <div>
                    <label>Nombre de Usuario</label>
                    <input
                        type="text" 
                        value={nombreUsuario}
                        onChange={(evento: ChangeEvent<HTMLInputElement>) => setNombreUsuario(evento.target.value)}
                        placeholder="Ingresa tu nombre de usuario"
                        required
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(evento: ChangeEvent<HTMLInputElement>) => setPassword(evento.target.value)}
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Ingresar</button>
            </form>
            <p className="informacion-descuento">
                Si tu correo termina en <b>@duocuc.cl</b> obtienes 20% de descuento de por vida.
            </p>
            <p>
                ¿No tienes cuenta? <NavLink to="/register">Regístrate</NavLink>
            </p>
        </div>
    );
};

export default FormularioIngreso;