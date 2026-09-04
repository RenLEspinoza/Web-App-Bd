const { Usuario, Perfil, Cuenta, Pedido } = require("../models");

// Función para obtener todos los usuarios usando Sequelize ORM
const obtenerUsuariosORM = async (req, res) => {
  try {
    // Uso del método nativo del ORM
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["password", "telefono"] }, // Excluye campos sensibles directamente desde la BD
    });

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

// función para obtener un usuario por su ID junto con sus relaciones (pedidos, perfil y cuenta)
const obtenerUsuarioConRelaciones = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ["password", "telefono"] }, // Excluye campos sensibles directamente desde la BD
      include: [
        { model: Pedido, as: "pedidos" },
        { model: Perfil, as: "perfil" },
        { model: Cuenta, as: "cuenta" },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    console.log("Usuario con relaciones:", usuario.toJSON());
    return res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario con relaciones:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Función para crear un usuario junto con sus relaciones (perfil, cuenta y pedidos)
const crearUsuarioCompletoORM = async (req, res) => {
  try {
    const { nombre, email } = req.body;

    // valida los requerimientos mínimos del body
    if (!nombre || !email) {
      return res.status(400).json({
        mensaje: "El nombre y el email son campos obligatorios.",
      });
    }

    //  Crea el usuario y todos sus registros asociados
    const nuevoUsuario = await Usuario.create(req.body, {
      include: [
        // include para las relaciones
        { model: Perfil, as: "perfil" },
        { model: Cuenta, as: "cuenta" },
        { model: Pedido, as: "pedidos" },
      ],
    });

    // Convertir la instancia a objeto plano de JS
    const usuarioPlano = nuevoUsuario.toJSON();

    // Excluir campos sensibles (password y telefono)
    const { password, telefono, perfil, cuenta, pedidos, ...datosUsuario } =
      usuarioPlano;

    // Mostrar las tablas limpias y desglosadas en la consola
    console.log(
      "\n=================== NUEVO USUARIO CREADO ===================",
    );
    console.table([datosUsuario]);

    if (perfil) {
      console.log("--- PERFIL DEL USUARIO ---");
      console.table([perfil]);
    }

    if (cuenta) {
      console.log("--- CUENTA BANCARIA ---");
      console.table([cuenta]);
    }

    if (pedidos && pedidos.length > 0) {
      console.log("--- PEDIDOS REALIZADOS ---");
      console.table(pedidos);
    }
    console.log(
      "===========================================================\n",
    );

    // Responder al cliente (Thunder Client recibe la estructura JSON anidada completa)
    return res.status(201).json(nuevoUsuario);
  } catch (error) {
    // captura si el email o número de cuenta ya existe en la base de datos (constraint unique)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        mensaje: "El email o número de cuenta ya se encuentra registrado.",
        error: error.errors.map((e) => e.message),
      });
    }

    // Capturar errores de validación de Sequelize (length, isEmail, allowNull)
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación en los datos enviados.",
        errores: error.errors.map((e) => e.message),
      });
    }

    console.error("Error al crear usuario completo:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerUsuariosORM,
  obtenerUsuarioConRelaciones,
  crearUsuarioCompletoORM,
};
