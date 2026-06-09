const sql = require('mssql');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const config = {
  server: 'DIEGO',
  database: 'ValleMezquital',
  user: 'sa',
  password: '1234',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  }
};

async function checkUser() {
  try {
    console.log('🔍 Verificando usuario delegado...\n');
    
    const pool = await sql.connect(config);
    
    const result = await pool.request()
      .query("SELECT id, nombre_completo, correo, rol, estado, password FROM Usuarios WHERE correo = 'delegado@mezquital.mx'");
    
    if (result.recordset.length === 0) {
      console.log('❌ Usuario delegado NO ENCONTRADO');
      console.log('\nCreando usuario delegado...');
      
      const hashedPassword = await bcrypt.hash('Delegado123*', 10);
      
      await pool.request()
        .input('password', hashedPassword)
        .query(`
          INSERT INTO Usuarios (nombre_completo, telefono, correo, curp, manzana, password, rol, estado)
          VALUES ('Delegado Principal', '7771234567', 'delegado@mezquital.mx', 'DELG900101HMCRLS00', 'N/A', @password, 'delegado', 'activo')
        `);
      
      console.log('✅ Usuario delegado creado correctamente');
    } else {
      const user = result.recordset[0];
      console.log('✅ Usuario encontrado:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.nombre_completo}`);
      console.log(`   Email: ${user.correo}`);
      console.log(`   Rol: ${user.rol}`);
      console.log(`   Estado: ${user.estado}`);
      console.log(`   Password hash: ${user.password.substring(0, 20)}...`);
      
      // Probar la contraseña
      console.log('\n🔐 Probando contraseña...');
      const isValid = await bcrypt.compare('Delegado123*', user.password);
      
      if (isValid) {
        console.log('✅ Contraseña válida');
      } else {
        console.log('❌ Contraseña NO VÁLIDA');
        console.log('\n🔧 Actualizando contraseña...');
        
        const hashedPassword = await bcrypt.hash('Delegado123*', 10);
        
        await pool.request()
          .input('password', hashedPassword)
          .input('email', 'delegado@mezquital.mx')
          .query('UPDATE Usuarios SET password = @password WHERE correo = @email');
        
        console.log('✅ Contraseña actualizada correctamente');
      }
    }
    
    await pool.close();
    console.log('\n✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUser();
