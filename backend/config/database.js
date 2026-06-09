const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER || 'DIEGO',
  database: process.env.DB_DATABASE || 'ValleMezquital',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

let pool = null;

const connectDB = async () => {
  try {
    if (pool) {
      return pool;
    }
    
    pool = await sql.connect(config);
    console.log('✅ Conexión a SQL Server exitosa');
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar con SQL Server:', error);
    throw error;
  }
};

const getPool = () => {
  // Retornar el pool global de SQL si existe
  if (pool && pool.connected) {
    return pool;
  }
  
  // Si no está conectado, intentar obtener el pool global
  if (sql.globalPool && sql.globalPool.connected) {
    pool = sql.globalPool;
    return pool;
  }
  
  throw new Error('Database not initialized. Call connectDB first.');
};

module.exports = {
  sql,
  connectDB,
  getPool,
  config
};
