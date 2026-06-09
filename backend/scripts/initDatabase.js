const { sql, config } = require('../config/database');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const initDatabase = async () => {
  try {
    console.log('🔧 Inicializando base de datos...');

    // Conectar sin especificar la base de datos
    const masterConfig = { ...config, database: 'master' };
    const masterPool = await sql.connect(masterConfig);

    // Verificar si la base de datos existe
    const dbCheck = await masterPool.request()
      .query(`SELECT database_id FROM sys.databases WHERE name = '${config.database}'`);

    if (dbCheck.recordset.length === 0) {
      console.log('📦 Creando base de datos...');
      await masterPool.request().query(`CREATE DATABASE ${config.database}`);
      console.log('✅ Base de datos creada');
    } else {
      console.log('✅ Base de datos ya existe');
    }

    await masterPool.close();

    // Conectar a la base de datos específica
    const pool = await sql.connect(config);

    // Crear tablas
    console.log('📋 Creando tablas...');

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
      CREATE TABLE Usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre_completo NVARCHAR(200) NOT NULL,
        telefono NVARCHAR(20),
        correo NVARCHAR(100) UNIQUE NOT NULL,
        curp NVARCHAR(18) UNIQUE,
        manzana NVARCHAR(10),
        password NVARCHAR(255) NOT NULL,
        ine_pdf NVARCHAR(MAX),
        rol NVARCHAR(20) DEFAULT 'habitante',
        estado NVARCHAR(20) DEFAULT 'pendiente',
        fecha_registro DATETIME DEFAULT GETDATE()
      )
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tareas' AND xtype='U')
      CREATE TABLE Tareas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        titulo NVARCHAR(200) NOT NULL,
        descripcion NVARCHAR(MAX),
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        manzanas NVARCHAR(50),
        estado NVARCHAR(20) DEFAULT 'programada',
        creador_id INT,
        fecha_creacion DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (creador_id) REFERENCES Usuarios(id)
      )
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Asistencias' AND xtype='U')
      CREATE TABLE Asistencias (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tarea_id INT NOT NULL,
        usuario_id INT NOT NULL,
        fecha_registro DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (tarea_id) REFERENCES Tareas(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Multas' AND xtype='U')
      CREATE TABLE Multas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        tarea_id INT,
        monto DECIMAL(10,2) NOT NULL,
        estado NVARCHAR(20) DEFAULT 'pendiente',
        fecha_creacion DATETIME DEFAULT GETDATE(),
        fecha_pago DATETIME,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (tarea_id) REFERENCES Tareas(id)
      )
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Pagos' AND xtype='U')
      CREATE TABLE Pagos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        multa_id INT NOT NULL,
        usuario_id INT NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        metodo_pago NVARCHAR(50) DEFAULT 'efectivo',
        fecha_pago DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (multa_id) REFERENCES Multas(id),
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
      )
    `);

    console.log('✅ Tablas creadas');

    // Crear usuario delegado
    const delegadoCheck = await pool.request()
      .query("SELECT id FROM Usuarios WHERE correo = 'delegado@mezquital.mx'");

    if (delegadoCheck.recordset.length === 0) {
      console.log('👤 Creando usuario delegado...');
      const hashedPassword = await bcrypt.hash('Delegado123*', 10);
      
      await pool.request()
        .input('password', hashedPassword)
        .query(`
          INSERT INTO Usuarios (nombre_completo, telefono, correo, curp, manzana, password, rol, estado)
          VALUES ('Delegado Principal', '7771234567', 'delegado@mezquital.mx', 'DELG900101HMCRLS00', 'N/A', @password, 'delegado', 'activo')
        `);
      
      console.log('✅ Usuario delegado creado');
    } else {
      console.log('✅ Usuario delegado ya existe');
    }

    // Importar habitantes desde CSV (si existe)
    await importHabitantesFromCSV(pool);

    // Crear datos de ejemplo
    await crearDatosEjemplo(pool);

    await pool.close();
    console.log('✅ Inicialización de base de datos completada');

  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    throw error;
  }
};

const importHabitantesFromCSV = async (pool) => {
  try {
    const csvPath = path.join(__dirname, '../../database/habitantes.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('⚠️ Archivo habitantes.csv no encontrado, se omite importación');
      return;
    }

    console.log('📥 Importando habitantes desde CSV...');
    
    const habitantes = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          habitantes.push(row);
        })
        .on('end', async () => {
          try {
            for (const habitante of habitantes) {
              const existingUser = await pool.request()
                .input('curp', habitante.curp || habitante.CURP)
                .query('SELECT id FROM Usuarios WHERE curp = @curp');

              if (existingUser.recordset.length === 0) {
                const defaultPassword = await bcrypt.hash('Valle2025*', 10);
                
                await pool.request()
                  .input('nombre', habitante.nombre_completo || habitante.nombre || 'Sin nombre')
                  .input('telefono', habitante.telefono || '0000000000')
                  .input('correo', habitante.correo || habitante.email || `${habitante.curp}@mezquital.mx`)
                  .input('curp', habitante.curp || habitante.CURP || '')
                  .input('manzana', habitante.manzana || '1')
                  .input('password', defaultPassword)
                  .query(`
                    INSERT INTO Usuarios (nombre_completo, telefono, correo, curp, manzana, password, rol, estado)
                    VALUES (@nombre, @telefono, @correo, @curp, @manzana, @password, 'habitante', 'activo')
                  `);
              }
            }
            console.log(`✅ Importados ${habitantes.length} habitantes desde CSV`);
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  } catch (error) {
    console.error('❌ Error al importar CSV:', error);
  }
};

const crearDatosEjemplo = async (pool) => {
  try {
    // Verificar si ya hay tareas
    const tareasCheck = await pool.request().query('SELECT COUNT(*) as total FROM Tareas');
    
    if (tareasCheck.recordset[0].total > 0) {
      console.log('✅ Ya existen datos de ejemplo');
      return;
    }

    console.log('📝 Creando datos de ejemplo...');

    // Obtener ID del delegado
    const delegadoResult = await pool.request()
      .query("SELECT id FROM Usuarios WHERE correo = 'delegado@mezquital.mx'");
    
    const delegadoId = delegadoResult.recordset[0].id;

    // Crear tareas de ejemplo
    const tareas = [
      { titulo: 'Limpieza de área común', descripcion: 'Limpieza general del parque comunitario', fecha: '2024-11-25', hora: '09:00', manzanas: 'todas', estado: 'programada' },
      { titulo: 'Reunión comunitaria', descripcion: 'Junta mensual de vecinos', fecha: '2024-11-20', hora: '18:00', manzanas: 'todas', estado: 'finalizada' },
      { titulo: 'Mantenimiento de jardines', descripcion: 'Poda y riego de áreas verdes', fecha: '2024-11-22', hora: '08:00', manzanas: '1,2', estado: 'en_curso' }
    ];

    for (const tarea of tareas) {
      await pool.request()
        .input('titulo', tarea.titulo)
        .input('descripcion', tarea.descripcion)
        .input('fecha', tarea.fecha)
        .input('hora', tarea.hora)
        .input('manzanas', tarea.manzanas)
        .input('estado', tarea.estado)
        .input('creador_id', delegadoId)
        .query(`
          INSERT INTO Tareas (titulo, descripcion, fecha, hora, manzanas, estado, creador_id)
          VALUES (@titulo, @descripcion, @fecha, @hora, @manzanas, @estado, @creador_id)
        `);
    }

    // Crear pagos de ejemplo desde julio para la gráfica
    const meses = [
      { mes: 7, año: 2024, monto: 3200 },
      { mes: 8, año: 2024, monto: 4800 },
      { mes: 9, año: 2024, monto: 5600 },
      { mes: 10, año: 2024, monto: 4200 },
      { mes: 11, año: 2024, monto: 6000 }
    ];

    // Primero crear una multa temporal para poder crear pagos
    await pool.request()
      .input('usuario_id', delegadoId)
      .input('monto', 200)
      .query(`
        INSERT INTO Multas (usuario_id, monto, estado)
        VALUES (@usuario_id, @monto, 'pagada')
      `);

    const multaResult = await pool.request()
      .query('SELECT TOP 1 id FROM Multas ORDER BY id DESC');
    
    const multaId = multaResult.recordset[0].id;

    for (const mes of meses) {
      const fecha = new Date(mes.año, mes.mes - 1, 15);
      
      await pool.request()
        .input('multa_id', multaId)
        .input('usuario_id', delegadoId)
        .input('monto', mes.monto)
        .input('fecha_pago', fecha)
        .query(`
          INSERT INTO Pagos (multa_id, usuario_id, monto, fecha_pago)
          VALUES (@multa_id, @usuario_id, @monto, @fecha_pago)
        `);
    }

    console.log('✅ Datos de ejemplo creados');
  } catch (error) {
    console.error('❌ Error al crear datos de ejemplo:', error);
  }
};

module.exports = initDatabase;
