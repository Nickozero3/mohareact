import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProducto } from "../../config/api";
import SubirDatos from "./Subirdatos";
import { FaPlus } from "react-icons/fa";
import "./ListaProductos.css";

const ListarProductos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Obtener productos iniciales
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/productos");
        const data = await response.json();
        setProductos(data);
        setFilteredProductos(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchProductos();
  }, []);
  
  useEffect(() => {
  if (showModal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  return () => {
    document.body.style.overflow = ''; // limpiar en caso de que se desmonte
  };
}, [showModal]);

  // Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await deleteProducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      setFilteredProductos((prev) => prev.filter((p) => p.id !== id));
      alert("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el producto");
    }
  };

 //modificar Producto 
  const modificarProducto = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Error al modificar el producto");
      }
      const updatedProduct = await response.json();
        setProductos((prev) =>
          prev.map((p) => (p.id === id ? updatedProduct : p))
        );
      } catch (error) {
        console.error("Error al modificar el producto:", error);
        alert("No se pudo modificar el producto");
      }
    };


  // Generar sugerencias y filtrar tabla (buscar por nombre o id)
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setSuggestions([]);
      setFilteredProductos(productos);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = productos.filter((p) =>
      p.nombre.toLowerCase().includes(term) ||
      p.id.toString().includes(term)
    );

    setSuggestions(filtered.slice(0, 5));
    setFilteredProductos(filtered);
  }, [searchTerm, productos]);

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?busqueda=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Manejar clic en sugerencia
  const handleSuggestionClick = (product) => {
    setSearchTerm(product.nombre);
    setSuggestions([]);
    setFilteredProductos(
      productos.filter((p) =>
        p.nombre.toLowerCase().includes(product.nombre.toLowerCase())
      )
    );
  };

  // Manejar producto añadido
  const handleProductAdded = (newProduct) => {
    setProductos((prev) => [...prev, newProduct]);
    setFilteredProductos((prev) => [...prev, newProduct]);
    setShowModal(false);
  };

  if (cargando) return <div className="loading-message">Cargando...</div>;

  return (
    <div className="listar-productos-container">
      <h2 className="productos-title">Listado de Productos</h2>

      {/* Barra de búsqueda */}
      <div className="buscador-container">
        <form onSubmit={handleSearch} className="buscador-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="buscador-input"
          />
          <button type="submit" className="buscador-button">
            Buscar
          </button>
        </form>

        {/* Botón para añadir producto */}

        <div className="add-button-container">
          <button onClick={() => setShowModal(true)} className="add-button">
            <FaPlus className="plus-icon" />
            Añadir Producto
          </button>
        </div>

        {/* Sugerencias */}
        {suggestions.length > 0 && (
          <ul className="sugerencias-lista">
            {suggestions.map((product) => (
              <li
                key={product.id}
                onClick={() => handleSuggestionClick(product)}
                className="sugerencia-item"
              >
                {product.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal para añadir producto */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setShowModal(false)}
              className="close-modal-button"
            >
              ×
            </button>
            <SubirDatos
              onClose={() => setShowModal(false)}
              onSuccess={handleProductAdded}
            />
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <table className="productos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductos.length > 0 ? (
            filteredProductos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>
                  <button
                    onClick={() => modificarProducto(producto.id)}
                    className="action-button edit-button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(producto.id)}
                    className="action-button delete-button"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-products">
                {searchTerm
                  ? "No se encontraron productos"
                  : "No hay productos registrados"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListarProductos;
