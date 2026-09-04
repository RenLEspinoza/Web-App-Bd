const pool = require("../config/db");

// Función para validar datos de transferencia
function validarDatosTransferencia(idOrigen, idDestino, monto) {
  if (typeof monto !== "number" || isNaN(monto) || monto <= 0) {
    throw new Error("El monto a transferir debe ser un número positivo");
  }

  if (idOrigen === idDestino) {
    throw new Error("La cuenta origen y destino no pueden ser la misma");
  }

  if (!Number.isInteger(idOrigen) || !Number.isInteger(idDestino)) {
    throw new Error("Los IDs de cuenta deben ser números enteros");
  }
}

module.exports = {
  validarDatosTransferencia,
};
