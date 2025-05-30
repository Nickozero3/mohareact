import React, { useState } from 'react';
import './Subirdatos.css'; // Asegúrate de tener un archivo CSS para estilos


const SubirDatos = () => {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'Celulares',
    subcategoria: '',
    imagen: null,
    imagenPreview: null
  });

  const categorias = {
    Celulares: ['iPhone', 'Samsung', 'Xiaomi', 'Oppo', 'Motorola'],
    Cables: ['USB-C', 'Lightning', 'Micro USB', 'HDMI'],
    Accesorios: ['Protectores', 'Soportes', 'Adaptadores'],
    Fundas: ['iPhone', 'Samsung', 'Universal'],
    'Audífonos': ['Inalámbricos', 'Con cable', 'Deportivos'],
    Cargadores: ['Inalámbricos', 'Rápidos', 'Automotriz'],
    Otros: ['Varios']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProducto(prev => ({
          ...prev,
          imagen: file,
          imagenPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

    // En tu componente SubirDatos.js
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validación de campos requeridos
  if (!producto.nombre || !producto.descripcion || !producto.precio || !producto.imagen) {
    alert('Por favor complete todos los campos requeridos');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio);
    formData.append('categoria', producto.categoria);
    formData.append('subcategoria', producto.subcategoria);
    formData.append('imagen', producto.imagen, producto.imagen.name);

    console.log('Enviando datos...', {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria: producto.categoria,
      subcategoria: producto.subcategoria,
      imagen: producto.imagen ? producto.imagen.name : 'No hay imagen'
    });

    const response = await fetch('http://localhost:5000/api/productos', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la respuesta del servidor');
 
    }

    alert('Producto subido correctamente!');
    console.log('Respuesta del servidor:', data);
    
    // Resetear formulario
    setProducto({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: 'Celulares',
      subcategoria: '',
      imagen: null,
      imagenPreview: null
    });

  } catch (error) {
    console.error('Error al subir producto:', error);
    alert(`Error: ${error.message}`);
  }
};
  return (
    <div className="upload-container">
      <h1 className="upload-title">Sube tus productos con Zero3Tech</h1>
      
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Producto:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio ($):</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoria">Categoría:</label>
            <select
              id="categoria"
              name="categoria"
              value={producto.categoria}
              onChange={handleChange}
              required
            >
              {Object.keys(categorias).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subcategoria">Subcategoría:</label>
            <select
              id="subcategoria"
              name="subcategoria"
              value={producto.subcategoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {categorias[producto.categoria]?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imagen">Imagen del Producto:</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {producto.imagenPreview && (
            <div className="image-preview">
              <img src={producto.imagenPreview} alt="Vista previa" />
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">Subir Producto</button>
      </form>
    </div>
  );
};

export default SubirDatos;
