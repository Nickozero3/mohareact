import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import './Layout.css';
import { Link } from 'react-router-dom';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Control del scroll del body
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  return (
    <div className={`app-container ${isMenuOpen ? 'menu-open' : ''}`}>
      <header className="app-header">
        <div className="logo-container">
          <Link to={"/"}>
            <div className="logodiv">
              <img src="./apple.svg" alt="Logo" className="logo" />
              <p className="parrafo">Cellstore</p>
            </div>
          </Link>
        </div>
        <Nav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </header>

      <div className="main-content">
        <Outlet />
      </div>

      <footer className="app-footer">
        © {new Date().getFullYear()} Cellstore - Todos los derechos reservados
        <p><b>AV EDEN 144, LA FALDA, CORDOBA</b></p>
      </footer>
    </div>
  );
};

export default Layout;