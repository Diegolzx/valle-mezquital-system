const express = require('express');
const {
  createTarea,
  getTareas,
  getTareaById,
  updateEstadoTarea,
  registrarAsistencia,
  getAsistenciasByTarea,
  generarMultasPorAusencia,
  deleteTarea
} = require('../controllers/tareasController');
const { authMiddleware, isDelegado } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, isDelegado, createTarea);
router.get('/', authMiddleware, getTareas);
router.get('/:id', authMiddleware, getTareaById);
router.put('/:id/estado', authMiddleware, isDelegado, updateEstadoTarea);
router.post('/asistencia', authMiddleware, registrarAsistencia);
router.get('/:tareaId/asistencias', authMiddleware, isDelegado, getAsistenciasByTarea);
router.post('/:tareaId/generar-multas', authMiddleware, isDelegado, generarMultasPorAusencia);
router.delete('/:id', authMiddleware, isDelegado, deleteTarea);

module.exports = router;
