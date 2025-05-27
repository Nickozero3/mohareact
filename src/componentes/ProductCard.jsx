const ProductCard = ({ product }) => (
  <div className="product-card">
    <div className="product-image-container">
      {/* console.log("Ruta de imagen:", `${process.env.PUBLIC_URL}/image/${product.image}`); */}

      {product.image ? (
        <img
          src={`${process.env.PUBLIC_URL}/image/${product.image}`}
          alt={product.name || `Imagen de ${product.id}`}
          
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${process.env.PUBLIC_URL}/image/placeholder.png`;
          }}
          
        />
        
      ) : (
        <div className="image-placeholder">
          <span>Imagen no disponible</span>
        </div>
      )}
    </div>
    <h3>{product.name}</h3>
    {/* <p className="product-description">{product.description}</p> */}
    <p className="product-price">${product.price.toLocaleString()}</p>
    <button className="product-button">Ver detalles</button>
  </div>
);
export default ProductCard;
// ProductCard.jsx
// Este componente se encarga de mostrar la tarjeta de un producto individual.
// Recibe un objeto `product` como prop y muestra su imagen, nombre, descripción y precio.
// Si la imagen no está disponible, muestra un mensaje de "Imagen no disponible".
// También maneja el error de carga de la imagen para mostrar una imagen de marcador de posición si es necesario.