const express = require('express');
const {
  getDelegadoDashboard,
  getHabitanteDashboard,
  getEstadisticas
} = require('../controllers/dashboardController');
const { authMiddleware, isDelegado } = require('../middleware/auth');

const router = express.Router();

router.get('/delegado', authMiddleware, isDelegado, getDelegadoDashboard);
router.get('/habitante/:usuarioId', authMiddleware, getHabitanteDashboard);
router.get('/estadisticas', authMiddleware, getEstadisticas);

module.exports = router;
