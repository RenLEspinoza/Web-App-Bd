const pool = require("../config/db");
const { registrarUsuarioConCuenta } = require("../services/userService");

// Operaciones CRUD para usuario

// (CREATE) Crear un usuario nuevo (modificación: ahora también crea una cuenta con saldo inicial (L4))
const crearUsuario = async (req, res) => {
  const { nombre, email, phone_number, password_hash, saldoInicial } = req.body;

  // 1. Validación de campos obligatorios para el usuario
  if (!nombre || !email) {
    return res.status(400).json({
      error: "Nombre y email son requeridos",
    });
  }

  try {
    // 2. Invocar el servicio que maneja la transacción (BEGIN - INSERT USUARIOS - INSERT CUENTAS - COMMIT)
    const resultado = await registrarUsuarioConCuenta(
      { nombre, email, phone_number, password_hash },
      saldoInicial || 0,
    );

    // 3. Respuesta de éxito
    res.status(201).json({
      mensaje: "Usuario y cuenta creados exitosamente",
      usuarioId: resultado.usuario.id,
      cuentaId: resultado.cuenta.id,
      saldo: resultado.cuenta.saldo,
    });
  } catch (error) {
    // 4. Si la transacción hace ROLLBACK en el servicio, el catch captura el error aquí
    res.status(500).json({
      error: "Error al procesar la transacción de registro",
      detalle: error.message,
    });
  }
};

// (READ) Obtener y procesar datos de la tabla usuarios
const getUsuarios = async (req, res) => {
  try {
    // consulta SQL
    const query = "SELECT * FROM usuarios ORDER BY id ASC;";
    const result = await pool.query(query);

    // procesar información antes de enviarla
    // se excluye password_hash usando desestructuración (.map)
    const usuariosProcesados = result.rows.map(
      ({ password_hash, phone_number, ...usuario }) => usuario,
    );

    console.table(usuariosProcesados); // Log de la tabla completa en consola para depuración

    // respuesta JSON "clara y ordenada"
    res.status(200).json({
      success: true,
      total: usuariosProcesados.length,
      data: usuariosProcesados,
    });
  } catch (error) {
    // validación de errores de conexión o consulta
    console.error("Error en la consulta a PostgreSQL:", error.message);

    res.status(500).json({
      success: false,
      error: "Error de servidor",
      mensaje: "No se pudo obtener la información de la base de datos.",
    });
  }
};

// (UPDATE) Actualizar varios datos del usuario en una sola consulta
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: "Nombre y email son requeridos" });
  }

  try {
    const query =
      "UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3 RETURNING *;";
    const values = [nombre, email, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { password_hash, ...usuarioProcesado } = result.rows[0];

    res.json({
      mensaje: "Usuario actualizado",
      usuario: usuarioProcesado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// (UPDATE) Actualizar el email de un usuario
const actualizarEmail = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "El nuevo email es requerido",
    });
  }

  try {
    const query = "UPDATE usuarios SET email = $1 WHERE id = $2 RETURNING *;";
    const values = [email, id];
    const result = await pool.query(query, values);

    // 1. Validar si el usuario no existe (Corta la ejecución con 404)
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado",
        mensaje: `No existe un usuario registrado con el ID ${id}`,
      });
    }

    // 2. Si existe, procesar datos sensibles
    const { password_hash, phone_number, ...usuarioProcesado } = result.rows[0];

    // 3. Responder con el usuario actualizado (Directo, sin más condicionales)
    return res.json({
      mensaje: "Usuario actualizado",
      usuario: usuarioProcesado,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// (UPDATE) Actualizar el nombre de un usuario
const actualizarNombre = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nuevo nombre es requerido" });
  }

  try {
    const query = "UPDATE usuarios SET nombre = $1 WHERE id = $2 RETURNING *;";
    const values = [nombre, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado",
        mensaje: `No existe un usuario registrado con el ID ${id}`,
      });
    }

    // Excluir datos sensibles de la respuesta
    const { password_hash, phone_number, ...usuarioProcesado } = result.rows[0];

    res.json({
      mensaje: "Nombre de usuario actualizado",
      usuario: usuarioProcesado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// (UPDATE) Actualizar la contraseña (password_hash)
const actualizarPassword = async (req, res) => {
  const { id } = req.params;
  const { password_hash } = req.body;

  if (!password_hash) {
    return res.status(400).json({ error: "La nueva contraseña es requerida" });
  }

  try {
    const query =
      "UPDATE usuarios SET password_hash = $1 WHERE id = $2 RETURNING *;";
    const values = [password_hash, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado",
        mensaje: `No existe un usuario registrado con el ID ${id}`,
      });
    }

    // Ocultar la clave del JSON devuelto
    const { password_hash: _, ...usuarioProcesado } = result.rows[0];

    res.json({
      mensaje: "Contraseña actualizada exitosamente",
      usuario: usuarioProcesado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// (UPDATE) Actualizar el número telefónico de un usuario
const actualizarTelefono = async (req, res) => {
  const { id } = req.params;
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({ error: "El número telefónico es requerido" });
  }

  try {
    const query =
      "UPDATE usuarios SET phone_number = $1 WHERE id = $2 RETURNING *;";
    const values = [phone_number, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado",
        mensaje: `No existe un usuario registrado con el ID ${id}`,
      });
    }

    const { password_hash, ...usuarioProcesado } = result.rows[0];

    res.json({
      mensaje: "Teléfono actualizado con éxito",
      usuario: usuarioProcesado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// (DELETE) Eliminar un usuario por ID
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  // validación de entrada
  // si el ID no es valido...
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({
      error: "Eliminación bloqueada: Debes proporcionar un ID válido.",
    });
  }

  try {
    // consulta con paso de parámetros
    const query = "DELETE FROM usuarios WHERE id = $1 RETURNING *;";
    const values = [parseInt(id)];
    const result = await pool.query(query, values);

    // verificación de registros afectados
    if (result.rowCount === 0) {
      console.log("No se encontró el usuario.");
      return res.status(404).json({
        error: "No se encontró el usuario.",
      });
    }

    console.log("Usuario eliminado correctamente.");
    const { password_hash, phone_number, ...usuarioProcesado } = result.rows[0];

    // respuesta exitosa
    return res.status(200).json({
      mensaje: "Usuario eliminado correctamente",
      registrosEliminados: result.rowCount,
      usuarioEliminado: usuarioProcesado,
    });
  } catch (error) {
    // manejo seguro de errores de servidor
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({
      error: "Ocurrió un error interno al intentar eliminar el usuario.",
    });
  }
};

module.exports = {
  crearUsuario,
  getUsuarios,
  actualizarEmail,
  actualizarNombre,
  actualizarPassword,
  actualizarTelefono,
  actualizarUsuario,
  eliminarUsuario,
};
