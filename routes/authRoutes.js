const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas públicas
router.get('/login', authController.loginForm);
router.post('/login', authController.login);
router.get('/register', authController.registerForm);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

// Dashboard (protegido)
router.get('/dashboard', authController.dashboard);

module.exports = router;