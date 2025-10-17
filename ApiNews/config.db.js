// config.db.js (Versión Final para Render/Postgres)
const Sequelize = require('sequelize');
require('dotenv').config();

// Buscamos la URL de conexión única en las variables de entorno
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("No se encontró la URL de la base de datos. Asegúrate de que DATABASE_URL esté definida en Render.");
}

const connection = new Sequelize(dbUrl, {
  dialect: 'postgres', // Cambiamos el dialecto a postgres
  // Esta parte es MUY IMPORTANTE para la conexión segura en Render
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Requerido por la configuración de SSL de Render
    }
  }
});

module.exports = { connection };