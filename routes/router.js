const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Llamo las funciones desde /appController
const {
  getHome,
  getStatus,
  getDashboard,
} = require("../controllers/appController");

// Definición de las rutas

router.get("/", getHome); // Ruta a vista principal
router.get("/status", getStatus); // Ruta vista de status del servidor
router.get("/dashboard", getDashboard); // Ruta al dashboard simulado

// POST /usuarios -> crear usuario //
router.post("/", usersController.crearUsuario);

// PUT /usuarios/:id -> actualizar email //
router.put("/:id", usersController.actualizarEmail);

// DELETE /usuarios/:id -> eliminar usuario //
router.delete("/:id", usersController.eliminarUsuario);

module.exports = router;
