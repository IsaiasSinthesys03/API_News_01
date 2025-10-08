const express = require('express')
const { connection } = require('./config.db')
// Importar modelos para que se registren
require('./models/ProfileModel')
require('./models/CategoryModel')
require('./models/StateModel')
require('./models/UserModel')
require('./models/NewModel')

const app = express();
const PORT = 3000

app.use(express.json());

// Sincronizar modelos con la base de datos
connection.sync({ force: false })
  .then(() => {
    console.log('Modelos sincronizados correctamente con la base de datos')
  })
  .catch(err => {
    console.error('Error al sincronizar modelos:', err)
  })

app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
});

module.exports = app;