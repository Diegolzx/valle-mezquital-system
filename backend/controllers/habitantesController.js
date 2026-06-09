const { getPool } = require('../config/database');

// Obtener todos los habitantes
const getHabitantes = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query(`
        SELECT id, nombre_completo, telefono, correo, curp, manzana, estado, fecha_registro, ine_pdf
        FROM Usuarios 
        WHERE rol = 'habitante'
        ORDER BY fecha_registro DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener habitantes:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener un habitante por ID
const getHabitanteById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    const result = await pool.request()
      .input('id', id)
      .query('SELECT id, nombre_completo, telefono, correo, curp, manzana, estado, fecha_registro, ine_pdf FROM Usuarios WHERE id = @id AND rol = \'habitante\'');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Habitante no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener habitante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Aprobar o rechazar habitante
const updateEstadoHabitante = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'activo' o 'rechazado'
    const pool = getPool();

    await pool.request()
      .input('id', id)
      .input('estado', estado)
      .query('UPDATE Usuarios SET estado = @estado WHERE id = @id AND rol = \'habitante\'');

    res.json({ message: `Habitante ${estado === 'activo' ? 'aprobado' : 'rechazado'} exitosamente` });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar habitante
const updateHabitante = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, correo, manzana } = req.body;
    const pool = getPool();

    await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('telefono', telefono)
      .input('correo', correo)
      .input('manzana', manzana)
      .query(`
        UPDATE Usuarios 
        SET nombre_completo = @nombre, telefono = @telefono, correo = @correo, manzana = @manzana
        WHERE id = @id AND rol = 'habitante'
      `);

    res.json({ message: 'Habitante actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar habitante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar habitante
const deleteHabitante = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    await pool.request()
      .input('id', id)
      .query('DELETE FROM Usuarios WHERE id = @id AND rol = \'habitante\'');

    res.json({ message: 'Habitante eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar habitante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener estadísticas de habitantes
const getEstadisticas = async (req, res) => {
  try {
    const pool = getPool();
    
    const totalResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Usuarios WHERE rol = \'habitante\' AND estado = \'activo\'');
    
    const pendientesResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Usuarios WHERE rol = \'habitante\' AND estado = \'pendiente\'');

    res.json({
      total: totalResult.recordset[0].total,
      pendientes: pendientesResult.recordset[0].total
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getHabitantes,
  getHabitanteById,
  updateEstadoHabitante,
  updateHabitante,
  deleteHabitante,
  getEstadisticas
};
