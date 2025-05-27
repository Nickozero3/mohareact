import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import './Layout.css';
import { Link } from 'react-router-dom';
// Componente Layout que define la estructura de la aplicación
const Layout = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <Link to={"/"}>
          <div className="logodiv" >
              <img src="./apple.svg" alt="Logo" className="logo" />
                <p className="parrafo">Cellstore</p>
            </div>
          </Link>
        </div>
        <Nav />
      </header>

      <div className="main-content">
        <Outlet /> {/* Aquí se renderizan las páginas */}
      </div>

      <footer className="app-footer">
        © {new Date().getFullYear()}  Cellstore - Todos los derechos reservados
        <p><b>AV EDEN 144, LA FALDA, CORDOBA</b></p>
      </footer>
    </div>
  );
};

export default Layout;