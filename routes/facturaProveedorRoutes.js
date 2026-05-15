const express = require('express');
const router = express.Router();
const facturaProveedorController = require('../controllers/facturaProveedorController');

// Listar todas las facturas
router.get('/', facturaProveedorController.index);

// Crear nueva factura
router.get('/nuevo', facturaProveedorController.formCrear);
router.post('/nuevo', facturaProveedorController.almacenar);

// Ver factura específica
router.get('/ver/:id', facturaProveedorController.ver);

// Cambiar estatus
router.post('/cambiar-estatus/:id', facturaProveedorController.cambiarEstatus);

// Anular factura
router.post('/anular/:id', facturaProveedorController.anular);

// Eliminar factura
router.post('/eliminar/:id', facturaProveedorController.eliminar);

module.exports = router;