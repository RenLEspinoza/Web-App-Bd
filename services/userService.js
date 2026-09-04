const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
const { registrarErrorEnLog } = require("../utils/logger");

// Función principal: Registro de usuario y creación de cuenta en una sola transacción
async function registrarUsuarioConCuenta(datosUsuario, saldoInicial) {
  const client = await pool.connect();

  try {
    // Inicia transacción (BEGIN)
    await client.query("BEGIN");
    console.log("Inicio de transacción: REGISTRAR_USUARIO CON SALDO_INICIAL");

    // Insertar nuevo usuario
    const resUsuario = await client.query(
      `INSERT INTO usuarios (nombre, email, phone_number, password_hash, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email;`,
      [
        datosUsuario.nombre,
        datosUsuario.email,
        datosUsuario.phone_number,
        datosUsuario.password_hash,
        datosUsuario.status || "active",
      ],
    );

    const nuevoUsuario = resUsuario.rows[0];
    console.log(`[Paso 1 Exitoso] Usuario creado con ID: ${nuevoUsuario.id}`);

    // Crear la cuenta inicial asociada al usuario
    const resCuenta = await client.query(
      `INSERT INTO cuentas (usuario_id, saldo, currency)
       VALUES ($1, $2, $3) RETURNING id, saldo, currency;`,
      [nuevoUsuario.id, saldoInicial, "USD"],
    );

    const nuevaCuenta = resCuenta.rows[0];
    console.log(`Cuenta creada con ID: ${nuevaCuenta.id}`);

    // Confirmar transacción
    await client.query("COMMIT");
    console.log("COMMIT realizado con éxito. Todos los cambios persistieron.");

    return {
      usuario: nuevoUsuario,
      cuenta: nuevaCuenta,
    };
  } catch (error) {
    // Revertir cambios ante cualquier falla
    try {
      await client.query("ROLLBACK");
      console.log(
        "ROLLBACK ejecutado: Ningún cambio fue guardado en la base de datos.",
      );
    } catch (rollbackErr) {
      console.error("Error al ejecutar ROLLBACK:", rollbackErr.message);
    }

    // Registrar en archivo error.txt
    registrarErrorEnLog(error.message);

    // Relanzar el error para la respuesta de Express
    throw error;
  } finally {
    // Liberar la conexión al pool
    client.release();
  }
}

module.exports = { registrarUsuarioConCuenta };
