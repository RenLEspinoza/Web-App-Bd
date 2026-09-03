const fs = require("fs");
const path = require("path");

const registrarAcceso = (tipo, accion, ruta) => {
  const logPath = path.join(__dirname, "../logs.txt");
  const logEntry = `[${new Date().toISOString()}] [${tipo}] [${accion}] Ruta: ${ruta}\n`;

  // AppendFileSync para no bloquear la ejecución principal
  fs.appendFile(logPath, logEntry, (err) => {
    if (err) console.error("Error al escribir el log:", err);
  });
};

module.exports = { registrarAcceso };
