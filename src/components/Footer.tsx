import React, { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span className="text-center text-muted">
          © {new Date().getFullYear()} Level-Up Gamer - Todos los derechos reservados
        </span>
        <div className="d-flex gap-3">
          <a
            href="https://github.com/luko2k24/Level-up-React"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light text-decoration-none"
          >
            Ver código en GitHub
          </a>
          <span className="text-secondary">Hecho con React + Bootstrap</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;