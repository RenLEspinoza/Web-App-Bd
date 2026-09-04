const express = require("express");
const router = express.Router();
const {
  getUsuarios,
  crearUsuario,
  actualizarEmail,
  actualizarNombre,
  actualizarPassword,
  actualizarTelefono,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/usersController");

const { obtenerUsuariosORM } = require("../controllers/userControllerORM");

// --- Operaciones CRUD para usuarios ---

// (READ) Obtener todos los usuarios
router.get("/", getUsuarios);

// (CREATE) Crear un nuevo usuario
router.post("/", crearUsuario);

// (UPDATE) Actualización completa de un usuario (todos o varios campos principales)
router.put("/:id", actualizarUsuario);

// (UPDATE) Actualizaciones parciales de campos específicos (PATCH)
router.patch("/:id/email", actualizarEmail);
router.patch("/:id/nombre", actualizarNombre);
router.patch("/:id/password", actualizarPassword);
router.patch("/:id/telefono", actualizarTelefono);

// (DELETE)Eliminar usuario
router.delete("/:id", eliminarUsuario);

// Ruta Users usando ORM (Sequelize)
router.get("/orm-users", obtenerUsuariosORM);

module.exports = router;
