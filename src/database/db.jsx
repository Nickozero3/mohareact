//database/db.js

const mysql = require('mysql2/promise')

//mysql://root:vCtTosbYRiFVRmCflclIbPFzkJeSkbPQ@caboose.proxy.rlwy.net:42356/railway 
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
})

module.exports = pool;

