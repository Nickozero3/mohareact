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
    
    return productoEncontrado || {
      id: idNum,
      nombre: `Producto ${idNum}`,
      imagen: 'https://via.placeholder.com/400',
      descripcion: `Descripción para el producto ${idNum}`,
      precio: (idNum * 10 + 9.99).toFixed(2),
      categoria: 'General'
    };
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await getProductoById(id);
        
        if (response.data) {
          setProducto(response.data);
        } else {
          setProducto(buscarEnMocks(id));
          setUsingMock(true);
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
  alt={producto?.nombre || 'Imagen no disponible'}
  onError={(e) => {
    e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
    e.target.alt = 'Imagen no disponible - placeholder';
  }}
/>
        </div>
        
        <div className="producto-info">
          <h1>{producto?.name || 'Nombre no disponible'}</h1>
          
          <div className="producto-meta">
            <span className="producto-precio">
              ${producto?.price?.toFixed(2) || '0.00'}
            </span>
            {producto?.categoria && (
              <span className="producto-categoria">{producto.category}</span>
            )}
          </div>
          
          <p className="producto-descripcion">
            {producto?.descripcion || 'Descripción no disponible'}
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