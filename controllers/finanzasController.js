const Cliente = require("../models/Cliente");
const Proveedor = require("../models/Proveedor");

const finanzasController = {
  resumen: async (req, res) => {
    try {
      let totalCobrar = 0;
      let totalPagar = 0;
      const listaFinanzas = [];

      // procesar clientes
      const clientes = await Cliente.find().sort({ id: 1 });
      
      clientes.forEach((c) => {
        // FORZAR a que sea número - SOLUCIÓN PRINCIPAL
        let saldo = 0;
        
        if (typeof c.saldoCuentaCorriente === 'string') {
          // Si es string, limpiar y convertir
          saldo = parseFloat(c.saldoCuentaCorriente.replace(/[^0-9.-]/g, '')) || 0;
        } else if (typeof c.saldoCuentaCorriente === 'number') {
          saldo = c.saldoCuentaCorriente;
        } else {
          saldo = 0;
        }
        
        // Redondear a 2 decimales
        saldo = Math.round(saldo * 100) / 100;
        
        console.log(`Cliente ${c.id}: saldo original = ${c.saldoCuentaCorriente}, convertido = ${saldo}`);

        if (saldo > 0) totalCobrar += saldo;
        if (saldo < 0) totalPagar += Math.abs(saldo);

        listaFinanzas.push({
          entidad: "Cliente",
          id: c.id,
          nombre: c.tipoDoc === "DNI" ? (c.nombre || 'Sin nombre') : (c.razonSocial || 'Sin razón social'),
          tipo: c.tipoDoc,
          nroDoc: c.nroDoc,
          saldo: saldo,
        });
      });

      // procesar proveedores
      const proveedores = await Proveedor.find().sort({ id: 1 });
      
      proveedores.forEach((p) => {
        // FORZAR a que sea número - SOLUCIÓN PRINCIPAL
        let saldo = 0;
        
        if (typeof p.saldoCuentaCorriente === 'string') {
          saldo = parseFloat(p.saldoCuentaCorriente.replace(/[^0-9.-]/g, '')) || 0;
        } else if (typeof p.saldoCuentaCorriente === 'number') {
          saldo = p.saldoCuentaCorriente;
        } else {
          saldo = 0;
        }
        
        saldo = Math.round(saldo * 100) / 100;
        
        console.log(`Proveedor ${p.id}: saldo original = ${p.saldoCuentaCorriente}, convertido = ${saldo}`);

        if (saldo > 0) totalCobrar += saldo;
        if (saldo < 0) totalPagar += Math.abs(saldo);

        listaFinanzas.push({
          entidad: "Proveedor",
          id: p.id,
          nombre: p.tipoDoc === "DNI" ? (p.nombre || 'Sin nombre') : (p.razonSocial || 'Sin razón social'),
          tipo: p.tipoDoc,
          nroDoc: p.nroDoc,
          saldo: saldo,
        });
      });

      // REDONDEAR TOTALES FINALES
      totalCobrar = Math.round(totalCobrar * 100) / 100;
      totalPagar = Math.round(totalPagar * 100) / 100;
      const balanceNeto = Math.round((totalCobrar - totalPagar) * 100) / 100;
      
      console.log('=== RESULTADOS FINALES ===');
      console.log('Total a Cobrar (número):', totalCobrar);
      console.log('Total a Pagar (número):', totalPagar);
      console.log('Balance Neto (número):', balanceNeto);
      console.log('Tipos de datos:', typeof totalCobrar, typeof totalPagar, typeof balanceNeto);

      res.render("finanzas/index", {
        titulo: "Resumen Financiero - TodoStock S.A.",
        registros: listaFinanzas,
        totalCobrar: totalCobrar,
        totalPagar: totalPagar,
        balanceNeto: balanceNeto,
      });
    } catch (error) {
      console.error('Error en resumen financiero:', error);
      res.render("finanzas/index", {
        titulo: "Resumen Financiero - TodoStock S.A.",
        error: "Error al generar el resumen financiero: " + error.message,
        registros: [],
        totalCobrar: 0,
        totalPagar: 0,
        balanceNeto: 0,
      });
    }
  },
};

module.exports = finanzasController;