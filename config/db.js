// Configura la conexión a tu base de datos principal (En este caso, PostgreSQL).

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5433"), // El puerto debe ser un número entero
  max: 20,
  idleTimeoutMillis: 30000,
});

// Verificar conexión al arrancar
pool.on("connect", () => {
  console.log("✅ Pool conectado a PostgreSQL");
});

pool.on("error", (error) => {
  console.error("❌ Error inesperado en el pool:", error.message);
});

// Exporta el modulo
module.exports = pool;
