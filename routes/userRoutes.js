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

const {
  obtenerUsuariosORM,
  obtenerUsuarioConRelaciones,
  crearUsuarioCompletoORM,
} = require("../controllers/userControllerORM");

//-----------------------------------------
// --- Operaciones CRUD para usuarios ---
//-----------------------------------------

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

// (DELETE) Eliminar usuario
router.delete("/:id", eliminarUsuario);

//-----------------------------------------
// --- Operaciones usando Sequelize ORM ---
//-----------------------------------------

// Ruta Users usando ORM (Sequelize)
router.get("/orm-users", obtenerUsuariosORM);

// Ruta para obtener un usuario por su ID junto con sus relaciones (pedidos, perfil y cuenta)
router.get("/orm-users/:id", obtenerUsuarioConRelaciones);

// Ruta para crear un usuario junto con sus relaciones (perfil, cuenta y pedidos)
router.post("/orm-users", crearUsuarioCompletoORM);

module.exports = router;
