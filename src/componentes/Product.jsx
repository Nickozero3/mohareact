import React from "react";
import { useSearchParams } from "react-router-dom";
import productos from "../data/ProductosMock";
import "./Product.css";
import ProductCard from "./ProductCard";

const Product = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('busqueda') || '';

  const filteredProducts = searchTerm 
    ? productos.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : productos;

  return (
    <main className="product-page">
      <h1>
        {searchTerm ? `Resultados para: "${searchTerm}"` : 'Nuestros Productos'}
      </h1>
      {filteredProducts.length === 0 ? (
        <p>No se encontraron productos con ese nombre.</p>
      ) : (
        <div className="products-container">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Product;