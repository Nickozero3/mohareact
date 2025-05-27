import React from "react";
import productos from "../data/ProductosMock";
import "./Product.css";
import ProductCard from "./ProductCard";

const Product = () => {
  return (
    <main className="product-page">
      <h1>Nuestros Productos</h1>
      <div className="products-container">
        {productos.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default Product;
