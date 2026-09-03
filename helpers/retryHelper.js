const pool = require("../config/db");

// Función asincrona para realizar reintentos
async function reintento(queryText, values, intentos = 3, delay = 2000) {
  for (let i = 1; i <= intentos; i++) {
    try {
      const res = await pool.query(queryText, values);
      return res;
    } catch (error) {
      console.error(`Intento ${i} fallido:`, error.message);
      if (i === intentos) {
        console.error("⚠️ Máximo número de reintentos alcanzado.");
        throw error;
      }
      console.log(`🔄 Reintentando en ${delay} ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Aumentamos el delay (estrategia de backoff exponencial)
    }
  }
}

// Función para ejecutar con reintentos
async function ejecutarConReintentos(
  operacion,
  maxReintentos = 3,
  delayMs = 1000,
) {
  let intento = 0;
  let delay = delayMs;

  // Bucle de control de intentos
  while (intento < maxReintentos) {
    // Se ejecuta mientras no se alcance el limite de reintentos.
    intento++; // Incrementa el contador de intentos en cada ciclo.
    try {
      return await operacion(); // Si la operación tiene exito, devuelve el resultado y finaliza la función.
    } catch (error) {
      // Si es un error de validación/negocio, se interrumpe inmediatamente.
      if (error instanceof ValidationError) {
        console.error(`[Error de Negocio]: ${error.message}`);
        throw error;
      }

      // Verifica si es un error de conexión o bloqueo reintentable
      const esReintentable =
        CODIGOS_REINTENTABLES.includes(error.code) ||
        CODIGOS_REINTENTABLES.includes(error.errno);

      // Si es reintentable y no se ha alcanzado el maximo de reintentos, espera y vuelve a intentar.
      if (esReintentable && intento < maxReintentos) {
        console.warn(
          // Mensaje de advertencia con detalles del error y el intento actual
          `[Intento ${intento}/${maxReintentos}] Error de BD (${error.code || error.message}). Reintentando en ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Backoff exponencial / Duplica el tiempo de espera de forma exponencial para no saturar el servidor o la BD. (1s -> 2s -> 4s)
      } else {
        console.error(
          `[Error Definitivo]: Operación fallida tras ${intento} intento(s). Motivo: ${error.message}`,
        );
        throw error;
      }
    }
  }
}

module.exports = {
  reintento,
  ejecutarConReintentos,
};
