require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');

const app = express();

// Configuración CORS para permitir frontend React
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para servir imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Configuración Multer para guardar imágenes en public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Conexión a base de datos MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cellstore_bd',
  waitForConnections: true,
  connectionLimit: 10
});

// Ruta para subir producto con imagen
app.post('/api/productos', upload.single('imagen'), async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'La imagen es requerida' });
    }

    const { nombre, descripcion, precio, categoria, subcategoria } = req.body;

    if (!nombre || !precio || !categoria || !subcategoria) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const [result] = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, categoria, subcategoria, imagen)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, parseFloat(precio), categoria, subcategoria, `/uploads/${req.file.filename}`]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error al guardar producto:', error);
    res.status(500).json({ error: 'Error al guardar el producto' });
  }
});

const fs = require('fs');

// Borrar un producto por ID
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Primero obtenemos la ruta de la imagen para poder eliminarla
    const [rows] = await pool.query('SELECT imagen FROM productos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const imagePath = path.join(__dirname, 'public', rows[0].imagen);

    // Borrar el producto de la base de datos
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);

    // Eliminar imagen del sistema de archivos (si existe)
    fs.unlink(imagePath, (err) => {
      if (err) console.warn('No se pudo eliminar la imagen:', err.message);
    });

    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});



// Ruta para obtener productos
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta para obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
