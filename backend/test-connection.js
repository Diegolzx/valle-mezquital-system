const sql = require('mssql');
require('dotenv').config();

async function testConnection() {
  const configurations = [
    {
      name: 'Configuración 1: DIEGO (puerto por defecto)',
      config: {
        server: 'DIEGO',
        database: 'master',
        user: 'sa',
        password: process.env.DB_PASSWORD,
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
        }
      }
    },
    {
      name: 'Configuración 2: localhost (puerto por defecto)',
      config: {
        server: 'localhost',
        database: 'master',
        user: 'sa',
        password: process.env.DB_PASSWORD,
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
        }
      }
    },
    {
      name: 'Configuración 3: DIEGO con puerto 1433',
      config: {
        server: 'DIEGO',
        port: 1433,
        database: 'master',
        user: 'sa',
        password: process.env.DB_PASSWORD,
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
        }
      }
    },
    {
      name: 'Configuración 4: localhost con puerto 1433',
      config: {
        server: 'localhost',
        port: 1433,
        database: 'master',
        user: 'sa',
        password: process.env.DB_PASSWORD,
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
        }
      }
    }
  ];

  console.log('🔍 Probando diferentes configuraciones de conexión...');
  console.log(`📋 Contraseña configurada: ${process.env.DB_PASSWORD ? '✅ Sí' : '❌ No'}`);
  console.log('');

  if (!process.env.DB_PASSWORD) {
    console.error('❌ ERROR: No se ha configurado la contraseña en el archivo .env');
    return;
  }

  for (const test of configurations) {
    console.log(`\n🧪 ${test.name}`);
    console.log('━'.repeat(60));
    
    try {
      const pool = await sql.connect(test.config);
      console.log('✅ ¡CONEXIÓN EXITOSA!');
      
      const result = await pool.request().query('SELECT @@VERSION as version, @@SERVERNAME as servername');
      console.log(`📊 Servidor: ${result.recordset[0].servername}`);
      console.log(`📊 Versión: ${result.recordset[0].version.split('\n')[0]}`);
      
      await pool.close();
      
      console.log('\n✅ ESTA ES LA CONFIGURACIÓN CORRECTA:');
      console.log(JSON.stringify(test.config, null, 2));
      return test.config;
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n\n❌ Ninguna configuración funcionó. Por favor verifica:');
  console.log('  1. SQL Server está ejecutándose');
  console.log('  2. SQL Server Authentication está habilitado');
  console.log('  3. El usuario "sa" está habilitado');
  console.log('  4. La contraseña es correcta (1234)');
  console.log('  5. El protocolo TCP/IP está habilitado');
}

testConnection();
