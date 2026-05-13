const Cliente = require("../models/Cliente");

const clienteController = {
  index: (req, res) => {
    res.render("clientes/index", {
      titulo: "Clientes - TodoStock S.A.",
    });
  },

  listar: async (req, res) => {
    try {
      const clientes = await Cliente.find().sort({ id: 1 });
      res.render("clientes/listar", {
        titulo: "Clientes - TodoStock S.A.",
        clientes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al listar clientes");
    }
  },

  formCrear: (req, res) => {
    res.render("clientes/crear", {
      titulo: "Registrar Nuevo Cliente",
      error: null,
      datos: null,
    });
  },

  almacenar: async (req, res) => {
    try {
      const existe = await Cliente.findOne({ id: parseInt(req.body.id) });
      if (existe) {
        throw new Error(`El ID ${req.body.id} ya está en uso.`);
      }

      const clienteLimpio = {
        id: parseInt(req.body.id),
        tipoDoc: req.body.tipoDoc,
        nroDoc: req.body.nroDoc,
        nombre: req.body.tipoDoc === "DNI" ? req.body.nombre : null,
        email: req.body.email,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        razonSocial: req.body.tipoDoc === "CUIT" ? req.body.razonSocial : null,
        saldoCuentaCorriente: parseFloat(req.body.saldoCuentaCorriente) || 0,
      };

      await Cliente.create(clienteLimpio);
      res.redirect("/clientes/listar");
    } catch (error) {
      res.render("clientes/crear", {
        titulo: "Registrar Nuevo Cliente",
        error: error.message,
        datos: req.body,
      });
    }
  },

  formEditar: async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ id: parseInt(req.params.id) });
      if (!cliente) {
        return res.status(404).send("Cliente no encontrado");
      }
      res.render("clientes/editar", { titulo: "Editar Cliente", cliente });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al buscar cliente");
    }
  },

  actualizar: async (req, res) => {
    try {
      await Cliente.findOneAndUpdate(
        { id: parseInt(req.params.id) },
        {
          nombre: req.body.nombre,
          tipoDoc: req.body.tipoDoc,
          nroDoc: req.body.nroDoc,
          email: req.body.email,
          telefono: req.body.telefono,
          direccion: req.body.direccion,
          saldoCuentaCorriente: parseFloat(req.body.saldoCuentaCorriente) || 0,
        },
        { new: true },
      );
      res.redirect("/clientes/listar");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al actualizar cliente");
    }
  },

  eliminar: async (req, res) => {
    try {
      await Cliente.findOneAndDelete({ id: parseInt(req.params.id) });
      res.redirect("/clientes/listar");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al eliminar cliente");
    }
  },
};

module.exports = clienteController;
