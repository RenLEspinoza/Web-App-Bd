const path = require("path");
const fs = require("fs");

const rutaLog = path.join(__dirname, "../log.txt");

const registrarAcceso = (evento, tipo, ruta) => {
  const timestamp = new Date().toISOString();
  const lineaLog = `[${timestamp}] ${tipo}: ${evento} - ${ruta}\n`;

  fs.appendFile(rutaLog, lineaLog, (err) => {
    if (err) console.error("Error al escribir en log.txt:", err.message);
  });
};

module.exports = {
  registrarAcceso,
};

// Función auxiliar para guardar logs de errores en archivo error.txt
function registrarErrorEnLog(mensajeError) {
  const rutaLog = path.join(__dirname, "../error.txt");
  const timestamp = new Date().toISOString();
  const lineaLog = `[${timestamp}] ERROR TRANSACCIONAL: ${mensajeError}\n`;

  fs.appendFile(rutaLog, lineaLog, (err) => {
    if (err) console.error("No se pudo escribir en error.txt:", err.message);
  });
}

module.exports = {
  registrarAcceso,
  registrarErrorEnLog,
};
