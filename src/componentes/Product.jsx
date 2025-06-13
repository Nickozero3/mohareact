import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductos } from "../config/api";
import productosMock from "../data/ProductosMock";
import ProductCard from "./ProductCard";
import "./Product.css";

const Productos = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const searchTerm = searchParams.get('busqueda') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiResponse = await getProductos();
        
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

  // Filtrar productos según término de búsqueda
const filteredProducts = searchTerm
  ? products.filter(product =>
      String(product.nombre || product.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  : products;
  
  // Calcular productos para la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <>
          <div className="products-container">
            {currentProducts.map((product) => (
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

          {/* Componente de paginación */}
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="page-info">
            Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} de {filteredProducts.length} productos
          </div>
        </>
      )}
    </main>
  );
};

export default Productos;