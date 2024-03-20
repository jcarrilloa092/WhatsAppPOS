const express = require('express');
const whatsappClient = require('./services/WhatsappClient');
const messageRouter = require('./routes/message.routes');

const app = express();

// Configuración de middlewares para poder generar los json que se enviaran a la api.
app.use(express.json());

// Configuración de rutas
app.use(messageRouter);

// Iniciar el cliente de WhatsApp
whatsappClient.initialize();

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
