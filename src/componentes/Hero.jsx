import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import productos from '../data/ProductosMock';

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
    .filter(p => {
      // Busca coincidencias exactas de la cadena completa (no palabras sueltas)
      return p.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .map(p => p.name);

  setSuggestions(filtered);
}, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/productos?busqueda=${encodeURIComponent(searchTerm)}`);
  };

  const handleSuggestionClick = (sug) => {
    setSearchTerm(sug);
    setSuggestions([]);
    navigate(`/productos?busqueda=${encodeURIComponent(sug)}`);
  };

  return (
    <section className="hero">
      <h1>Descubrí los mejores dispositivos</h1>
      <p>Celulares de última generación, calidad y precio imbatible</p>
      <form className="search-container" onSubmit={handleSearch} autoComplete="off">
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
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((sug, index) => (
              <li key={index} onClick={() => handleSuggestionClick(sug)}>
                {sug}
              </li>
            ))}
          </ul>
        )}
      </form>
    </section>
  );
};

export default Hero;
