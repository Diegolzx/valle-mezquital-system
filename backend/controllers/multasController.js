const { getPool } = require('../config/database');

// Obtener todas las multas
const getMultas = async (req, res) => {
  try {
    const pool = getPool();
    const { estado, usuarioId } = req.query;

    let query = `
      SELECT m.*, u.nombre_completo, u.curp, t.titulo as tarea_titulo
      FROM Multas m
      INNER JOIN Usuarios u ON m.usuario_id = u.id
      LEFT JOIN Tareas t ON m.tarea_id = t.id
      WHERE 1=1
    `;
    const request = pool.request();

    if (estado) {
      query += ' AND m.estado = @estado';
      request.input('estado', estado);
    }

    if (usuarioId) {
      query += ' AND m.usuario_id = @usuarioId';
      request.input('usuarioId', usuarioId);
    }

    query += ' ORDER BY m.fecha_creacion DESC';

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener multas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener multas de un usuario
const getMultasByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const pool = getPool();

    const result = await pool.request()
      .input('usuarioId', usuarioId)
      .query(`
        SELECT m.*, t.titulo as tarea_titulo, t.fecha as tarea_fecha
        FROM Multas m
        LEFT JOIN Tareas t ON m.tarea_id = t.id
        WHERE m.usuario_id = @usuarioId
        ORDER BY m.fecha_creacion DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener multas del usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Registrar pago de multa
const pagarMulta = async (req, res) => {
  try {
    const { multaId } = req.params;
    const { metodoPago } = req.body;
    const pool = getPool();

    // Actualizar estado de la multa
    await pool.request()
      .input('multaId', multaId)
      .query('UPDATE Multas SET estado = \'pagada\', fecha_pago = GETDATE() WHERE id = @multaId');

    // Obtener datos de la multa
    const multaResult = await pool.request()
      .input('multaId', multaId)
      .query('SELECT * FROM Multas WHERE id = @multaId');

    const multa = multaResult.recordset[0];

    // Registrar pago
    await pool.request()
      .input('multaId', multaId)
      .input('usuarioId', multa.usuario_id)
      .input('monto', multa.monto)
      .input('metodoPago', metodoPago || 'efectivo')
      .query(`
        INSERT INTO Pagos (multa_id, usuario_id, monto, metodo_pago, fecha_pago)
        VALUES (@multaId, @usuarioId, @monto, @metodoPago, GETDATE())
      `);

    res.json({ message: 'Pago registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar pago:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener todos los pagos
const getPagos = async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request()
      .query(`
        SELECT p.*, u.nombre_completo, m.monto
        FROM Pagos p
        INNER JOIN Usuarios u ON p.usuario_id = u.id
        INNER JOIN Multas m ON p.multa_id = m.id
        ORDER BY p.fecha_pago DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener recaudación mensual (julio - mes actual)
const getRecaudacionMensual = async (req, res) => {
  try {
    const pool = getPool();
    const currentYear = new Date().getFullYear();

    const result = await pool.request()
      .input('year', currentYear)
      .query(`
        SELECT 
          MONTH(fecha_pago) as mes,
          SUM(monto) as total
        FROM Pagos
        WHERE YEAR(fecha_pago) = @year AND MONTH(fecha_pago) >= 7
        GROUP BY MONTH(fecha_pago)
        ORDER BY MONTH(fecha_pago)
      `);

    // Crear array con todos los meses desde julio
    const meses = ['Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre'];
    const currentMonth = new Date().getMonth() + 1;
    
    const recaudacion = meses.map((mes, index) => {
      const mesNumero = index + 7;
      if (mesNumero > currentMonth) return null;
      
      const dato = result.recordset.find(r => r.mes === mesNumero);
      return {
        mes,
        total: dato ? dato.total : 0
      };
    }).filter(r => r !== null);

    res.json(recaudacion);
  } catch (error) {
    console.error('Error al obtener recaudación mensual:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener total recaudado del mes actual
const getRecaudacionMesActual = async (req, res) => {
  try {
    const pool = getPool();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const result = await pool.request()
      .input('month', currentMonth)
      .input('year', currentYear)
      .query(`
        SELECT ISNULL(SUM(monto), 0) as total
        FROM Pagos
        WHERE MONTH(fecha_pago) = @month AND YEAR(fecha_pago) = @year
      `);

    res.json({ total: result.recordset[0].total });
  } catch (error) {
    console.error('Error al obtener recaudación del mes:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getMultas,
  getMultasByUsuario,
  pagarMulta,
  getPagos,
  getRecaudacionMensual,
  getRecaudacionMesActual
};
