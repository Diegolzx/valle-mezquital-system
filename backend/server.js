const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const { connectDB } = require('./config/database');

// Rutas
const authRoutes = require('./routes/auth');
const habitantesRoutes = require('./routes/habitantes');
const tareasRoutes = require('./routes/tareas');
const multasRoutes = require('./routes/multas');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/habitantes', habitantesRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/multas', multasRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// WebSocket para actualizaciones en tiempo real
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

  socket.on('nuevo-registro', (data) => {
    io.emit('actualizar-habitantes', data);
  });

  socket.on('tarea-actualizada', (data) => {
    io.emit('actualizar-tareas', data);
  });

  socket.on('asistencia-registrada', (data) => {
    io.emit('actualizar-asistencias', data);
  });

  socket.on('pago-realizado', (data) => {
    io.emit('actualizar-pagos', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

// Hacer io accesible globalmente
app.set('io', io);

// Inicializar base de datos y servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Inicializar base de datos si es necesario
    const initDB = require('./scripts/initDatabase');
    await initDB();

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🏘️  Sistema Valle Mezquital - Backend              ║
║                                                        ║
║   🚀 Servidor corriendo en puerto ${PORT}                ║
║   📡 WebSocket activado                                ║
║   💾 Base de datos conectada                           ║
║   🌐 http://localhost:${PORT}                          ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
      `);
    });

    // Manejar errores no capturados
    process.on('unhandledRejection', (error) => {
      console.error('❌ Error no manejado:', error);
    });

    // Mantener el proceso vivo
    process.on('SIGINT', () => {
      console.log('\n👋 Cerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };
