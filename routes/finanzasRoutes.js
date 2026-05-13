const express = require("express");
const router = express.Router();
const finanzasController = require("../controllers/finanzasController");

// Ruta principal: resumen financiero
router.get("/", finanzasController.resumen);

module.exports = router;
