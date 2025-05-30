import { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
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
}, [product]); // ✅ Solo product como dependencia

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
      <button className="product-button">Ver detalles</button>
    </div>
  );
};

export default ProductCard;
