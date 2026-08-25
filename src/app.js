// Carga las variables de entorno desde el archivo .env
require("dotenv").config();

// Importa el módulo de express
const express = require("express");

// Importa el módulo nativo path
const path = require("path");

// Importa routes
const routes = require("../routes/router");

// LLamo a la función desde /loggerMiddleware
const { registrarAcceso } = require("../middlewares/loggerMiddleware");

const hbs = require("hbs");

// Importar el helper para status
const { registrarHelpers } = require("../helpers/hbHelpers");
registrarHelpers(hbs);

// Inicializa la aplicación de Express
const app = express();

// Define el puerto desde process.env (o usa 3000 como respaldo)
const PORT = process.env.PORT || 3000;

// Configura Handlebars (hbs) como motor de plantillas
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "views"));

// Middleware para servir archivos estáticos (CSS, JS, imágenes) desde /public
app.use(express.static(path.join(__dirname, "..", "public")));

// Conexión de Router principal
app.use("/", routes);

// Inicia el servidor y escucha en el puerto configurado
app.listen(PORT, () => {
  registrarAcceso(
    `Servidor iniciado exitosamente`,
    `INICIO_SISTEMA`,
    `PUERTO: ${PORT}`,
  );
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

module.exports = app;
