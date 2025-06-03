import React, { useState, useEffect } from "react";
import { getProductos } from "../../config/api"; // Importa la función de la API
import productosMock from "../../data/ProductosMock"; // Importa los datos mock
import ProductCard from "../ProductCard";
import "./Novedades.css";

const ProductSection = () => {
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiResponse = await getProductos();
        
        if (apiResponse.data?.length > 0) {
          // // Selecciona 4 productos aleatorios de la API
          // const shuffled = [...apiResponse.data].sort(() => 0.5 - Math.random());
          // setRandomProducts(shuffled.slice(0, 4));

          //Selecciona los ultimos 4 productos de la API con el ultimo como primero
          const shuffled = [...apiResponse.data].reverse();
          setRandomProducts(shuffled.slice(0, 4));
        
        } else {
          throw new Error("La API no devolvió datos");
        }
      } catch (apiError) {
        console.warn("Error con API principal:", apiError);
        setUsingMock(true);
        setError("Mostrando datos de demostración");
        // Selecciona 4 productos aleatorios del mock
        const shuffled = [...productosMock].reverse(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    // Simular carga asincrónica
    const timer = setTimeout(() => {
      fetchData();
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
      {error && (
        <div className={`alert ${usingMock ? 'alert-warning' : 'alert-info'}`}>
          {error}
        </div>
      )}
      <div className="products-container">
        {randomProducts.map((product) => (
          <ProductCard
            key={product.id || `${product.name}_${Math.random().toString(36).slice(2, 9)}`}
            product={{
              id: product.id,
              name: product.nombre || product.name || "Producto sin nombre",
              price: product.precio || product.price || 0,
              image: product.imagen || product.image || 'placeholder.jpg',
              description: product.descripcion || product.description || ''
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;