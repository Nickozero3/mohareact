import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route, useLocation } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Layout from './componentes/Hud/Layout';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Ofertas from './pages/Ofertas';
import Contacto from './pages/Contacto';
import Adminpanel from './componentes/AdminPanel/AdminPanel';
import Seleccionado from './componentes/seleccionado';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}


 

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<Productos />} />
          <Route path="ofertas" element={<Ofertas />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="admin" element={<Adminpanel/>} />
          <Route path="producto" element={<Seleccionado />} />

          
          {/* Catch-all route for 404 Not Found */}
          <Route path="404" element={<NotFound />} />
          {/* Redirect any unmatched routes to NotFound */}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


