require('dotenv').config();

console.log('🔍 Depurando variables de entorno:');
console.log('');
console.log('DB_SERVER:', process.env.DB_SERVER || 'NO CONFIGURADO');
console.log('DB_DATABASE:', process.env.DB_DATABASE || 'NO CONFIGURADO');
console.log('DB_USER:', process.env.DB_USER || 'NO CONFIGURADO');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***configurada***' : 'NO CONFIGURADA');
console.log('');
console.log('Archivo .env cargado desde:', require('path').resolve(__dirname, '.env'));
