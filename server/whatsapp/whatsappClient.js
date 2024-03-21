const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { procesarRespuestaPedido } = require("./messageHandlers");

const whatsappCliente = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

whatsappCliente.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

whatsappCliente.on("ready", () => {
  console.log("Cliente de WhatsApp listo");
});

whatsappCliente.on("message", async (message) => {
  if (message.body.startsWith("#pedido")) {
  } else if (message.body.startsWith("Num Pedido: ORD-")) {
    await procesarRespuestaPedido(message);
  }
});

whatsappCliente.initialize();

module.exports = whatsappCliente;
