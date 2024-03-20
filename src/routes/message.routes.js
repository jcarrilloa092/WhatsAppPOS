const express = require('express');
const router = express.Router();
const whatsappClient = require('../services/WhatsappClient');

// Ruta para enviar un mensaje
router.post('/message', async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;
        
        // Validar que se proporcionaron el número de teléfono y el mensaje
        if (!phoneNumber || !message) {
            return res.status(400).json({ error: 'Se requieren número de teléfono y mensaje' });
        }
        
        // Enviar el mensaje usando el cliente de WhatsApp
        await whatsappClient.sendMessage(phoneNumber, message);
        
        // Respuesta exitosa
        res.status(200).json({ message: 'Mensaje enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
