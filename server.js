const { Pool } = require("pg");
require("dotenv").config();

// Sequelize
const sequelize = require("./config/sequelize");
const sequelizeModels = require("./models");

// Configuración del Pool usando las variables de entorno (.env)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // Número maximo de conexiones en el pool
  idleTimeoutMillis: 30000, // Tiempo máximo que una conexión puede estar inactiva antes de ser liberada
  connectionTimeoutMillis: 2000, // Tiempo máximo para establecer una conexión antes de lanzar un error
});

const app = require("./src/app");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Verificar conexión a la base de datos con Sequelize antes de levantar el servidor
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión con Sequelize establecida correctamente.");
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Error al conectar la base de datos mediante Sequelize:",
      err.message,
    );
  });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("¡Base de datos y tablas sincronizadas correctamente!");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
