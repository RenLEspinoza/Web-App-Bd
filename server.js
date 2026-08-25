require("dotenv").config();
const { Pool } = require("pg");

// Configuración del Pool usando las variables de entorno (.env)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const app = require("./src/app");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Funcion auxiliar para mostrar saldo
async function mostrarSaldos(mensaje) {
  const result = await pool.query(
    "SELECT id, nombre, saldo FROM cuentas ORDER BY id;",
  );
  console.log(mensaje);
  result.rows.forEach((cuenta) => {
    console.log(`[ID ${cuenta.ID} ${cuenta.nombre} ${cuenta.saldo}]`);
  });
}

// Función
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

  while (intento < maxReintentos) {
    intento++;
    try {
      return await operacion();
    } catch (error) {
      // 1. Si es un error de validación/negocio, se interrumpe inmediatamente
      if (error instanceof ValidationError) {
        console.error(`[Error de Negocio]: ${error.message}`);
        throw error;
      }

      // 2. Verificar si es un error de conexión o bloqueo reintentable
      const esReintentable =
        CODIGOS_REINTENTABLES.includes(error.code) ||
        CODIGOS_REINTENTABLES.includes(error.errno);

      if (esReintentable && intento < maxReintentos) {
        console.warn(
          `[Intento ${intento}/${maxReintentos}] Error de BD (${error.code || error.message}). Reintentando en ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Backoff exponencial
      } else {
        console.error(
          `[Error Definitivo]: Operación fallida tras ${intento} intento(s). Motivo: ${error.message}`,
        );
        throw error;
      }
    }
  }
}

async function transferirDinero(idOrigen, idDestino, monto) {
  const client = await pool.connect();
  try {
    // valida entradas básicas antes de tocar la BD
    if (typeof monto !== "number" || monto <= 0 || isNaN(monto)) {
      throw new Error("El monto a transferir debe ser un número positivo");
    }

    await client.query("BEGIN"); // Inicia transacción

    // 2. Obtiene y bloquea la cuenta de origen
    const cuentaOrigenRes = await client.query(
      "SELECT nombre, saldo FROM cuentas WHERE id = $1 FOR UPDATE;",
      [idOrigen],
    );
    // Si la cuenta no existe arroja error
    if (cuentaOrigenRes.rowCount === 0) {
      throw new Error(`La cuenta de origen (ID ${idOrigen}) no existe`);
    }

    // Obtiene el saldo disponible
    const saldoDisponible = parseFloat(cuentaOrigenRes.rows[0].saldo);

    // 3. Si el saldo es insuficiente arroja error con el detalle
    if (saldoDisponible < monto) {
      throw new Error(
        `Fondos insuficientes. Saldo disponible: $${saldoDisponible}, intento de transferencia: $${monto}`,
      );
    }

    // 4. Débito: Si pasa las validaciones, Descuenta el monto de la cuenta de origen
    const debito = await client.query(
      "UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2 RETURNING nombre, saldo;",
      [monto, idOrigen],
    );

    // 5. Crédito: Suma el monto a la cuenta de destino
    const credito = await client.query(
      "UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2 RETURNING nombre, saldo;",
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
      origen: debito.rows[0],
      destino: credito.rows[0],
    };
  } catch (error) {
    // Si ocurre cualquier error, se revierten las operaciones
    await client.query("ROLLBACK");
    console.error(`Error en la transferencia: ${error.message}`);
    console.error("Se ejecutó el ROLLBACK - ningún cambio se aplicó");
  } finally {
    // Liberar la conexión devuelta al pool
    client.release();
  }
}

// Demo de transferencias
ejecutarConReintentos(() => transferirDinero(2, 1, 50))
  .then(() => console.log("Proceso finalizado."))
  .catch((err) => console.error("Proceso abortado por error no recuperable."));
