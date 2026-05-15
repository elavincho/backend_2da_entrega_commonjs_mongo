const FacturaProveedor = require('../models/FacturaProveedor');
const Proveedor = require('../models/Proveedor');

const facturaProveedorController = {
  // Listar todas las facturas
  index: async (req, res) => {
    try {
      const facturas = await FacturaProveedor.find().sort({ createdAt: -1 });
      res.render('facturas-proveedor/index', {
        titulo: 'Facturas de Proveedores - TodoStock S.A.',
        facturas: facturas
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al listar facturas');
    }
  },

  // Formulario de creación
  formCrear: async (req, res) => {
    try {
      const proveedores = await Proveedor.find().sort({ id: 1 });
      res.render('facturas-proveedor/crear', {
        titulo: 'Nueva Factura de Proveedor',
        proveedores: proveedores,
        error: null,
        datos: null
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar formulario');
    }
  },

  // Guardar nueva factura
  almacenar: async (req, res) => {
    try {
      const {
        proveedorId, numero, puntoVenta, fechaEmision, fechaVencimiento,
        detalles, observaciones, cae, fechaVtoCAE, otrosTributos
      } = req.body;

      // Obtener datos del proveedor
      const proveedor = await Proveedor.findOne({ id: parseInt(proveedorId) });
      if (!proveedor) {
        throw new Error('Proveedor no encontrado');
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
            alicIva: detalles.alicIva[i] || '21%',
            importe: importe
          });
        }
      }

      // Formatear número de factura
      const numeroCompleto = `${String(puntoVenta || 1).padStart(4, '0')}-${String(numero).padStart(8, '0')}`;

      const factura = new FacturaProveedor({
        numero: numeroCompleto,
        puntoVenta: parseInt(puntoVenta) || 1,
        proveedorId: parseInt(proveedorId),
        proveedorInfo: {
          cuit: proveedor.nroDoc,
          razonSocial: proveedor.tipoDoc === 'DNI' ? proveedor.nombre : proveedor.razonSocial,
          localidad: proveedor.direccion?.split(',')[0] || '',
          provincia: '',
          telefono: proveedor.telefono,
          direccion: proveedor.direccion
        },
        fechaEmision: new Date(fechaEmision),
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : null,
        estatus: 'Pendiente',
        detalles: detallesArray,
        otrosTributos: parseFloat(otrosTributos) || 0,
        cae: cae,
        fechaVtoCAE: fechaVtoCAE ? new Date(fechaVtoCAE) : null,
        observaciones: observaciones
      });

      await factura.save();
      res.redirect('/facturas-proveedor');
    } catch (error) {
      console.error(error);
      const proveedores = await Proveedor.find().sort({ id: 1 });
      res.render('facturas-proveedor/crear', {
        titulo: 'Nueva Factura de Proveedor',
        proveedores: proveedores,
        error: error.message,
        datos: req.body
      });
    }
  },

  // Ver detalle de factura
  ver: async (req, res) => {
    try {
      const factura = await FacturaProveedor.findById(req.params.id);
      if (!factura) {
        return res.status(404).send('Factura no encontrada');
      }
      res.render('facturas-proveedor/ver', {
        titulo: `Factura ${factura.numero}`,
        factura: factura
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al mostrar factura');
    }
  },

  // Cambiar estatus
  cambiarEstatus: async (req, res) => {
    try {
      const { estatus } = req.body;
      await FacturaProveedor.findByIdAndUpdate(
        req.params.id,
        { estatus: estatus },
        { new: true }
      );
      res.redirect('/facturas-proveedor');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cambiar estatus');
    }
  },

  // Anular factura
  anular: async (req, res) => {
    try {
      await FacturaProveedor.findByIdAndUpdate(
        req.params.id,
        { estatus: 'Anulada' },
        { new: true }
      );
      res.redirect('/facturas-proveedor');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al anular factura');
    }
  },

  // Eliminar factura
  eliminar: async (req, res) => {
    try {
      await FacturaProveedor.findByIdAndDelete(req.params.id);
      res.redirect('/facturas-proveedor');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar factura');
    }
  }
};

module.exports = facturaProveedorController;