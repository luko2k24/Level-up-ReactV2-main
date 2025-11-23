// src/components/FormularioRegistro.tsx
import '../styles/FormularioRegistro.css';
import React, { useState, FormEvent, FC } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { api } from '../api/service';
import { RegisterRequest } from '../types/api'; 

const FormularioRegistro: FC = () => {
    const [nombreUsuario, setNombreUsuario] = useState<string>(''); 
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>(''); 
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navegar = useNavigate();

    const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
        evento.preventDefault();
        setError('');
        setSuccess('');

        if (nombreUsuario === '' || email === '' || password === '') {
            setError('Todos los campos son requeridos');
            return;
        }

        const userData: RegisterRequest = { nombreUsuario, email, password };

        try {
            // 🚀 LLAMADA REAL AL BACKEND: POST /api/v1/auth/registro
            await api.Auth.register(userData);

            setSuccess('Registro exitoso! Serás redirigido para iniciar sesión.');
            
            setTimeout(() => {
                navegar('/login'); 
            }, 1500); 

        } catch (err: any) {
            console.error('Error durante el registro:', err);
            // El backend puede devolver mensajes como "Nombre de usuario ya existe."
            // Usamos un parseo simple para extraer el mensaje de error de la API
            setError(`Error: ${err.message.split(':').pop()?.trim() || 'No se pudo completar el registro.'}`);
        }
    };

    return (
        <div className="formulario-registro">
            <h2>Registro de Cuenta</h2>
            <form onSubmit={manejarEnvio}>
                <div>
                    <label>Nombre de Usuario</label>
                    <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} required />
                </div>
                <div>
                    <label>Correo Electrónico</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
                {success && <p className="success" style={{ color: 'green' }}>{success}</p>}

                <button type="submit" disabled={!!success}>Registrar</button>
            </form>
            <p>
                ¿Ya tienes cuenta? <NavLink to="/login">Ingresa</NavLink>
            </p>
        </div>
    );
};

export default FormularioRegistro;