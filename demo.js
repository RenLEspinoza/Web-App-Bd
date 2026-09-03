const pool = require("./config/db");
require("dotenv").config();

const { ejecutarConReintentos } = require("./helpers/retryHelper");
const { transferirDinero } = require("./controllers/transferController");
const {
  getUsuarios,
  crearUsuario,
  actualizarEmail,
  eliminarUsuario,
} = require("./controllers/usersController");

// // // Demo de transferencias
// ejecutarConReintentos(() => transferirDinero(1, 2, 50))
//   .then(() => console.log("Proceso finalizado."))
//   .catch((err) => console.error("Proceso abortado por error no recuperable."));

// Objeto req simulado
const req = {
  params: { id: "5" }, // Cambia el ID según sea necesario
  // body: { email: "ana.silva4@email.com" },
};

// Objeto res simulado
const res = {
  status: function (code) {
    console.log("Status Code:", code);
    return this; // Permite encadenar con .json()
  },
  json: function (data) {
    console.log("Respuesta JSON:", data);
  },
};

// Ejecutar la función con los objetos simulados
// eliminarUsuario(req, res);

getUsuarios(req, res);
