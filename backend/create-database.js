const sql = require('mssql');
require('dotenv').config();

async function createDatabase() {
  try {
    console.log('🔧 Creando base de datos ValleMezquital...');
    
    // Conectar a master primero
    const masterConfig = {
      server: process.env.DB_SERVER || 'DIEGO',
      database: 'master',
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      }
    };

    console.log('📡 Conectando a master...');
    const pool = await sql.connect(masterConfig);
    console.log('✅ Conectado a master');

    // Verificar si existe
    const checkDb = await pool.request()
      .query(`SELECT database_id FROM sys.databases WHERE name = 'ValleMezquital'`);

    if (checkDb.recordset.length > 0) {
      console.log('✅ La base de datos ValleMezquital ya existe');
    } else {
      console.log('📦 Creando base de datos...');
      await pool.request().query('CREATE DATABASE ValleMezquital');
      console.log('✅ Base de datos ValleMezquital creada exitosamente');
    }

    await pool.close();
    console.log('\n✅ Proceso completado. Ahora puedes ejecutar: node server.js');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createDatabase();
