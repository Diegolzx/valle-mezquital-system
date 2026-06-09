const { getPool } = require('../config/database');

// Dashboard del Delegado
const getDelegadoDashboard = async (req, res) => {
  try {
    const pool = getPool();

    // Total de habitantes activos
    const habitantesResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Usuarios WHERE rol = \'habitante\' AND estado = \'activo\'');

    // Tareas activas (programadas + en curso)
    const tareasResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Tareas WHERE estado IN (\'programada\', \'en_curso\')');

    // Recaudación del mes actual
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const recaudacionResult = await pool.request()
      .input('month', currentMonth)
      .input('year', currentYear)
      .query(`
        SELECT ISNULL(SUM(monto), 0) as total
        FROM Pagos
        WHERE MONTH(fecha_pago) = @month AND YEAR(fecha_pago) = @year
      `);

    // Habitantes pendientes de aprobación
    const pendientesResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Usuarios WHERE rol = \'habitante\' AND estado = \'pendiente\'');

    // Multas pendientes
    const multasPendientesResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Multas WHERE estado = \'pendiente\'');

    // Total de deudores
    const deudoresResult = await pool.request()
      .query(`
        SELECT COUNT(DISTINCT usuario_id) as total 
        FROM Multas 
        WHERE estado = 'pendiente'
      `);

    res.json({
      totalHabitantes: habitantesResult.recordset[0].total,
      tareasActivas: tareasResult.recordset[0].total,
      recaudacionMes: recaudacionResult.recordset[0].total,
      habitantesPendientes: pendientesResult.recordset[0].total,
      multasPendientes: multasPendientesResult.recordset[0].total,
      totalDeudores: deudoresResult.recordset[0].total
    });
  } catch (error) {
    console.error('Error al obtener dashboard del delegado:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Dashboard del Habitante
const getHabitanteDashboard = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const pool = getPool();

    // Obtener datos del habitante
    const habitanteResult = await pool.request()
      .input('usuarioId', usuarioId)
      .query('SELECT nombre_completo, curp, manzana, telefono FROM Usuarios WHERE id = @usuarioId');

    if (habitanteResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Habitante no encontrado' });
    }

    const habitante = habitanteResult.recordset[0];

    // Obtener manzana del habitante para filtrar tareas
    const manzana = habitante.manzana;

    // Tareas programadas para su manzana
    const tareasProgramadasResult = await pool.request()
      .input('manzana', manzana)
      .query(`
        SELECT COUNT(*) as total 
        FROM Tareas 
        WHERE estado = 'programada' 
        AND (manzanas LIKE '%' + @manzana + '%' OR manzanas = 'todas')
      `);

    // Tareas en curso para su manzana
    const tareasEnCursoResult = await pool.request()
      .input('manzana', manzana)
      .query(`
        SELECT COUNT(*) as total 
        FROM Tareas 
        WHERE estado = 'en_curso' 
        AND (manzanas LIKE '%' + @manzana + '%' OR manzanas = 'todas')
      `);

    // Multas pendientes del habitante
    const multasResult = await pool.request()
      .input('usuarioId', usuarioId)
      .query(`
        SELECT COUNT(*) as total, ISNULL(SUM(monto), 0) as totalDeuda
        FROM Multas 
        WHERE usuario_id = @usuarioId AND estado = 'pendiente'
      `);

    // Últimas tareas
    const ultimasTareasResult = await pool.request()
      .input('manzana', manzana)
      .query(`
        SELECT TOP 5 id, titulo, descripcion, fecha, hora, estado
        FROM Tareas 
        WHERE (manzanas LIKE '%' + @manzana + '%' OR manzanas = 'todas')
        ORDER BY fecha DESC, hora DESC
      `);

    res.json({
      habitante,
      tareasProgramadas: tareasProgramadasResult.recordset[0].total,
      tareasEnCurso: tareasEnCursoResult.recordset[0].total,
      multasPendientes: multasResult.recordset[0].total,
      totalDeuda: multasResult.recordset[0].totalDeuda,
      ultimasTareas: ultimasTareasResult.recordset
    });
  } catch (error) {
    console.error('Error al obtener dashboard del habitante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener estadísticas generales
const getEstadisticas = async (req, res) => {
  try {
    const pool = getPool();

    // Porcentaje de cumplimiento (asistencias vs total esperado)
    const asistenciasResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Asistencias');

    const tareasFinalizadasResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Tareas WHERE estado = \'finalizada\'');

    const habitantesActivosResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Usuarios WHERE rol = \'habitante\' AND estado = \'activo\'');

    const totalEsperado = tareasFinalizadasResult.recordset[0].total * habitantesActivosResult.recordset[0].total;
    const porcentajeCumplimiento = totalEsperado > 0 
      ? ((asistenciasResult.recordset[0].total / totalEsperado) * 100).toFixed(2)
      : 0;

    // Porcentaje de morosos
    const deudoresResult = await pool.request()
      .query('SELECT COUNT(DISTINCT usuario_id) as total FROM Multas WHERE estado = \'pendiente\'');

    const porcentajeMorosos = habitantesActivosResult.recordset[0].total > 0
      ? ((deudoresResult.recordset[0].total / habitantesActivosResult.recordset[0].total) * 100).toFixed(2)
      : 0;

    res.json({
      porcentajeCumplimiento: parseFloat(porcentajeCumplimiento),
      porcentajeMorosos: parseFloat(porcentajeMorosos),
      totalHabitantes: habitantesActivosResult.recordset[0].total,
      totalAsistencias: asistenciasResult.recordset[0].total,
      totalDeudores: deudoresResult.recordset[0].total
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getDelegadoDashboard,
  getHabitanteDashboard,
  getEstadisticas
};
