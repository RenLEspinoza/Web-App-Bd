// --------------------------------------------------------------------------------------
// FUNCIÓN DE REGISTRO DE EVENTOS EN ARCHIVO PLANO
// --------------------------------------------------------------------------------------
const path = require("path");
const fs = require("fs");

const registrarAcceso = (evento, tipo, ruta) => {
  const ahora = new Date();
  const fecha = ahora.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const hora = ahora.toTimeString().split(" ")[0]; // Formato HH:MM:SS

  // Estructura mínima requerida: fecha, hora y ruta accedida. Extras: tipo y evento.
  const lineaLog = `[FECHA: ${fecha}] [HORA: ${hora}] [EVENTO: ${evento}] [TIPO: ${tipo}] [RUTA: ${ruta}]\n\n`;

  // fs.appendFile agrega texto al final de log.txt sin borrar el anterior (lo crea si no existe)
  fs.appendFile(path.join(__dirname, "../log.txt"), lineaLog, (err) => {
    if (err) {
      console.error("Error al escribir en log.txt:", err);
    }
  });
};

// --------------------------------------------------------------------------------------
// FUNCIÓN DE REGISTRO DE ERRORES DE TRANSACCIONALIDAD EN ARCHIVO PLANO
// --------------------------------------------------------------------------------------

const registrarErrorTransaccion = (accion, detalleError, datosOrigen) => {
  const ahora = new Date();
  const fecha = ahora.toISOString().split("T")[0]; // YYYY-MM-DD
  const hora = ahora.toTimeString().split(" ")[0]; // HH:MM:SS

  // Cadena de texto para almacenar el error con detalles
  const lineaLog = `[FECHA: ${fecha}] [HORA: ${hora}] [ACCION: ${accion}] [ERROR: ${detalleError}] [DATOS: ${JSON.stringify(datosOrigen)}]\n\n`;

  // fs.appendFile guarda el registro en el log.txt ubicado en la raíz del proyecto
  fs.appendFile(path.join(__dirname, "../error.txt"), lineaLog, (err) => {
    if (err) {
      console.error("Error al escribir en error.txt:", err);
    }
  });
};

// Exporto las funciones para poder usarlas en otros módulos
module.exports = {
  registrarAcceso,
  registrarErrorTransaccion,
};
