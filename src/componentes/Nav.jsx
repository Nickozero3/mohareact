import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Nav.css';

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Efecto para cerrar menú al cambiar de ruta
  React.useEffect(() => {
    closeMobileMenu();
  }, [location]);

  return (
    <>
      <button 
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Menú"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="nav-list">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active-link' : ''}
              end
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/productos" 
              className={({ isActive }) => isActive ? 'active-link' : ''}
            >
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/ofertas"
              className={({ isActive }) => isActive ? 'active-link' : ''}
            >
              Ofertas
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contacto"
              className={({ isActive }) => isActive ? 'active-link' : ''}
            >
              Contacto
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Nav;