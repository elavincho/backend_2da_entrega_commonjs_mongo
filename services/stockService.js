const Producto = require("../models/Producto");

class StockService {
  // Método estático para obtener el próximo ID disponible
  static async getNextProductoId() {
    const ultimoProducto = await Producto.findOne().sort({ id: -1 });
    return ultimoProducto ? ultimoProducto.id + 1 : 1;
  }

  // Actualizar stock desde una factura
  static async actualizarStockDesdeFactura(factura) {
    const resultados = [];

    for (const detalle of factura.detalles) {
      let producto = null;

      // Buscar por ID si se proporcionó
      if (detalle.productoId) {
        producto = await Producto.findOne({ id: detalle.productoId });
      }

      // Si no se encontró por ID, buscar por código
      if (!producto && detalle.codigo) {
        // Intentar buscar por ID numérico
        const codigoNumero = parseInt(detalle.codigo);
        if (!isNaN(codigoNumero)) {
          producto = await Producto.findOne({ id: codigoNumero });
        }

        // Si no, buscar por nombre exacto
        if (!producto && detalle.descripcion) {
          producto = await Producto.findOne({
            nombre: { $regex: `^${detalle.descripcion}$`, $options: "i" },
          });
        }
      }

      if (producto) {
        // Actualizar stock del producto existente
        const stockAnterior = producto.stockActual;
        producto.stockActual += detalle.cantidad;
        // Actualizar precio también (el último precio de compra)
        producto.precio = detalle.precioUnitario;
        await producto.save();

        resultados.push({
          exito: true,
          accion: "actualizado",
          productoId: producto.id,
          nombre: producto.nombre,
          stockAnterior,
          stockNuevo: producto.stockActual,
          cantidadAgregada: detalle.cantidad,
        });
      } else if (detalle.descripcion) {
        // Crear producto automáticamente si no existe
        const nuevoId = await StockService.getNextProductoId(); // ✅ Usar StockService.getNextProductoId()

        const nuevoProducto = new Producto({
          id: nuevoId,
          nombre: detalle.descripcion,
          categoria: "Nuevo",
          precio: detalle.precioUnitario,
          stockActual: detalle.cantidad,
          stockMinimo: 0,
        });

        await nuevoProducto.save();

        // Actualizar el detalle de la factura con el nuevo productoId
        detalle.productoId = nuevoId;

        resultados.push({
          exito: true,
          accion: "creado",
          productoId: nuevoId,
          nombre: detalle.descripcion,
          stockActual: detalle.cantidad,
          cantidadAgregada: detalle.cantidad,
          mensaje: `Producto "${detalle.descripcion}" creado automáticamente (ID: ${nuevoId})`,
        });

        console.log(
          `Producto creado: ${detalle.descripcion} (ID: ${nuevoId})`,
        );
      } else {
        resultados.push({
          exito: false,
          codigo: detalle.codigo,
          descripcion: detalle.descripcion,
          error: "No se pudo crear el producto: falta descripción",
        });
      }
    }

    return resultados;
  }

  // Revertir stock al anular una factura
  static async revertirStockDesdeFactura(factura) {
    const resultados = [];

    for (const detalle of factura.detalles) {
      let producto = null;

      if (detalle.productoId) {
        producto = await Producto.findOne({ id: detalle.productoId });
      } else if (detalle.codigo) {
        const codigoNumero = parseInt(detalle.codigo);
        if (!isNaN(codigoNumero)) {
          producto = await Producto.findOne({ id: codigoNumero });
        }
      }

      if (producto) {
        const stockAnterior = producto.stockActual;
        producto.stockActual -= detalle.cantidad;
        if (producto.stockActual < 0) producto.stockActual = 0;
        await producto.save();

        resultados.push({
          exito: true,
          productoId: producto.id,
          nombre: producto.nombre,
          stockAnterior,
          stockNuevo: producto.stockActual,
          cantidadRevertida: detalle.cantidad,
        });
      } else {
        resultados.push({
          exito: false,
          descripcion: detalle.descripcion,
          error: "Producto no encontrado para revertir stock",
        });
      }
    }

    return resultados;
  }

  // Buscar productos para autocompletado
  static async buscarProductos(termino) {
    const productos = await Producto.find({
      $or: [
        { nombre: { $regex: termino, $options: "i" } },
        { id: !isNaN(termino) ? parseInt(termino) : -1 },
        { categoria: { $regex: termino, $options: "i" } },
      ],
    }).limit(10);

    return productos;
  }

  // Obtener inventario completo
  static async obtenerInventario() {
    const productos = await Producto.find().sort({ id: 1 });

    return productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      stockActual: p.stockActual,
      stockMinimo: p.stockMinimo,
      estado: p.stockActual <= p.stockMinimo ? "⚠️ Bajo stock" : "✅ Normal",
      colorEstado: p.stockActual <= p.stockMinimo ? "#cc0000" : "#28a745",
    }));
  }

  // Obtener todos los productos para el selector
  static async obtenerTodosProductos() {
    return await Producto.find().sort({ nombre: 1 });
  }
}

module.exports = StockService;



