const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// cambio el home
// Ruta principal: Listado
router.get('/', productoController.index);

// Rutas de creación
router.get('/nuevo', productoController.formCrear);
router.post('/nuevo', productoController.almacenar);
router.get('/editar/:id', productoController.formEditar);
router.post('/editar/:id', productoController.actualizar);
router.post('/eliminar/:id', productoController.eliminar);

module.exports = router;