import React, { useState, useEffect } from "react";
import productos from "../data/ProductosMock";
import ProductCard from "./ProductCard";
import "./Novedades.css";

const ProductSection = () => {
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRandomProducts = () => {
      // Mezclar array y seleccionar 4 productos
      const shuffled = [...productos].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    };

    // Simular carga asincrónica
    const timer = setTimeout(() => {
      setRandomProducts(getRandomProducts());
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="product-section">
        <span className="nov">Novedades</span>
        <div className="loading-spinner">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="product-section">
      <span className="nov">Novedades</span>
      <div className="products-container">
        {randomProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};



export default ProductSection;
