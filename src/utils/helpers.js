// Función para generar números de orden secuenciales para mantener un formato de orden consistente.
function generarNumOrdenSecuencial() {
    let numSecuencial = obtenerNumSecuencialSiguiente();
    let numOrden = `ORD-${numSecuencial}`;
    return numOrden;
}

// Función para obtener el número de orden secuencial siguiente, por ahora es local, la idea es que se obtenga de la base de datos, tomando la ultima orden generada y sumandole 1
function obtenerNumSecuencialSiguiente() {
    let i = 1; 
    return ++i;
}

module.exports = {
    generarNumOrdenSecuencial
};
