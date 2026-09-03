const pool = require("./config/db");

const crateTableUsuarios = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone_number VARCHAR(30),
      password_hash VARCHAR(255) NOT NULL,
      balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
      currency VARCHAR(3) NOT NULL DEFAULT 'USD',
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Tabla 'usuarios' verificada/creada con éxito.");
  } catch (error) {
    console.error("Error al crear la tabla en la BD:", error.message);
  }
};

// crateTableUsuarios();
