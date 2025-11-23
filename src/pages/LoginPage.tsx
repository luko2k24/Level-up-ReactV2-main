import React from 'react';
import FormularioIngreso from '../components/FormularioIngreso'; 

/**
 * Componente de la página de inicio de sesión.
 * Simplemente sirve como contenedor para el componente FormularioIngreso.
 */
const LoginPage: React.FC = () => {
  return (
    <div className="register-page">
      {/* El componente FormularioRegistro contendrá la lógica y el layout del formulario */}
      <FormularioIngreso />
    </div>
  );
};

export default LoginPage;