import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductos} from "../config/api"; // 👈 usa la función del api.js
import productosMock from "../data/ProductosMock";
import ProductCard from "../componentes/ProductCard";
import "./Product.css";

const Productos = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  const searchTerm = searchParams.get('busqueda') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiResponse = await getProductos(); // 👈 llamada a la API limpia
        
        if (apiResponse.data?.length > 0) {
          setProducts(apiResponse.data);
        } else {
          throw new Error("La API no devolvió datos");
        }
      } catch (apiError) {
        console.warn("Error con API principal:", apiError);
        setUsingMock(true);
        setError(`Error de conexión: ${apiError.message} - Mostrando datos de demostración`);
        setProducts(productosMock);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = searchTerm
    ? products.filter(product =>
        String(product.nombre || product.name || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : products;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <main className="product-page">
      {error && (
        <div className={`alert ${usingMock ? 'alert-warning' : 'alert-info'}`}>
          {error}
          {usingMock && (
            <button 
              onClick={() => window.location.reload()} 
              className="retry-btn"
            >
              Reintentar conexión
            </button>
          )}
        </div>
      )}
      
      <h1>
        {searchTerm ? `Resultados para: "${searchTerm}"` : 'Nuestros Productos'}
        {usingMock && <span className="data-source"> (Datos de demostración)</span>}
      </h1>
      
      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron productos.</p>
          {searchTerm && <p>Intenta con otro término de búsqueda.</p>}
        </div>
      ) : (
        <div className="products-container">
          {filteredProducts.map((product) => (
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
      )}
    </main>
  );
};

export default Productos;
