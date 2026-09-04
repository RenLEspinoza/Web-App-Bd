const User = require("../models/user");

const obtenerUsuariosORM = async (req, res) => {
  try {
    // Uso del método nativo del ORM
    const usuarios = await User.findAll();

    res.status(200).json({
      exito: true,
      mensaje: "Usuarios obtenidos usando Sequelize ORM",
      data: usuarios,
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener usuarios con ORM",
      error: error.message,
    });
  }
};

module.exports = { obtenerUsuariosORM };
