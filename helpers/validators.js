const pool = require("../config/db");

// Función para validar datos de transferencia
function validarDatosTransferencia(idOrigen, idDestino, monto) {
  if (monto <= 0) {
    throw new Error("El monto debe ser mayor a cero");
  }
  if (idOrigen === idDestino) {
    throw new Error("La cuenta origen y destino no pueden ser la misma");
  }
  if (!Number.isInteger(idOrigen) || !Number.isInteger(idDestino)) {
    throw new Error("Los IDs de cuenta deben ser numeros enteros");
  }
}

module.exports = {
  validarDatosTransferencia,
};
