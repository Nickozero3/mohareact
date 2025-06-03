import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../config/api';
import productosMock from '../../src/data/ProductosMock';
import './seleccionado.css'; // Asegúrate de tener estilos adecuados

const Seleccionado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const buscarEnMocks = (productId) => {
    const idNum = Number(productId);
    const productoEncontrado = productosMock.find(p => p.id === idNum);
    
    return productoEncontrado || // si no se encuentra, retorna al path /productos
    {
      id: idNum,
      name: 'Producto no encontrado',
      description: 'Este producto no está en la base de datos.',
      price: 0.00,
      image: 'placeholder.png', // Asegúrate de tener un placeholder en tu carpeta de imágenes
      categoria: 'N/A',
    };
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await getProductoById(id);
        
        if (response.data) {
          setProducto(response.data);
        // } else {
        //   setProducto(buscarEnMocks(id));
        //   setUsingMock(true);
        }
      } catch (error) {
        console.error("Error:", error);
        setProducto(buscarEnMocks(id));
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) return <div className="loading">Cargando producto...</div>;

  return (
    <div className="producto-detalle">
      {usingMock && (
        <div className="mock-warning">
          Modo demostración: mostrando datos de ejemplo
        </div>
      )}
      
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Volver
      </button>
      
      <div className="producto-content">
        <div className="producto-imagen-container">
          <img 
  src={producto?.imagen || `${process.env.PUBLIC_URL}/images/${producto.image}`}
  alt={producto?.nombre || producto.name || 'Imagen no disponible'}
  onError={(e) => {
    e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
    e.target.alt = 'Imagen no disponible - placeholder';
  }}
/>
        </div>
        
        <div className="producto-info">
          <h1>{producto?.nombre || producto.name || 'Nombre no disponible'}</h1>
          
          <div className="producto-meta">
            <span className="producto-precio">
              ${producto?.price?.toFixed(2) || producto.precio || '0.00'}
            </span>
            {producto?.categoria && (
              <span className="producto-categoria">{producto.categoria || producto.category}</span>
            )}
          </div>
          
          <p className="producto-descripcion">
            {producto?.description || producto.descripcion || 'Descripción no disponible'}
          </p>
          
          <div className="producto-acciones">
            <button className="btn-primario">
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seleccionado;