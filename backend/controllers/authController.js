const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/database');

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Intento de login:', email);
    
    const pool = getPool();
    console.log('✅ Pool obtenido');

    const result = await pool.request()
      .input('email', email)
      .query('SELECT * FROM Usuarios WHERE correo = @email');

    console.log('📊 Resultados encontrados:', result.recordset.length);

    if (result.recordset.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.recordset[0];
    console.log('👤 Usuario encontrado:', user.nombre_completo);

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔑 Contraseña válida:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar si está aprobado (solo para habitantes)
    if (user.rol === 'habitante' && user.estado !== 'activo') {
      console.log('⚠️ Usuario pendiente de aprobación');
      return res.status(403).json({ message: 'Tu cuenta está pendiente de aprobación por el delegado' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.correo, 
        rol: user.rol,
        nombre: user.nombre_completo
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login exitoso para:', user.nombre_completo);

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre_completo,
        email: user.correo,
        rol: user.rol,
        telefono: user.telefono,
        curp: user.curp,
        manzana: user.manzana,
        estado: user.estado
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Registro
const register = async (req, res) => {
  try {
    const { nombre, telefono, email, curp, manzana, password, ineBase64 } = req.body;
    const pool = getPool();

    // Verificar si el correo ya existe
    const existingUser = await pool.request()
      .input('email', email)
      .query('SELECT id FROM Usuarios WHERE correo = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Verificar si el CURP ya existe
    const existingCurp = await pool.request()
      .input('curp', curp)
      .query('SELECT id FROM Usuarios WHERE curp = @curp');

    if (existingCurp.recordset.length > 0) {
      return res.status(400).json({ message: 'El CURP ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await pool.request()
      .input('nombre', nombre)
      .input('telefono', telefono)
      .input('correo', email)
      .input('curp', curp)
      .input('manzana', manzana)
      .input('password', hashedPassword)
      .input('ine_pdf', ineBase64)
      .query(`
        INSERT INTO Usuarios (nombre_completo, telefono, correo, curp, manzana, password, ine_pdf, rol, estado, fecha_registro)
        OUTPUT INSERTED.id
        VALUES (@nombre, @telefono, @correo, @curp, @manzana, @password, @ine_pdf, 'habitante', 'pendiente', GETDATE())
      `);

    const userId = result.recordset[0].id;

    res.status(201).json({
      message: 'Registro exitoso. Tu cuenta será revisada por el delegado.',
      userId
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', req.user.id)
      .query('SELECT id, nombre_completo, telefono, correo, curp, manzana, rol, estado, ine_pdf FROM Usuarios WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login, register, getProfile };
