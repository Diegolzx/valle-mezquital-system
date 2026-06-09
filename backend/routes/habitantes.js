const express = require('express');
const {
  getHabitantes,
  getHabitanteById,
  updateEstadoHabitante,
  updateHabitante,
  deleteHabitante,
  getEstadisticas
} = require('../controllers/habitantesController');
const { authMiddleware, isDelegado } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, isDelegado, getHabitantes);
router.get('/estadisticas', authMiddleware, isDelegado, getEstadisticas);
router.get('/:id', authMiddleware, getHabitanteById);
router.put('/:id/estado', authMiddleware, isDelegado, updateEstadoHabitante);
router.put('/:id', authMiddleware, isDelegado, updateHabitante);
router.delete('/:id', authMiddleware, isDelegado, deleteHabitante);

module.exports = router;
