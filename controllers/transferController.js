const pool = require("../config/db");
const { validarDatosTransferencia } = require("../helpers/validators");

// Funcion para transferir dinero
async function transferirDinero(idOrigen, idDestino, monto) {
  const client = await pool.connect();
  try {
    // valida entradas básicas antes de tocar la BD
    if (typeof monto !== "number" || monto <= 0 || isNaN(monto)) {
      throw new Error("El monto a transferir debe ser un número positivo");
    }

    await client.query("BEGIN"); // Inicia transacción

    // Obtiene y bloquea la cuenta de origen
    const cuentaOrigenRes = await client.query(
      `SELECT c.saldo, u.nombre 
       FROM cuentas c 
       JOIN usuarios u ON c.usuario_id = u.id 
       WHERE c.id = $1 FOR UPDATE;`,
      [idOrigen],
    );
    // Si la cuenta no existe arroja error
    if (cuentaOrigenRes.rowCount === 0) {
      throw new Error(`La cuenta de origen (ID ${idOrigen}) no existe`);
    }

    // Obtiene el saldo disponible
    const saldoDisponible = parseFloat(cuentaOrigenRes.rows[0].saldo);

    // Si el saldo es insuficiente arroja error con el detalle
    if (saldoDisponible < monto) {
      throw new Error(
        `Fondos insuficientes. Saldo disponible: $${saldoDisponible}, intento de transferencia: $${monto}`,
      );
    }

    // Débito: Si pasa las validaciones, Descuenta el monto de la cuenta de origen
    const debito = await client.query(
      `UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2 RETURNING u.nombre, c.saldo 
       FROM cuentas c 
       JOIN usuarios u ON c.usuario_id = u.id 
       WHERE c.id = $2;`,
      [monto, idOrigen],
    );

    // Crédito: Suma el monto a la cuenta de destino
    const credito = await client.query(
      `UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2 RETURNING u.nombre, c.saldo 
       FROM cuentas c 
       JOIN usuarios u ON c.usuario_id = u.id 
       WHERE c.id = $2;`,
      [monto, idDestino],
    );

    // Si la cuenta de destino no existe, arroja error
    if (credito.rowCount === 0) {
      throw new Error(`La cuenta de destino (ID ${idDestino}) no existe`);
    }

    // Confirma la transacción
    await client.query("COMMIT");

    console.log(
      `Débito aplicado: ${debito.rows[0].nombre} ahora tiene $${debito.rows[0].saldo}`,
    );
    console.log(
      `Crédito aplicado: ${credito.rows[0].nombre} ahora tiene $${credito.rows[0].saldo}`,
    );
    console.log("Transferencia realizada con éxito (COMMIT)");
    return {
      exito: true,
      mensaje: "Transferencia realizada con éxito",
      origen: debito.rows[0],
      destino: credito.rows[0],
    };
  } catch (error) {
    // Si ocurre cualquier error en la transacción, se revierten las operaciones
    await client.query("ROLLBACK");
    console.error(`Error en la transferencia: ${error.message}`);
    console.error("Se ejecutó el ROLLBACK - ningún cambio se aplicó");
  } finally {
    // Liberar la conexión devuelta al pool
    client.release();
  }
}

module.exports = {
  transferirDinero,
};
