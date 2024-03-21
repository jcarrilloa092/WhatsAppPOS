const Pedido = require("../models/pedidoModel");

exports.crearPedido = async (req, res) => {
  try {
    const {
      nombreCliente,
      apellidoCliente,
      direccionCliente,
      articulosPedido,
      contactoWhatsApp,
    } = req.body;

    if (!nombreCliente || !articulosPedido) {
      return res
        .status(400)
        .json({ mensaje: "Nombre del cliente y artículos son obligatorios" });
    }

    const nuevoPedido = new Pedido({
      nombreCliente,
      apellidoCliente,
      direccionCliente,
      articulosPedido,
      contactoWhatsApp,
    });

    const pedidoGuardado = await nuevoPedido.save();

    res.status(201).json(pedidoGuardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el pedido" });
  }
};

exports.obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los pedidos" });
  }
};
