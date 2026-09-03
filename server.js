const { Pool } = require("pg");
require("dotenv").config();

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
