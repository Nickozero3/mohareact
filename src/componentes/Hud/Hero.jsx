import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productosMock from '../../data/ProductosMock';
import '../Hud/Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        // Primero intentamos con la API
        const apiResponse = await fetch('http://localhost:5000/api/productos');
        let products = [];

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          products = data;
        } else {
          throw new Error('API no disponible');
        }

        const filtered = products
          .filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
          .slice(0, 4);

        setSuggestions(filtered);
        setUsingMock(false);
      } catch (error) {
        console.log('Usando datos mock:', error.message);
        setUsingMock(true);
        
        // Fallback a mock data con manejo correcto de imágenes
        const filtered = productosMock
          .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .slice(0, 4)
          .map(p => ({
            id: p.id,
            nombre: p.name,
            // Asegurar que la ruta de la imagen apunte a /Images/
            imagen: `/Images/${p.image}` // Asume que p.image es el nombre del archivo
          }));

        setSuggestions(filtered);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?busqueda=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.nombre);
    setSuggestions([]);
    navigate(`/productos?busqueda=${encodeURIComponent(product.nombre)}`);
  };

  // Función para manejar errores en imágenes
  const handleImageError = (e) => {
    e.target.src = `${process.env.PUBLIC_URL}/Images/placeholder.png`;
  };

  return (
    <section className="hero">
      <h1>Descubrí los mejores dispositivos</h1>
      <p>Celulares de última generación, calidad y precio imbatible</p>
      
      <form className="search-container" onSubmit={handleSearch} autoComplete="off">
        <div className="search-input-wrapper">
          <input
            type="text"
            id="searchInput"
            placeholder="Buscar dispositivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-cta" type="submit">
            Ver productos
          </button>
        </div>
        
        {suggestions.length > 0 && (
          <div className="suggestions-container">
            {usingMock && (
              <div className="mock-warning">
                Mostrando datos de demostración (API no disponible)
              </div>
            )}
            {suggestions.map((product) => (
              <div 
                key={product.id} 
                className="suggestion-item"
                onClick={() => handleSuggestionClick(product)}
              >
                <div className="suggestion-image-container">
                  <img 
                    src={`${process.env.PUBLIC_URL}${product.imagen}`}
                    alt={product.nombre}
                    onError={handleImageError}
                  />
                </div>
                <span className="suggestion-name">{product.nombre}</span>
              </div>
            ))}
          </div>
        )}
      </form>
    </section>
  );
};

export default Hero;