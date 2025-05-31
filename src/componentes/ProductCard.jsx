import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css'; // Asegúrate de tener estilos para el componente

const ProductCard = ({ product, addToCart }) => {
  const navigate = useNavigate();
  const isFromAPI = product.image?.includes('/uploads/');
  const initialSrc = isFromAPI
    ? `${process.env.PUBLIC_URL}${product.image}`
    : `${process.env.PUBLIC_URL}/images/${product.image}`;

  const [imageSrc, setImageSrc] = useState(initialSrc);
  const [fallbackTried, setFallbackTried] = useState(false);

  useEffect(() => {
    const isFromAPI = product.image?.includes('/uploads/');
    const calculatedSrc = isFromAPI
      ? `${process.env.PUBLIC_URL}${product.image}`
      : `${process.env.PUBLIC_URL}/images/${product.image}`;

    setFallbackTried(false);
    setImageSrc(calculatedSrc);
  }, [product]);

  const handleImageError = () => {
    if (!fallbackTried && !isFromAPI) {
      setImageSrc(`${process.env.PUBLIC_URL}/images/${product.image}`);
      setFallbackTried(true);
    } else {
      setImageSrc(`${process.env.PUBLIC_URL}/images/placeholder.png`);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.image ? (
          <img
            src={imageSrc}
            alt={product.name || `Imagen de ${product.id}`}
            className="product-image"
            onError={handleImageError}
          />
        ) : (
          <div className="image-placeholder">
            <span>Imagen no disponible</span>
          </div>
        )}
      </div>

      <h3>{product.name}</h3>
      <p className="product-price">${product.price}</p>

      <div className="product-actions">
        <button
          className="product-button"
          onClick={() => navigate(`/producto/${product.id}`)}
        >
          Ver detalles
        </button>

        <button
          className="product-button add-to-cart"
          onClick={() => addToCart(product)}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
