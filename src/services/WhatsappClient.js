const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { enviarDatosPedidoAPI } = require('./apiService'); // Importamos la función para enviar datos del pedido a la API

// Crear cliente de WhatsApp
const whatsappCliente = new Client({
    authStrategy: new LocalAuth
});

// Generar código QR al iniciar sesión
whatsappCliente.on("qr", (qr) => qrcode.generate(qr, { small: true }));

// Mensaje de confirmación al estar listo el cliente
whatsappCliente.on("ready", () => console.log("El cliente está listo"));

// Manejar mensajes entrantes
whatsappCliente.on("message", async (mensaje) => {
    try {
        const cuerpoMensaje = mensaje.body.toLowerCase();

        if (cuerpoMensaje.includes("#pedido")) {
            const remitente = await mensaje.getContact();
            await mensaje.reply(`¡Hola ${remitente.name}! Gracias por contactarnos.`);

            const numOrden = generarNumOrden();
            await enviarMensajeFormulario(remitente, numOrden);

            // Manejar respuesta al formulario
            whatsappCliente.on('message', async (mensajeRespuesta) => {
                try {
                    if (
                        mensajeRespuesta.from === remitente.id._serialized &&
                        mensajeRespuesta.body &&
                        mensajeRespuesta.body.includes(numOrden)
                    ) {
                        const lineasRespuestaFormulario = mensajeRespuesta.body.split('\n');

                        let nombreCliente = '';
                        let apellidoCliente = '';
                        let direccionCliente = '';
                        let articulosPedido = '';

                        lineasRespuestaFormulario.forEach((linea) => {
                            if (linea.includes('Nombre:')) {
                                nombreCliente = linea.substring(linea.indexOf(':') + 1).trim();
                            }
                            if (linea.includes('Apellido:')) {
                                apellidoCliente = linea.substring(linea.indexOf(':') + 1).trim();
                            }
                            if (linea.includes('Dirección:')) {
                                direccionCliente = linea.substring(linea.indexOf(':') + 1).trim();
                            }
                            if (linea.includes('Artículos:')) {
                                articulosPedido = linea.substring(linea.indexOf(':') + 1).trim();
                            }
                        });

                        // Mostrar información del pedido
                        console.log('Nombre del cliente:', nombreCliente);
                        console.log('Apellido del cliente:', apellidoCliente);
                        console.log('Dirección del cliente:', direccionCliente);
                        console.log('Artículos del pedido:', articulosPedido);

                        // Crear objeto JSON con los datos del pedido
                        const datosPedido = {
                            numeroOrden: numOrden,
                            nombreCliente,
                            apellidoCliente,
                            direccionCliente,
                            articulosPedido,
                            contactoWhatsApp: {
                                nombre: remitente.name,
                                numeroTelefono: remitente.id.user,
                                serialConversacion: mensaje.from
                            }
                        };

                        // Enviar datos del pedido a la API REST
                        await enviarDatosPedidoAPI(datosPedido);
                    }
                } catch (error) {
                    console.error('Error procesando la respuesta del formulario:', error);
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
});

// Enviar mensaje del formulario
async function enviarMensajeFormulario(contacto, numOrden) {
    try {
        const mensajeFormulario = `
        Por favor, completa el siguiente formulario para realizar tu pedido:

        #${numOrden} (este es el código de tu pedido)

        Nombre:
        Apellido:
        Dirección:
        Artículos:

        Asegúrate de que tu número de orden: #${numOrden} vaya en tu respuesta. 
        ¡Gracias!
    `;
        await whatsappCliente.sendMessage(contacto.id._serialized, mensajeFormulario);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}

// Generar número de orden secuencial
function generarNumOrden() {
    let numSecuencial = obtenerNumSecuencialSiguiente().padStart(3, '0');
    let numOrden = `ORD-${numSecuencial}`;
    return numOrden;
}

// Obtener número de orden secuencial siguiente
function obtenerNumSecuencialSiguiente() {
    let i = 1;
    return ++i;
}

module.exports = whatsappCliente;
