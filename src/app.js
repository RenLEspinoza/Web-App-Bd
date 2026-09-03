// Carga de variables y módulos
require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");

// Importación de middlewares y helpers
const { registrarHelpers } = require("../helpers/hbHelpers");

// INICIALIZAR EXPRESS PRIMERO
const app = express();

// Middlewares de datos (JSON/Formularios) y logger
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar motor de plantillas (Handlebars)
registrarHelpers(hbs);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "views"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "..", "public")));

// Rutas
const appRouter = require("../routes/router");
const userRoutes = require("../routes/userRoutes");
const transferRoutes = require("../routes/transferRoutes");

app.use("/", appRouter);
app.use("/usuarios", userRoutes);
app.use("/transfers", transferRoutes);

module.exports = app;
