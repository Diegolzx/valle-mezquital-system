const express = require('express');
const {
  getMultas,
  getMultasByUsuario,
  pagarMulta,
  getPagos,
  getRecaudacionMensual,
  getRecaudacionMesActual
} = require('../controllers/multasController');
const { authMiddleware, isDelegado } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, getMultas);
router.get('/usuario/:usuarioId', authMiddleware, getMultasByUsuario);
router.post('/:multaId/pagar', authMiddleware, pagarMulta);
router.get('/pagos/all', authMiddleware, isDelegado, getPagos);
router.get('/pagos/recaudacion-mensual', authMiddleware, isDelegado, getRecaudacionMensual);
router.get('/pagos/recaudacion-mes-actual', authMiddleware, isDelegado, getRecaudacionMesActual);

module.exports = router;
