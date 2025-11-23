// src/pages/RegisterPage.tsx
import React from 'react';
import FormularioRegistro from '../components/FormularioRegistro'; 

/**
 * Componente funcional para la página de registro.
 */
const RegisterPage: React.FC = () => {
  return (
    <div className="register-page">
      {/* El componente FormularioRegistro contendrá la lógica y el layout del formulario */}
      <FormularioRegistro />
    </div>
  );
};

export default RegisterPage;