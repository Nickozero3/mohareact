require("dotenv").config();
const express = require("express");
const multer = require("multer");
const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();

// Configuración de orígenes permitidos
const allowedOrigins = [
  'http://localhost:3000',
  'https://mohareact-production.up.railway.app'
];

// Configuración CORS mejorada
app.use(cors({
  origin: function (origin, callback) {
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = `Origen '${origin}' no permitido por CORS`;
      console.warn(msg);
      return callback(new Error(msg), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware para preflight requests
app.options('*', cors());

// Middleware para imágenes estáticas
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Configuración Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "uploads"));
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/gi, "");
    const uniqueName = `${Date.now()}-${safeName}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Solo se permiten imágenes JPEG, PNG o WEBP"), false);
};

const upload = multer({ storage, fileFilter });

// Conexión a MySQL mejorada
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "railway",
  waitForConnections: true,
  connectionLimit: 10,
  ssl: process.env.MYSQL_SSL ? { rejectUnauthorized: false } : undefined
});

// Verificación de conexión a la base de datos
async function testDatabaseConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Conexión a MySQL exitosa!');
    
    // Verificar si la tabla productos existe
    const [tables] = await conn.query("SHOW TABLES LIKE 'productos'");
    if (tables.length === 0) {
      console.warn('⚠️ La tabla "productos" no existe en la base de datos');
    }
    
    conn.release();
  } catch (err) {
    console.error('❌ Error conectando a MySQL:', err);
    process.exit(1);
  }
}

// Función mejorada de limpieza de imágenes
async function cleanUnusedImages() {
  try {
    console.log("🔍 Iniciando limpieza de imágenes...");
    
    // Verificar si la tabla existe primero
    const [tables] = await pool.query("SHOW TABLES LIKE 'productos'");
    if (tables.length === 0) {
      console.log('ℹ️ Tabla "productos" no existe, omitiendo limpieza');
      return { success: true, message: 'Tabla no existe' };
    }

    const [products] = await pool.query(
      "SELECT imagen FROM productos WHERE imagen IS NOT NULL AND imagen != ''"
    );

    const usedImages = products
      .map((p) => (p.imagen ? path.basename(p.imagen) : null))
      .filter(Boolean);

    const uploadsPath = path.join(__dirname, "public", "uploads");
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
      return {
        success: true,
        message: "📁 Carpeta uploads creada",
        deletedCount: 0,
      };
    }

    const allFiles = fs.readdirSync(uploadsPath);
    const imageFiles = allFiles.filter((file) =>
      [".jpg", ".jpeg", ".png", ".webp"].includes(
        path.extname(file).toLowerCase()
      )
    );
    const unusedImages = imageFiles.filter((img) => !usedImages.includes(img));

    let deletedCount = 0;
    unusedImages.forEach((img) => {
      try {
        fs.unlinkSync(path.join(uploadsPath, img));
        deletedCount++;
        console.log(`🗑️ Eliminada: ${img}`);
      } catch (err) {
        console.error(`❌ Error eliminando ${img}:`, err.message);
      }
    });

    console.log(`✅ Limpieza completada. Eliminadas: ${deletedCount} imágenes`);
    return {
      success: true,
      totalImages: imageFiles.length,
      unusedImages: unusedImages.length,
      deletedCount,
    };
  } catch (error) {
    console.error("🔥 Error en limpieza:", error);
    return { success: false, error: error.message };
  }
}

// Endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database: "connected",
    timestamp: new Date()
  });
});

// Endpoint para limpieza manual
app.get("/api/cleanup-images", async (req, res) => {
  const result = await cleanUnusedImages();
  result.success ? res.json(result) : res.status(500).json(result);
});

// [Tus otros endpoints permanecen igual...]

// Manejo de errores mejorado
app.use((err, req, res, next) => {
  console.error("Error del servidor:", err.message);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: "El archivo es demasiado grande" });
  }
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }

  res.status(500).json({ 
    error: "Error interno del servidor",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  
  await testDatabaseConnection();
  
  // Limpieza inicial con retardo
  setTimeout(async () => {
    await cleanUnusedImages();
  }, 5000);
});