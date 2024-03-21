const Pedido = require("../models/pedidoModel");

let secuencialOrden = 0;

function generarNumOrdenSecuencial() {
  secuencialOrden++;
  return `#ORD-${secuencialOrden.toString().padStart(3, "0")}`;
}

async function enviarMensajeFormulario(
  whatsappCliente,
  destinatario,
  numOrden,
  nombreContacto
) {
  const mensajeFormulario = `
¡Hola ${nombreContacto}! Gracias por contactarnos. 

Por favor, completa el siguiente formulario con la información de tu pedido.    

Num Pedido: ${numOrden}
Nombre:
Apellido:
Direccion:
Detalle de articulos y cantidad: (ejemplo:)
- Camisas talla L, 1 unidad
- Pantalones talla 34, 2 unidades

****Asegurate de incluir el numero de orden ${numOrden} en tu respuesta***`;
  await whatsappCliente.sendMessage(destinatario, mensajeFormulario);
}

async function procesarRespuestaPedido(mensaje) {
  const lineas = mensaje.body.split("\n");

  const numOrden = lineas[0].split(": ")[1].trim();
  const nombreCliente = lineas[1].split(": ")[1].trim();
  const apellidoCliente = lineas[2].split(": ")[1].trim();
  const direccionCliente = lineas[3].split(": ")[1].trim();

  const articulosPedido = lineas.slice(5).map((articulo) => {
    const [nombre, cantidad, precio] = articulo
      .slice(2)
      .split(",")
      .map((el) => el.trim());
    return {
      nombre,
      cantidad: parseInt(cantidad, 10),
      precio: parseFloat(precio),
    };
  });

  const detallesPedido = {
    numOrden,
    cliente: {
      nombre: nombreCliente,
      apellido: apellidoCliente,
      direccion: direccionCliente,
      contactoWhatsApp: mensaje.from,
    },
    articulosPedido,
  };

  try {
    const respuesta = await enviarDatosPedidoAPI(detallesPedido);
    if (respuesta.ok) {
      const clientePedido = new Cliente({
        contactoWhatsApp: mensaje.from,
        numOrden,
      });
      await clientePedido.save();

      await whatsappCliente.sendMessage(
        mensaje.from,
        `Tu pedido ${numOrden} ha sido recibido y está siendo procesado.`
      );
    } else {
      throw new Error("La API no procesó el pedido.");
    }
  } catch (error) {
    console.error("Error al procesar el pedido:", error);
    await whatsappCliente.sendMessage(
      mensaje.from,
      "Hubo un error al procesar tu pedido. Por favor, intenta nuevamente."
    );
  }
}

module.exports = {
  generarNumOrdenSecuencial,
  enviarMensajeFormulario,
  procesarRespuestaPedido,
};
