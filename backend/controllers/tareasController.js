const { getPool } = require('../config/database');

// Crear tarea
const createTarea = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, hora, manzanas } = req.body;
    const pool = getPool();

    const result = await pool.request()
      .input('titulo', titulo)
      .input('descripcion', descripcion)
      .input('fecha', fecha)
      .input('hora', hora)
      .input('manzanas', manzanas)
      .input('creador_id', req.user.id)
      .query(`
        INSERT INTO Tareas (titulo, descripcion, fecha, hora, manzanas, estado, creador_id, fecha_creacion)
        OUTPUT INSERTED.id
        VALUES (@titulo, @descripcion, @fecha, @hora, @manzanas, 'programada', @creador_id, GETDATE())
      `);

    const tareaId = result.recordset[0].id;

    res.status(201).json({ 
      message: 'Tarea creada exitosamente',
      tareaId 
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener todas las tareas
const getTareas = async (req, res) => {
  try {
    const pool = getPool();
    const { estado, manzana } = req.query;

    let query = 'SELECT * FROM Tareas WHERE 1=1';
    const request = pool.request();

    if (estado) {
      query += ' AND estado = @estado';
      request.input('estado', estado);
    }

    if (manzana) {
      query += ' AND (manzanas LIKE @manzana OR manzanas = \'todas\')';
      request.input('manzana', `%${manzana}%`);
    }

    query += ' ORDER BY fecha DESC, hora DESC';

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener tarea por ID
const getTareaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Tareas WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar estado de tarea
const updateEstadoTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'programada', 'en_curso', 'finalizada'
    const pool = getPool();

    await pool.request()
      .input('id', id)
      .input('estado', estado)
      .query('UPDATE Tareas SET estado = @estado WHERE id = @id');

    res.json({ message: 'Estado de tarea actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar estado de tarea:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Registrar asistencia mediante QR
const registrarAsistencia = async (req, res) => {
  try {
    const { tareaId, usuarioId } = req.body;
    const pool = getPool();

    // Verificar si ya registró asistencia
    const existente = await pool.request()
      .input('tareaId', tareaId)
      .input('usuarioId', usuarioId)
      .query('SELECT id FROM Asistencias WHERE tarea_id = @tareaId AND usuario_id = @usuarioId');

    if (existente.recordset.length > 0) {
      return res.status(400).json({ message: 'Ya se registró asistencia para esta tarea' });
    }

    // Registrar asistencia
    await pool.request()
      .input('tareaId', tareaId)
      .input('usuarioId', usuarioId)
      .query('INSERT INTO Asistencias (tarea_id, usuario_id, fecha_registro) VALUES (@tareaId, @usuarioId, GETDATE())');

    res.json({ message: 'Asistencia registrada exitosamente' });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener asistencias de una tarea
const getAsistenciasByTarea = async (req, res) => {
  try {
    const { tareaId } = req.params;
    const pool = getPool();

    const result = await pool.request()
      .input('tareaId', tareaId)
      .query(`
        SELECT a.*, u.nombre_completo, u.curp, u.manzana
        FROM Asistencias a
        INNER JOIN Usuarios u ON a.usuario_id = u.id
        WHERE a.tarea_id = @tareaId
        ORDER BY a.fecha_registro DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener asistencias:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Generar multas automáticas por ausencia
const generarMultasPorAusencia = async (req, res) => {
  try {
    const { tareaId } = req.params;
    const pool = getPool();

    // Obtener la tarea
    const tareaResult = await pool.request()
      .input('tareaId', tareaId)
      .query('SELECT manzanas FROM Tareas WHERE id = @tareaId');

    if (tareaResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const tarea = tareaResult.recordset[0];
    const manzanas = tarea.manzanas;

    // Obtener habitantes que debían asistir
    let habitantesQuery = 'SELECT id FROM Usuarios WHERE rol = \'habitante\' AND estado = \'activo\'';
    const request = pool.request();

    if (manzanas !== 'todas') {
      habitantesQuery += ' AND manzana IN (SELECT value FROM STRING_SPLIT(@manzanas, \',\'))';
      request.input('manzanas', manzanas);
    }

    const habitantesResult = await request.query(habitantesQuery);

    // Obtener quiénes sí asistieron
    const asistenciasResult = await pool.request()
      .input('tareaId', tareaId)
      .query('SELECT usuario_id FROM Asistencias WHERE tarea_id = @tareaId');

    const asistentes = asistenciasResult.recordset.map(a => a.usuario_id);
    const ausentes = habitantesResult.recordset
      .map(h => h.id)
      .filter(id => !asistentes.includes(id));

    // Generar multas de $200 para ausentes
    for (const usuarioId of ausentes) {
      // Verificar si ya tiene multa por esta tarea
      const multaExistente = await pool.request()
        .input('tareaId', tareaId)
        .input('usuarioId', usuarioId)
        .query('SELECT id FROM Multas WHERE tarea_id = @tareaId AND usuario_id = @usuarioId');

      if (multaExistente.recordset.length === 0) {
        await pool.request()
          .input('usuarioId', usuarioId)
          .input('tareaId', tareaId)
          .input('monto', 200)
          .query(`
            INSERT INTO Multas (usuario_id, tarea_id, monto, estado, fecha_creacion)
            VALUES (@usuarioId, @tareaId, @monto, 'pendiente', GETDATE())
          `);
      }
    }

    res.json({ 
      message: 'Multas generadas exitosamente',
      multasGeneradas: ausentes.length
    });
  } catch (error) {
    console.error('Error al generar multas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar tarea
const deleteTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    await pool.request()
      .input('id', id)
      .query('DELETE FROM Tareas WHERE id = @id');

    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  createTarea,
  getTareas,
  getTareaById,
  updateEstadoTarea,
  registrarAsistencia,
  getAsistenciasByTarea,
  generarMultasPorAusencia,
  deleteTarea
};
