// // const express = require("express");
// // const app = express();
// // const path = require("path");
// // const connectDB = require("./config/database");
// // require("dotenv").config();

// // const homeRoutes = require("./routes/homeRoutes");
// // const rutasProductos = require("./routes/productoRoutes");
// // const clienteRoutes = require("./routes/clienteRoutes");
// // const proveedorRoutes = require("./routes/proveedorRoutes");
// // const finanzasRoutes = require("./routes/finanzasRoutes");
// // const ordenPagoRoutes = require("./routes/ordenPagoRoutes");
// // const facturaProveedorRoutes = require("./routes/facturaProveedorRoutes");

// // // Conectar a MongoDB
// // connectDB();

// // // Configuración de Pug y estaticos
// // app.set("view engine", "pug");
// // app.set("views", path.join(__dirname, "views"));

// // // Middlewares
// // app.use(express.static(path.join(__dirname, "public")));
// // app.use(express.urlencoded({ extended: true }));
// // app.use(express.json());

// // // Uso de las rutas
// // app.use("/", homeRoutes);
// // app.use("/productos", rutasProductos);
// // app.use("/clientes", clienteRoutes);
// // app.use("/proveedores", proveedorRoutes);
// // app.use("/finanzas", finanzasRoutes);
// // app.use("/ordenes-pago", ordenPagoRoutes);
// // app.use("/facturas-proveedor", facturaProveedorRoutes);

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// // });

// // const express = require("express");
// // const app = express();
// // const path = require("path");
// // const session = require('express-session');
// // const MongoStore = require('connect-mongo');
// // const connectDB = require("./config/database");
// // require("dotenv").config();

// // const homeRoutes = require("./routes/homeRoutes");
// // const rutasProductos = require("./routes/productoRoutes");
// // const clienteRoutes = require("./routes/clienteRoutes");
// // const proveedorRoutes = require("./routes/proveedorRoutes");
// // const finanzasRoutes = require("./routes/finanzasRoutes");
// // const ordenPagoRoutes = require("./routes/ordenPagoRoutes");
// // const facturaProveedorRoutes = require("./routes/facturaProveedorRoutes");
// // const authRoutes = require("./routes/authRoutes");

// // // Conectar a MongoDB
// // connectDB();

// // // ✅ CORRECCIÓN para connect-mongo@6.0.0 (versión simple)
// // // app.use(session({
// // //   secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro_2024',
// // //   resave: false,
// // //   saveUninitialized: false,
// // //   store: MongoStore.create({ 
// // //     mongoUrl: process.env.MONGODB_URI
// // //   }),
// // //   cookie: {
// // //     maxAge: 24 * 60 * 60 * 1000,
// // //     httpOnly: true,
// // //     secure: process.env.NODE_ENV === 'production'
// // //   }
// // // }));

// // app.use(session({
// //   secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro_2024',
// //   resave: false,
// //   saveUninitialized: false,
// //   store: MongoStore.create({ 
// //     client: mongoose.connection.getClient(),
// //     dbName: mongoose.connection.name
// //   }),
// //   cookie: {
// //     maxAge: 24 * 60 * 60 * 1000,
// //     httpOnly: true
// //   }
// // }));

// // // Middleware para pasar usuario a todas las vistas
// // app.use((req, res, next) => {
// //   res.locals.usuario = req.session?.usuario || null;
// //   next();
// // });

// // // Middleware para proteger rutas
// // const requireLogin = (req, res, next) => {
// //   if (!req.session?.usuario) {
// //     return res.redirect('/login');
// //   }
// //   next();
// // };

// // // Configuración de Pug y estaticos
// // app.set("view engine", "pug");
// // app.set("views", path.join(__dirname, "views"));

// // // Middlewares
// // app.use(express.static(path.join(__dirname, "public")));
// // app.use(express.urlencoded({ extended: true }));
// // app.use(express.json());

// // // Uso de las rutas - Rutas públicas
// // app.use("/", authRoutes);

// // // Rutas protegidas (requieren login)
// // app.use("/dashboard", requireLogin, authRoutes);
// // app.use("/productos", requireLogin, rutasProductos);
// // app.use("/clientes", requireLogin, clienteRoutes);
// // app.use("/proveedores", requireLogin, proveedorRoutes);
// // app.use("/finanzas", requireLogin, finanzasRoutes);
// // app.use("/ordenes-pago", requireLogin, ordenPagoRoutes);
// // app.use("/facturas-proveedor", requireLogin, facturaProveedorRoutes);
// // app.use("/home", requireLogin, homeRoutes);

// // // Redireccionar raíz a login o dashboard
// // app.get("/", (req, res) => {
// //   if (req.session?.usuario) {
// //     res.redirect('/dashboard');
// //   } else {
// //     res.redirect('/login');
// //   }
// // });

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// // });

// // module.exports = { requireLogin };

// const express = require("express");
// const app = express();
// const path = require("path");
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const mongoose = require('mongoose'); // ✅ IMPORTANTE: Agregar esta línea
// const connectDB = require("./config/database");
// require("dotenv").config();

// const homeRoutes = require("./routes/homeRoutes");
// const rutasProductos = require("./routes/productoRoutes");
// const clienteRoutes = require("./routes/clienteRoutes");
// const proveedorRoutes = require("./routes/proveedorRoutes");
// const finanzasRoutes = require("./routes/finanzasRoutes");
// const ordenPagoRoutes = require("./routes/ordenPagoRoutes");
// const facturaProveedorRoutes = require("./routes/facturaProveedorRoutes");
// const authRoutes = require("./routes/authRoutes");

// // Conectar a MongoDB
// connectDB();

// // ✅ Configuración de sesiones (versión corregida)
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro_2024',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ 
//     client: mongoose.connection.getClient(),
//     dbName: mongoose.connection.name
//   }),
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000,
//     httpOnly: true
//   }
// }));

// // Middleware para pasar usuario a todas las vistas
// app.use((req, res, next) => {
//   res.locals.usuario = req.session?.usuario || null;
//   next();
// });

// // Middleware para proteger rutas
// const requireLogin = (req, res, next) => {
//   if (!req.session?.usuario) {
//     return res.redirect('/login');
//   }
//   next();
// };

// // Configuración de Pug y estaticos
// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));

// // Middlewares
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Uso de las rutas - Rutas públicas
// app.use("/", authRoutes);

// // Rutas protegidas (requieren login)
// app.use("/dashboard", requireLogin, authRoutes);
// app.use("/productos", requireLogin, rutasProductos);
// app.use("/clientes", requireLogin, clienteRoutes);
// app.use("/proveedores", requireLogin, proveedorRoutes);
// app.use("/finanzas", requireLogin, finanzasRoutes);
// app.use("/ordenes-pago", requireLogin, ordenPagoRoutes);
// app.use("/facturas-proveedor", requireLogin, facturaProveedorRoutes);
// app.use("/home", requireLogin, homeRoutes);

// // Redireccionar raíz a login o dashboard
// app.get("/", (req, res) => {
//   if (req.session?.usuario) {
//     res.redirect('/dashboard');
//   } else {
//     res.redirect('/login');
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });

// module.exports = { requireLogin };


const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require("./config/database");
require("dotenv").config();

const homeRoutes = require("./routes/homeRoutes");
const rutasProductos = require("./routes/productoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const proveedorRoutes = require("./routes/proveedorRoutes");
const finanzasRoutes = require("./routes/finanzasRoutes");
const ordenPagoRoutes = require("./routes/ordenPagoRoutes");
const facturaProveedorRoutes = require("./routes/facturaProveedorRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const facturaClienteRoutes = require("./routes/facturaClienteRoutes");
const notaDeDebitoRoutes = require("./routes/notaDeDebitoRoutes");
const notaDeCreditoRoutes = require("./routes/notaDeCreditoRoutes");
const presupuestoRoutes = require("./routes/presupuestoRoutes");

// Conectar a MongoDB
connectDB();

// ✅ Sintaxis para connect-mongo@4.6.0
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro_2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({  // ✅ Esta sintaxis funciona en 4.6.0
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 día
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Middleware para pasar usuario a todas las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session?.usuario || null;
  next();
});

// Middleware para proteger rutas
const requireLogin = (req, res, next) => {
  if (!req.session?.usuario) {
    return res.redirect('/login');
  }
  next();
};

// Configuración de Pug y estaticos
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Uso de las rutas - Rutas públicas
app.use("/", authRoutes);

// Rutas protegidas (requieren login)
app.use("/dashboard", requireLogin, authRoutes);
app.use("/productos", requireLogin, rutasProductos);
app.use("/clientes", requireLogin, clienteRoutes);
app.use("/proveedores", requireLogin, proveedorRoutes);
app.use("/finanzas", requireLogin, finanzasRoutes);
app.use("/ordenes-pago", requireLogin, ordenPagoRoutes);
app.use("/facturas-proveedor", requireLogin, facturaProveedorRoutes);
app.use("/home", requireLogin, homeRoutes);
app.use("/admin", requireLogin, adminRoutes);
app.use("/facturas-cliente", requireLogin, facturaClienteRoutes);
app.use("/notas-debito", requireLogin, notaDeDebitoRoutes);
app.use("/notas-credito", requireLogin, notaDeCreditoRoutes);
app.use("/presupuestos", requireLogin, presupuestoRoutes);

// Redireccionar raíz a login o dashboard
app.get("/", (req, res) => {
  if (req.session?.usuario) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = { requireLogin };