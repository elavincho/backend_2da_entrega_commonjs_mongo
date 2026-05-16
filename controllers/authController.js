const Usuario = require('../models/Usuario');

const authController = {
  // Mostrar formulario de login
  loginForm: (req, res) => {
    res.render('auth/login', {
      titulo: 'Iniciar Sesión - TodoStock S.A.',
      error: null,
      datos: null
    });
  },

  // Procesar login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Buscar usuario por username o email
      const usuario = await Usuario.findOne({
        $or: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() }
        ]
      });
      
      if (!usuario) {
        return res.render('auth/login', {
          titulo: 'Iniciar Sesión - TodoStock S.A.',
          error: 'Usuario o contraseña incorrectos',
          datos: { username }
        });
      }
      
      // Verificar si está activo
      if (!usuario.activo) {
        return res.render('auth/login', {
          titulo: 'Iniciar Sesión - TodoStock S.A.',
          error: 'Usuario desactivado. Contacte al administrador',
          datos: { username }
        });
      }
      
      // Verificar contraseña
      const isValid = await usuario.comparePassword(password);
      if (!isValid) {
        return res.render('auth/login', {
          titulo: 'Iniciar Sesión - TodoStock S.A.',
          error: 'Usuario o contraseña incorrectos',
          datos: { username }
        });
      }
      
      // Actualizar último acceso
      usuario.ultimoAcceso = new Date();
      await usuario.save();
      
      // Guardar sesión
      req.session.usuario = {
        id: usuario._id,
        username: usuario.username,
        email: usuario.email,
        nombreCompleto: usuario.nombreCompleto,
        rol: usuario.rol
      };
      
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.render('auth/login', {
        titulo: 'Iniciar Sesión - TodoStock S.A.',
        error: 'Error al iniciar sesión. Intente nuevamente',
        datos: req.body
      });
    }
  },

  // Mostrar formulario de registro
  registerForm: (req, res) => {
    res.render('auth/register', {
      titulo: 'Registrarse - TodoStock S.A.',
      error: null,
      datos: null
    });
  },

  // Procesar registro
  register: async (req, res) => {
    try {
      const { username, email, password, confirmPassword, nombreCompleto } = req.body;
      
      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        return res.render('auth/register', {
          titulo: 'Registrarse - TodoStock S.A.',
          error: 'Las contraseñas no coinciden',
          datos: { username, email, nombreCompleto }
        });
      }
      
      // Validar que la contraseña tenga al menos 6 caracteres
      if (password.length < 6) {
        return res.render('auth/register', {
          titulo: 'Registrarse - TodoStock S.A.',
          error: 'La contraseña debe tener al menos 6 caracteres',
          datos: { username, email, nombreCompleto }
        });
      }
      
      // Verificar si ya existe el usuario o email
      const existeUsuario = await Usuario.findOne({
        $or: [
          { username: username.toLowerCase() },
          { email: email.toLowerCase() }
        ]
      });
      
      if (existeUsuario) {
        return res.render('auth/register', {
          titulo: 'Registrarse - TodoStock S.A.',
          error: 'El nombre de usuario o email ya está registrado',
          datos: { username, email, nombreCompleto }
        });
      }
      
      // Crear nuevo usuario
      const nuevoUsuario = new Usuario({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: password,
        nombreCompleto: nombreCompleto,
        rol: 'usuario',
        activo: true
      });
      
      await nuevoUsuario.save();
      
      res.render('auth/login', {
        titulo: 'Iniciar Sesión - TodoStock S.A.',
        error: null,
        mensajeExito: 'Registro exitoso. Ahora puedes iniciar sesión',
        datos: { username }
      });
    } catch (error) {
      console.error(error);
      res.render('auth/register', {
        titulo: 'Registrarse - TodoStock S.A.',
        error: 'Error al registrar usuario. Intente nuevamente',
        datos: req.body
      });
    }
  },

  // Cerrar sesión
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/login');
    });
  },

  // Dashboard después del login
  dashboard: async (req, res) => {
    try {
      const Producto = require('../models/Producto');
      const Cliente = require('../models/Cliente');
      const Proveedor = require('../models/Proveedor');
      const OrdenPago = require('../models/OrdenPago');
      const FacturaProveedor = require('../models/FacturaProveedor');
      
      const totalProductos = await Producto.countDocuments();
      const totalClientes = await Cliente.countDocuments();
      const totalProveedores = await Proveedor.countDocuments();
      const totalOrdenesPago = await OrdenPago.countDocuments();
      const facturasPendientes = await FacturaProveedor.countDocuments({ estatus: 'Pendiente' });
      
      // Obtener últimas 5 órdenes de pago
      const ultimasOrdenes = await OrdenPago.find()
        .sort({ createdAt: -1 })
        .limit(5);
      
      res.render('auth/dashboard', {
        titulo: 'Dashboard - TodoStock S.A.',
        usuario: req.session.usuario,
        totalProductos,
        totalClientes,
        totalProveedores,
        totalOrdenesPago,
        facturasPendientes,
        ultimasOrdenes
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar dashboard');
    }
  }
};

module.exports = authController;