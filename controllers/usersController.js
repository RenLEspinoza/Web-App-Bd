const pool = require("../config/db");

// Crear un usuario nuevo
const crearUsuario = async (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({
      error: "Nombre y email son requeridos",
    });
  }

  try {
    const query =
      "INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING id;";
    const values = [nombre, email];
    const result = await pool.query(query, values);

    res.status(201).json({
      mensaje: "Usuario insertado",
      id: result.rows[0].id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar el email de un usuario
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

    if (result.rowCount > 0) {
      res.json({
        mensaje: "Usuario actualizado",
        usuario: result.rows[0],
      });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un usuario por ID (Controlador Express)
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  // 1. Validación de entrada limpia
  const parsedId = Number(id);
  if (!id || !Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({
      error: "Eliminación bloqueada: Debes proporcionar un ID válido.",
    });
  }

  try {
    // 2. Consulta con paso de parámetros
    const query = "DELETE FROM usuarios WHERE id = $1 RETURNING *;";
    const values = [parsedId];
    const result = await pool.query(query, values);

    // 3. Verificación de registros afectados
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "No se encontró el usuario.",
      });
    }

    // 4. Respuesta exitosa
    return res.status(200).json({
      mensaje: "Usuario eliminado correctamente",
      registrosEliminados: result.rowCount,
      usuarioEliminado: result.rows[0],
    });
  } catch (error) {
    // 5. Manejo seguro de errores de servidor
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({
      error: "Ocurrió un error interno al intentar eliminar el usuario.",
    });
  }
};

module.exports = {
  crearUsuario,
  actualizarEmail,
  eliminarUsuario,
};
