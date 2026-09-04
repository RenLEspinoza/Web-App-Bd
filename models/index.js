const Usuario = require("./Usuario");
const Pedido = require("./Pedido");
const Cuenta = require("./Cuenta");
const Perfil = require("./Perfil");

// Relación (1:N): Un Usuario tiene muchos Pedidos
Usuario.hasMany(Pedido, { foreignKey: "usuario_id", as: "pedidos" });
Pedido.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" }); // Un pedido pertenece a un Usuario

// Relación (1:1): Un Usuario tiene un Perfil
Usuario.hasOne(Perfil, { foreignKey: "usuario_id", as: "perfil" });
Perfil.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" }); // Un perfil pertenece a un Usuario

// Relación (1:1): Un Usuario tiene una Cuenta
Usuario.hasOne(Cuenta, { foreignKey: "usuario_id", as: "cuenta" });
Cuenta.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" }); // Una cuenta pertenece a un Usuario

module.exports = {
  Usuario,
  Pedido,
  Cuenta,
  Perfil,
};
