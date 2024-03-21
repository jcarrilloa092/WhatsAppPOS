const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  nombreCliente: {
    type: String,
    required: true,
  },
  apellidoCliente: {
    type: String,
    required: false,
  },
  direccionCliente: {
    type: String,
    required: false,
  },
  articulosPedido: [
    {
      nombreArticulo: String,
      cantidad: Number,
    },
  ],
  contactoWhatsApp: {
    nombre: String,
    numeroTelefono: String,
    serialConversacion: String,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

const Pedido = mongoose.model("Pedido", pedidoSchema);

module.exports = Pedido;
