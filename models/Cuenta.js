const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Cuenta = sequelize.define(
  "Cuenta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_cuenta: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    saldo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    tipo_cuenta: {
      type: DataTypes.STRING(50), // ejemplo: 'corriente', 'vista', 'ahorro'
      allowNull: false,
      defaultValue: "vista",
    },
    // // Foreign Key a Usuario
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "cuentas",
    timestamps: false,
  },
);

module.exports = Cuenta;
