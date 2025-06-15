// src/api.js
import axios from "axios";


// Configuración para desarrollo/producción
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production'
    ? "https://mohareact-production.up.railway.app/api" // Tu URL real de Railway
    : 'http://localhost:5000',
  TIMEOUT: 15000,  // 15 segundos para entornos cloud
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
  withCredentials: false,
  // Configuración adicional para estabilidad
  maxRedirects: 0,

});

// Interceptor mejorado
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const errorDetails = {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method
      },
      response: error.response?.data
    };
    console.error('Error en la petición:', errorDetails);
    return Promise.reject(error);
  }
);

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
