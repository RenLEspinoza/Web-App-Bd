// --------------------------------------------------------------------------------------
// FUNCIÓN DE REGISTRO EN ARCHIVO PLANO
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

// Exporto el modulo para poder usarlo en appController :)
module.exports = {
  registrarAcceso,
};
