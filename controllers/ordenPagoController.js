const OrdenPago = require('../models/OrdenPago');
const Proveedor = require('../models/Proveedor');

const ordenPagoController = {
  // Listar todas las órdenes
  index: async (req, res) => {
    try {
      const ordenes = await OrdenPago.find().sort({ numero: -1 });
      res.render('ordenes-pago/index', {
        titulo: 'Órdenes de Pago - TodoStock S.A.',
        ordenes: ordenes
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al listar órdenes de pago');
    }
  },

  // Formulario de creación
  formCrear: async (req, res) => {
    try {
      const proveedores = await Proveedor.find().sort({ id: 1 });
      res.render('ordenes-pago/crear', {
        titulo: 'Nueva Orden de Pago',
        proveedores: proveedores,
        error: null,
        datos: null
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar formulario');
    }
  },

  // Guardar nueva orden
  almacenar: async (req, res) => {
    try {
      const {
        proveedorId, formaPago, referencia, bancoCuenta, fechaPago,
        conceptos, observaciones, elaboradoPor, aprobadoPor,
        recibioConforme, cedula, montoAPagar
      } = req.body;

      // Obtener datos del proveedor
      const proveedor = await Proveedor.findOne({ id: parseInt(proveedorId) });
      if (!proveedor) {
        throw new Error('Proveedor no encontrado');
      }

      // Parsear conceptos del formulario
      const conceptosArray = [];
      if (conceptos && conceptos.codigoConcepto) {
        // Si hay múltiples conceptos
        const numConceptos = conceptos.codigoConcepto.length;
        for (let i = 0; i < numConceptos; i++) {
          conceptosArray.push({
            codigoConcepto: conceptos.codigoConcepto[i],
            descripcion: conceptos.descripcion[i],
            debe: parseFloat(conceptos.debe[i]) || 0,
            haber: parseFloat(conceptos.haber[i]) || 0,
            impuesto: conceptos.impuesto[i] || 'EXE',
            montoImpuesto: parseFloat(conceptos.montoImpuesto[i]) || 0,
            netoRenglon: parseFloat(conceptos.netoRenglon[i]) || 0
          });
        }
      }

      // Calcular subtotales
      let subtotalDebe = 0;
      let subtotalHaber = 0;
      let subtotalImpuesto = 0;
      let subtotalNeto = 0;

      conceptosArray.forEach(c => {
        subtotalDebe += c.debe;
        subtotalHaber += c.haber;
        subtotalImpuesto += c.montoImpuesto;
        subtotalNeto += c.netoRenglon;
      });

      const orden = new OrdenPago({
        proveedorId: parseInt(proveedorId),
        proveedorInfo: {
          rif: proveedor.nroDoc,
          nombre: proveedor.tipoDoc === 'DNI' ? proveedor.nombre : proveedor.razonSocial,
          direccion: proveedor.direccion,
          telefono: proveedor.telefono
        },
        fechaEmision: new Date(),
        estatus: 'Pendiente',
        conceptos: conceptosArray,
        formasPago: [{
          formaPago: formaPago,
          referencia: referencia,
          bancoCuenta: bancoCuenta,
          fecha: new Date(fechaPago),
          montoNeto: parseFloat(montoAPagar)
        }],
        subtotalDebe: subtotalDebe,
        subtotalHaber: subtotalHaber,
        subtotalImpuesto: subtotalImpuesto,
        subtotalNeto: subtotalNeto,
        totalRetencion: 0,
        totalImpuesto: subtotalImpuesto,
        montoAPagar: parseFloat(montoAPagar),
        observaciones: observaciones,
        elaboradoPor: elaboradoPor,
        aprobadoPor: aprobadoPor,
        recibioConforme: recibioConforme,
        cedula: cedula
      });

      await orden.save();
      res.redirect('/ordenes-pago');
    } catch (error) {
      console.error(error);
      const proveedores = await Proveedor.find().sort({ id: 1 });
      res.render('ordenes-pago/crear', {
        titulo: 'Nueva Orden de Pago',
        proveedores: proveedores,
        error: error.message,
        datos: req.body
      });
    }
  },

  // Ver detalle de una orden
  ver: async (req, res) => {
    try {
      const orden = await OrdenPago.findOne({ numero: parseInt(req.params.numero) });
      if (!orden) {
        return res.status(404).send('Orden de pago no encontrada');
      }
      res.render('ordenes-pago/ver', {
        titulo: `Orden de Pago N° ${orden.numero}`,
        orden: orden
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al mostrar orden de pago');
    }
  },

  // Cambiar estatus
  cambiarEstatus: async (req, res) => {
    try {
      const { estatus } = req.body;
      await OrdenPago.findOneAndUpdate(
        { numero: parseInt(req.params.numero) },
        { estatus: estatus },
        { new: true }
      );
      res.redirect('/ordenes-pago');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cambiar estatus');
    }
  },

  // Anular orden
  anular: async (req, res) => {
    try {
      await OrdenPago.findOneAndUpdate(
        { numero: parseInt(req.params.numero) },
        { estatus: 'Anulado' },
        { new: true }
      );
      res.redirect('/ordenes-pago');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al anular orden');
    }
  },

  // Eliminar orden
  eliminar: async (req, res) => {
    try {
      await OrdenPago.findOneAndDelete({ numero: parseInt(req.params.numero) });
      res.redirect('/ordenes-pago');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar orden');
    }
  }
};

module.exports = ordenPagoController;