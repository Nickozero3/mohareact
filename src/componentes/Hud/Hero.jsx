import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Hud/Hero.css';
// import productos from '../../data/ProductosMock';

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
useEffect(() => {
  const fetchProducts = async () => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      // First try to fetch from API
      const apiResponse = await fetch('http://localhost:5000/api/productos');
      let products = [];

     if (apiResponse.ok) {
        const data = await apiResponse.json();
        products = data;
      }

      // Filter using normalized property names
      const filtered = products
        .filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 4);

      setSuggestions(filtered);
    } catch (error) {
      console.error('Fetch error:', error);
      setSuggestions([]);
    }
  };

  const debounceTimer = setTimeout(fetchProducts, 300);
  return () => clearTimeout(debounceTimer);
}, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`api/productos?busqueda=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.nombre);
    setSuggestions([]);
    navigate(`api/productos?busqueda=${encodeURIComponent(product.nombre)}`);
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
          <button className="btn-cta" type="submit" >
            Ver productos
          </button>
        </div>
        
        {suggestions.length > 0 && (
          <div className="suggestions-container">
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
                    onError={(e) => {
                      e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpg`;
                    }}
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