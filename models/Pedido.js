const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Pedido = sequelize.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    producto: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // // Foreign Key a Usuario
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "pedidos",
    timestamps: false,
  },
);

module.exports = Pedido;
