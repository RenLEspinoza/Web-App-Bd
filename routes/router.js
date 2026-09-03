const express = require("express");
const router = express.Router();

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

module.exports = router;
