const pool = require("../config/db"); // Ajusta la ruta a tu pool

// Función para obtener los saldos de todas las cuentas
async function obtenerSaldos() {
  try {
    const result = await pool.query(
      `SELECT c.id, u.nombre, c.saldo 
       FROM cuentas c 
       JOIN usuarios u ON c.usuario_id = u.id 
       ORDER BY c.id;`,
    );

    // Validación defensiva: asegurar que result.rows sea un arreglo
    if (!result || !Array.isArray(result.rows)) {
      return [];
    }

    return result.rows;
  } catch (error) {
    console.error("Error al obtener la lista de saldos:", error.message);
    throw new Error("No se pudo obtener la lista de cuentas.");
  }
}

// Función individual con validación de entrada
async function obtenerSaldoPorId(id) {
  // validación de entrada
  const idNumerico = Number(id);
  if (!id || isNaN(idNumerico) || idNumerico <= 0) {
    throw new Error(
      "El ID proporcionado debe ser un número entero positivo válido.",
    );
  }

  // consulta parametrizada a la base de datos
  const result = await pool.query(
    `SELECT c.id, u.nombre, c.saldo 
     FROM cuentas c 
     JOIN usuarios u ON c.usuario_id = u.id 
     WHERE c.id = $1;`,
    [idNumerico],
  );

  // 3. Retornar el objeto de la cuenta o null si no se encuentra
  return result.rows[0] || null;
}

module.exports = { obtenerSaldos, obtenerSaldoPorId };
