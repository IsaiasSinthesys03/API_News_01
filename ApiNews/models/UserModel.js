const { DataTypes } = require('sequelize');
const { connection } = require("../config.db");

const User = connection.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  UserAlta: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Admin"
  },
  FechaAlta: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: "1990-01-01T00:00:00.000Z"
  },
  UserMod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  FechaMod: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue:'1990-01-01T00:00:00.000Z'
  },
  UserBaja: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  FechaBaja: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue:'1990-01-01T00:00:00.000Z'
  },
})

module.exports = { User };