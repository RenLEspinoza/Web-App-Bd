const pool = require("../config/db");
//----------------------------------------------------------------------------
// FUNCIONES DE LA APP
//----------------------------------------------------------------------------

// LLamo a la función desde /loggerMiddleware
const { registrarAcceso } = require("../utils/logger");

// fn ('/') Renderiza la vista dinámica con Handlebars
const getHome = (req, res) => {
  registrarAcceso(`VISITA`, `ACCESO`, `/`);

  res.render("index", {
    titulo: "Mi App Web con Express y Handlebars",
    mensaje: "¡Bienvenido a la aplicación!",
    estado: "OK",
    fecha: new Date().toLocaleString(),
  });
};

// fn (/status) Estado del servidor ('/status') - Devuelve respuesta en formato JSON
const getStatus = (req, res) => {
  registrarAcceso(`VISITA`, `ACCESO`, `/STATUS`);

  res.json({
    estado: "OK",
    codigo: 200,
    mensaje: "El servidor está funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
};

// fn (/dashboard) Panel principal de control (Dashboard)
const getDashboard = (req, res) => {
  // 1. Registra la visita en el archivo log.txt
  registrarAcceso(`VISITA`, `ACCESO`, `/DASHBOARD`);

  // 2. Renderiza la plantilla Handlebars inyectando los datos
  res.render("index", {
    titulo: "Panel de Control",
    mensaje: "Bienvenido al Panel de Administración de Usuarios",
    estado: "OK",
    fecha: new Date().toLocaleString(),
  });
};

// Exporto los modulos para poder usarlos en router :)
module.exports = {
  getHome,
  getStatus,
  getDashboard,
};
