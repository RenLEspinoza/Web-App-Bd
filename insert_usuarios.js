const pool = require("./config/db");

const usuarios = [
  {
    nombre: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    phone_number: "+56911112222",
    password_hash: "123456",
    balance: 1500.5,
    currency: "USD",
    status: "active",
  },
  {
    nombre: "Ana Silva",
    email: "ana.silva@email.com",
    phone_number: "+56933334444",
    password_hash: "654321",
    balance: 450.0,
    currency: "USD",
    status: "active",
  },
  {
    nombre: "Mateo Rojas",
    email: "mateo.rojas@email.com",
    phone_number: "+56955556666",
    password_hash: "112233",
    balance: 0.0,
    currency: "USD",
    status: "active",
  },
  {
    nombre: "Elena Torres",
    email: "elena.torres@email.com",
    phone_number: "+56977778888",
    password_hash: "445566",
    balance: 2800.0,
    currency: "USD",
    status: "active",
  },
  {
    nombre: "Lucas Gómez",
    email: "lucas.gomez@email.com",
    phone_number: "+56999990000",
    password_hash: "778899",
    balance: 50.25,
    currency: "USD",
    status: "suspended",
  },
];

async function poblarUsuarios() {
  const query = `
    INSERT INTO usuarios (nombre, email, phone_number, password_hash, balance, currency, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
  `;

  try {
    for (const u of usuarios) {
      await pool.query(query, [
        u.nombre,
        u.email,
        u.phone_number,
        u.password_hash,
        u.balance,
        u.currency,
        u.status,
      ]);
    }
    console.log("¡5 usuarios insertados con éxito en la tabla 'usuarios'!");
  } catch (error) {
    console.error("Error al insertar usuarios:", error.message);
  } finally {
    await pool.end(); // Cierra la conexión al finalizar
  }
}

// poblarUsuarios();
