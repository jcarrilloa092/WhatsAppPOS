// Importa las librerías necesarias para hacer las solicitudes HTTP
const axios = require('axios');

// Función para enviar los datos del pedido a la API REST
async function enviarDatosPedidoAPI(datosPedido) {
    try {
        // Realizar la solicitud HTTP POST a tu API REST para almacenar los datos del pedido en la base de datos MongoDB
        const response = await axios.post('http://localhost:3000/pedidos', datosPedido);
        
        // Verificar el estado de la respuesta y manejarlo según sea necesario
        if (response.status === 201) {
            console.log('Datos del pedido enviados correctamente a la API');
        } else {
            console.error('Error al enviar los datos del pedido a la API:', response.data);
        }
    } catch (error) {
        console.error('Error enviando los datos del pedido a la API:', error);
    }
}

module.exports = {
    enviarDatosPedidoAPI
};
