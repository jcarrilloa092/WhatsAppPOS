const express = require("express");
const router = express.Router();
const whatsappClient = require("../whatsapp/whatsappClient");

router.post("/message", async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res
        .status(400)
        .json({ error: "Se requieren número de teléfono y mensaje" });
    }

    await whatsappClient.sendMessage(phoneNumber, message);

    res.status(200).json({ message: "Mensaje enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
