import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Hud/Hero.css';
import productos from '../../data/ProductosMock';

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const filtered = productos
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5); // Limita a 5 sugerencias

    setSuggestions(filtered);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?busqueda=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.name);
    setSuggestions([]);
    navigate(`/productos?busqueda=${encodeURIComponent(product.name)}`);
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
            {suggestions.map((product) => (
              <div 
                key={product.id} 
                className="suggestion-item"
                onClick={() => handleSuggestionClick(product)}
              >
                <div className="suggestion-image-container">
                  <img 
                    src={`${process.env.PUBLIC_URL}/images/${product.image}`} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpg`;
                    }}
                  />
                </div>
                <span className="suggestion-name">{product.name}</span>
              </div>
            ))}
          </div>
        )}
      </form>
    </section>
  );
};

export default Hero;