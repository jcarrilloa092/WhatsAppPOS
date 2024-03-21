require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const pedidosRoutes = require("./routes/pedidosRoutes");
const messageHandlers = require("./whatsapp/messageHandlers");

const app = express();
connectDB();
app.use(express.json());
app.use("/api/pedidos", pedidosRoutes);

const whatsappCliente = require("./whatsapp/whatsappClient");

whatsappCliente.on("message", async (message) => {
  const contact = await message.getContact();
  const nombreContacto = contact.pushname;

  if (message.body.includes("#pedido")) {
    console.log(`Nuevo pedido de ${message.sender} ${message.body}`);
    const numOrden = messageHandlers.generarNumOrdenSecuencial();
    messageHandlers.enviarMensajeFormulario(
      whatsappCliente,
      message.from,
      numOrden,
      nombreContacto
    );
  } else if (message.body.includes("#ORD-")) {
    messageHandlers.procesarRespuestaPedido(whatsappCliente, message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
