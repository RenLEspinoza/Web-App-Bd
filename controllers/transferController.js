const pool = require("../config/db");
const { registrarErrorEnLog } = require("../utils/logger");

// Importo función de validación
const { validarDatosTransferencia } = require("../helpers/validators");

// Funcion para transferir dinero
async function transferirDinero(idOrigen, idDestino, monto) {
  // Validar entradas antes de conectar a la base de datos
  validarDatosTransferencia(idOrigen, idDestino, monto);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Obtener y bloquear cuenta origen (FOR UPDATE)
    const cuentaOrigenRes = await client.query(
      `SELECT c.saldo, u.nombre 
       FROM cuentas c 
       JOIN usuarios u ON c.usuario_id = u.id 
       WHERE c.id = $1 FOR UPDATE;`,
      [idOrigen],
    );

    if (cuentaOrigenRes.rowCount === 0) {
      throw new Error(`La cuenta de origen (ID ${idOrigen}) no existe`);
    }

    const saldoDisponible = parseFloat(cuentaOrigenRes.rows[0].saldo);

    if (saldoDisponible < monto) {
      throw new Error(
        `Fondos insuficientes. Saldo disponible: $${saldoDisponible}, intento: $${monto}`,
      );
    }

    // Débito
    const debito = await client.query(
      `UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2 
       RETURNING (SELECT nombre FROM usuarios WHERE id = cuentas.usuario_id), saldo;`,
      [monto, idOrigen],
    );

    // Crédito
    const credito = await client.query(
      `UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2 
       RETURNING (SELECT nombre FROM usuarios WHERE id = cuentas.usuario_id), saldo;`,
      [monto, idDestino],
    );

    if (credito.rowCount === 0) {
      throw new Error(`La cuenta de destino (ID ${idDestino}) no existe`);
    }

    await client.query("COMMIT");

    return {
      exito: true,
      mensaje: "Transferencia realizada con éxito",
      origen: debito.rows[0],
      destino: credito.rows[0],
    };
  } catch (error) {
    // Revertir transacción en base de datos
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Error en ROLLBACK:", rollbackErr.message);
    }

    // Log en archivo plano (Tarea PLUS :))
    registrarErrorEnLog(error.message);

    // Relanzar el error para que el controlador capture el estado 500
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  transferirDinero,
};
