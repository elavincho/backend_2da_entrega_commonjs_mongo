const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./config/database");
require('dotenv').config();

const homeRoutes = require("./routes/homeRoutes");
const rutasProductos = require("./routes/productoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const proveedorRoutes = require("./routes/proveedorRoutes");
const finanzasRoutes = require("./routes/finanzasRoutes");

// Conectar a MongoDB
connectDB();

// Configuración de Pug y estaticos
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Uso de las rutas
app.use("/", homeRoutes);
app.use("/productos", rutasProductos);
app.use("/clientes", clienteRoutes);
app.use("/proveedores", proveedorRoutes);
app.use("/finanzas", finanzasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});