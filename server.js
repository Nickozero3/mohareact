require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
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
    const safeName = file.originalname.replace(/\s+/g, '_').replace(/[^\w.-]/gi, '');
    const uniqueName = `${Date.now()}-${safeName}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Solo se permiten imágenes JPEG, PNG o WEBP'), false);
};

const upload = multer({ storage, fileFilter });

// Conexión a base de datos MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cellstore_bd',
  waitForConnections: true,
  connectionLimit: 10
});

// Crear producto
app.post('/api/productos', upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'La imagen es requerida' });

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

// Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT imagen FROM productos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const imagePath = path.join(__dirname, 'public', rows[0].imagen);
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);

    fs.unlink(imagePath, (err) => {
      if (err) console.warn('No se pudo eliminar la imagen:', err.message);
    });

    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener producto por ID
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


app.put('/api/productos/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  console.log(`Iniciando actualización para producto ID: ${id}`);

  try {
    // 1. Validar datos básicos
    const { nombre, precio, descripcion, categoria, subcategoria } = req.body;
    if (!nombre || !precio || !categoria || !subcategoria) {
      console.log('Faltan campos obligatorios');
      return res.status(400).json({ 
        success: false,
        error: 'Faltan campos obligatorios',
        requiredFields: ['nombre', 'precio', 'categoria', 'subcategoria']
      });
    }

    // 2. Obtener producto actual (para manejo de imagen)
    const [currentProduct] = await pool.query(
      'SELECT imagen FROM productos WHERE id = ?', 
      [id]
    );
    
    if (currentProduct.length === 0) {
      console.log(`Producto con ID ${id} no encontrado`);
      return res.status(404).json({ 
        success: false,
        error: 'Producto no encontrado'
      });
    }

    // 3. Manejo de la imagen
    let imagenPath = currentProduct[0].imagen;
    if (req.file) {
      console.log('Nueva imagen recibida:', req.file.filename);
      
      // Eliminar imagen anterior si existe
      if (imagenPath) {
        const oldPath = path.join(__dirname, 'public', imagenPath);
        if (fs.existsSync(oldPath)) {
          console.log(`Eliminando imagen anterior: ${oldPath}`);
          fs.unlinkSync(oldPath);
        }
      }
      imagenPath = `/uploads/${req.file.filename}`;
    } else {
      console.log('No se recibió nueva imagen, manteniendo la existente');
    }

    // 4. Actualizar en la base de datos
    console.log('Ejecutando consulta UPDATE...');
    const [updateResult] = await pool.query(
      `UPDATE productos SET 
        nombre = ?, 
        precio = ?, 
        descripcion = ?, 
        categoria = ?, 
        subcategoria = ?, 
        imagen = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        nombre,
        parseFloat(precio),
        descripcion || null,
        categoria,
        subcategoria,
        imagenPath,
        id
      ]
    );

    if (updateResult.affectedRows === 0) {
      console.log('No se afectaron filas en la actualización');
      return res.status(500).json({ 
        success: false,
        error: 'No se pudo actualizar el producto'
      });
    }

    // 5. Obtener el producto COMPLETO actualizado
    console.log('Obteniendo producto actualizado...');
    const [updatedProduct] = await pool.query(
      'SELECT * FROM productos WHERE id = ?', 
      [id]
    );

    if (updatedProduct.length === 0) {
      console.error('Error crítico: Producto no encontrado después de actualización');
      return res.status(500).json({
        success: false,
        error: 'Error interno: No se pudo recuperar el producto actualizado'
      });
    }

    console.log('Actualización exitosa, devolviendo producto:', updatedProduct[0]);
    res.json({ 
      success: true,
      producto: updatedProduct[0], // Asegurarse de devolver esto
      message: 'Producto actualizado correctamente'
    });

  } catch (error) {
    console.error('Error en PUT /api/productos:', error);
    
    // Limpiar archivo subido si hubo error
    if (req.file) {
      const tempPath = path.join(__dirname, 'public', 'uploads', req.file.filename);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});




// Middleware global de errores
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});