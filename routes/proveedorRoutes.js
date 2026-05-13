const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

router.get('/', proveedorController.index);
router.get('/listar', proveedorController.listar);
router.get('/nuevo', proveedorController.formCrear);
router.post('/nuevo', proveedorController.almacenar);
router.get('/editar/:id', proveedorController.formEditar);
router.post('/editar/:id', proveedorController.actualizar);
router.post('/eliminar/:id', proveedorController.eliminar);

module.exports = router;