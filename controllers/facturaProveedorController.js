const FacturaProveedor = require("../models/FacturaProveedor");
const Proveedor = require("../models/Proveedor");
const StockService = require("../services/stockService");
const Producto = require("../models/Producto");

const facturaProveedorController = {
  // Listar todas las facturas
  index: async (req, res) => {
    try {
      const facturas = await FacturaProveedor.find().sort({ createdAt: -1 });
      res.render("facturas-proveedor/index", {
        titulo: "Facturas de Proveedores - TodoStock S.A.",
        facturas: facturas,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al listar facturas");
    }
  },

  // Formulario de creación
  formCrear: async (req, res) => {
    try {
      const proveedores = await Proveedor.find().sort({ id: 1 });
      const productos = await StockService.obtenerTodosProductos();
      res.render("facturas-proveedor/crear", {
        titulo: "Nueva Factura de Proveedor",
        proveedores: proveedores,
        productos: productos,
        error: null,
        datos: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar formulario");
    }
  },

  almacenar: async (req, res) => {
    try {
      const {
        proveedorId,
        numero,
        puntoVenta,
        fechaEmision,
        fechaVencimiento,
        detalles,
        observaciones,
        cae,
        fechaVtoCAE,
        otrosTributos,
      } = req.body;

      // Obtener datos del proveedor
      const proveedor = await Proveedor.findOne({ id: parseInt(proveedorId) });
      if (!proveedor) {
        throw new Error("Proveedor no encontrado");
      }

      // Parsear detalles del formulario
      const detallesArray = [];
      if (detalles && detalles.codigo) {
        const numDetalles = detalles.codigo.length;
        for (let i = 0; i < numDetalles; i++) {
          const cantidad = parseFloat(detalles.cantidad[i]) || 0;
          const precioUnitario = parseFloat(detalles.precioUnitario[i]) || 0;
          const importe = cantidad * precioUnitario;

          detallesArray.push({
            codigo: detalles.codigo[i],
            descripcion: detalles.descripcion[i],
            cantidad: cantidad,
            precioUnitario: precioUnitario,
            alicIva: detalles.alicIva[i] || "21%",
            importe: importe,
            productoId:
              detalles.productoId && detalles.productoId[i]
                ? parseInt(detalles.productoId[i])
                : null,
            actualizarStock: true, // ✅ Siempre true, siempre se actualiza el stock
          });
        }
      }

      // Formatear número de factura
      const numeroCompleto = `${String(puntoVenta || 1).padStart(4, "0")}-${String(numero).padStart(8, "0")}`;

      const factura = new FacturaProveedor({
        numero: numeroCompleto,
        puntoVenta: parseInt(puntoVenta) || 1,
        proveedorId: parseInt(proveedorId),
        proveedorInfo: {
          cuit: proveedor.nroDoc,
          razonSocial:
            proveedor.tipoDoc === "DNI"
              ? proveedor.nombre
              : proveedor.razonSocial,
          localidad: proveedor.direccion?.split(",")[0] || "",
          provincia: "",
          telefono: proveedor.telefono,
          direccion: proveedor.direccion,
        },
        fechaEmision: new Date(fechaEmision),
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : null,
        estatus: "Pendiente",
        detalles: detallesArray,
        otrosTributos: parseFloat(otrosTributos) || 0,
        cae: cae,
        fechaVtoCAE: fechaVtoCAE ? new Date(fechaVtoCAE) : null,
        observaciones: observaciones,
        stockActualizado: false,
      });

      await factura.save();

      // ✅ Actualizar stock (esto creará productos nuevos automáticamente)
      const resultadoStock =
        await StockService.actualizarStockDesdeFactura(factura);

      // ✅ Actualizar la factura con los productos creados y marcar como actualizada
      factura.stockActualizado = true;

      // Actualizar los productoId en los detalles si se crearon nuevos
      for (let i = 0; i < factura.detalles.length; i++) {
        const detalle = factura.detalles[i];
        const resultado = resultadoStock.find(
          (r) => r.codigo === detalle.codigo && r.accion === "creado",
        );
        if (resultado && resultado.productoId) {
          detalle.productoId = resultado.productoId;
        }
      }

      await factura.save();

      console.log("📦 Resultado de actualización de stock:", resultadoStock);

      // Mostrar mensaje de éxito con información de productos creados
      const productosCreados = resultadoStock.filter(
        (r) => r.accion === "creado",
      );
      const productosActualizados = resultadoStock.filter(
        (r) => r.accion === "actualizado",
      );

      let mensajeExito = "Factura guardada exitosamente. ";
      if (productosCreados.length > 0) {
        mensajeExito += `Se crearon ${productosCreados.length} productos nuevos: ${productosCreados.map((p) => p.nombre).join(", ")}. `;
      }
      if (productosActualizados.length > 0) {
        mensajeExito += `Se actualizaron ${productosActualizados.length} productos existentes.`;
      }

      req.session.mensajeExito = mensajeExito;
      res.redirect("/facturas-proveedor");
    } catch (error) {
      console.error(error);
      const proveedores = await Proveedor.find().sort({ id: 1 });
      const productos = await StockService.obtenerTodosProductos();
      res.render("facturas-proveedor/crear", {
        titulo: "Nueva Factura de Proveedor",
        proveedores: proveedores,
        productos: productos,
        error: error.message,
        datos: req.body,
      });
    }
  },

  // Ver detalle de factura
  ver: async (req, res) => {
    try {
      const factura = await FacturaProveedor.findById(req.params.id);
      if (!factura) {
        return res.status(404).send("Factura no encontrada");
      }
      res.render("facturas-proveedor/ver", {
        titulo: `Factura ${factura.numero}`,
        factura: factura,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al mostrar factura");
    }
  },

  // Anular factura
  anular: async (req, res) => {
    try {
      const factura = await FacturaProveedor.findById(req.params.id);

      if (factura && factura.estatus !== "Anulada") {
        // Revertir stock si estaba actualizado
        if (factura.stockActualizado) {
          await StockService.revertirStockDesdeFactura(factura);
        }

        factura.estatus = "Anulada";
        await factura.save();
      }

      res.redirect("/facturas-proveedor");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al anular factura");
    }
  },

  // API para buscar productos
  buscarProductos: async (req, res) => {
    try {
      const termino = req.query.q || "";
      const productos = await StockService.buscarProductos(termino);
      res.json({ success: true, productos });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  },

  // Ver inventario
  inventario: async (req, res) => {
    try {
      const inventario = await StockService.obtenerInventario();
      res.render("facturas-proveedor/inventario", {
        titulo: "Inventario de Productos - TodoStock S.A.",
        productos: inventario,
        usuario: req.session.usuario,
        mensajeExito: req.session.mensajeExito,
      });
      req.session.mensajeExito = null;
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar inventario");
    }
  },

  // Cambiar estatus
  cambiarEstatus: async (req, res) => {
    try {
      const { estatus } = req.body;
      await FacturaProveedor.findByIdAndUpdate(
        req.params.id,
        { estatus: estatus },
        { new: true },
      );
      res.redirect("/facturas-proveedor");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cambiar estatus");
    }
  },

  // Eliminar factura
  eliminar: async (req, res) => {
    try {
      const factura = await FacturaProveedor.findById(req.params.id);

      if (
        factura &&
        factura.stockActualizado &&
        factura.estatus !== "Anulada"
      ) {
        await StockService.revertirStockDesdeFactura(factura);
      }

      await FacturaProveedor.findByIdAndDelete(req.params.id);
      res.redirect("/facturas-proveedor");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al eliminar factura");
    }
  },
};

module.exports = facturaProveedorController;
