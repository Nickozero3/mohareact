// src/api.js
import axios from "axios";

// export const API_CONFIG = {
//   BASE_URL:
//     "http://localhost:5000" || "https://mohareact-production.up.railway.app",
//   TIMEOUT: 5000,
//   DEFAULT_HEADERS: {
//     "Content-Type": "application/json",
//   },
// };

// Configuración mejorada para desarrollo/producción
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://mohareact-production.up.railway.app' 
    : 'http://localhost:5000',
  TIMEOUT: 10000, // Aumentado a 10 segundos
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};


const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
  withCredentials: false, // Permite enviar cookies y autenticación
});

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getProductos = () => axiosInstance.get("/api/productos");
export const getProductoById = (id) =>
  axiosInstance.get(`/api/productos/${id}`);

export const createProducto = (data) =>
  axiosInstance.post("/api/productos", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateProducto = (id, formData) => {
  return axiosInstance.put(`/api/productos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProducto = (id) =>
  axiosInstance.delete(`/api/productos/${id}`);

export const getCategorias = () => axiosInstance.get("/api/categorias");
export const getSubcategorias = (categoria) =>
  axiosInstance.get(`/api/subcategorias/${categoria}`);
export const getOfertas = () => axiosInstance.get("/api/ofertas");
export const getContacto = () => axiosInstance.get("/api/contacto");
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("imagen", file);
  return axiosInstance.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getProductosByCategoria = (categoria) =>
  axiosInstance.get(`/api/productos/categoria/${categoria}`);
export const getProductosBySubcategoria = (categoria, subcategoria) =>
  axiosInstance.get(
    `/api/productos/categoria/${categoria}/subcategoria/${subcategoria}`
  );
