const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Perfil = sequelize.define(
  "Perfil",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    biografia: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    foto_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Foreign Key a Usuario
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Asegura que sea relación 1 a 1
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "perfiles",
    timestamps: false,
  },
);

module.exports = Perfil;
