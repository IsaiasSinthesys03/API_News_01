const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Array de usuarios
let usuarios = [
    { id: 1, nombre: "Math Jhon", edad: 25 },
    { id: 2, nombre: "Sarah Smith", edad: 30 },
    { id: 3, nombre: "Carlos Rodriguez", edad: 28 },
    { id: 4, nombre: "Ana García", edad: 22 },
    { id: 5, nombre: "Mike Johnson", edad: 35 }
];

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Usuarios',
            version: '1.0.0',
            description: 'API para gestionar usuarios',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./index.js'], // documentación directamente en este archivo
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Ruta para exponer el JSON de Swagger
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecs);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - edad
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario
 *         nombre:
 *           type: string
 *           description: Nombre completo del usuario
 *         edad:
 *           type: integer
 *           description: Edad del usuario
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios con opción de filtrado
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: edadMin
 *         schema:
 *           type: integer
 *         description: Edad mínima
 *       - in: query
 *         name: edadMax
 *         schema:
 *           type: integer
 *         description: Edad máxima
 *     responses:
 *       200:
 *         description: Lista de usuarios filtrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
app.get('/api/usuarios', (req, res) => {
    let resultado = [...usuarios];
    
    // Filtrado por nombre
    if (req.query.nombre) {
        resultado = resultado.filter(user => 
            user.nombre.toLowerCase().includes(req.query.nombre.toLowerCase())
        );
    }

    // Filtrado por edad mínima
    if (req.query.edadMin) {
        resultado = resultado.filter(user => 
            user.edad >= parseInt(req.query.edadMin)
        );
    }

    // Filtrado por edad máxima
    if (req.query.edadMax) {
        resultado = resultado.filter(user => 
            user.edad <= parseInt(req.query.edadMax)
        );
    }

    res.json(resultado);
});

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Agrega un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - edad
 *             properties:
 *               nombre:
 *                 type: string
 *               edad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
app.post('/api/usuarios', (req, res) => {
    const { nombre, edad } = req.body;
    
    if (!nombre || !edad) {
        return res.status(400).json({ error: 'Nombre y edad son requeridos' });
    }

    const newUser = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        nombre,
        edad
    };

    usuarios.push(newUser);
    res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
app.get('/api/usuarios/:id', (req, res) => {
    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
app.delete('/api/usuarios/:id', (req, res) => {
    const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    usuarios.splice(index, 1);
    res.json({ message: 'Usuario eliminado exitosamente' });
});

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const rutasRouter = require('./routes/rutas');

// Rutas
app.use('/api/rutas', rutasRouter);

// Ruta básica de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Información de Rutas' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
        console.log(`Documentación Swagger disponible en http://localhost:${port}/api-docs`);
        console.log(`Archivo OpenAPI disponible en http://localhost:${port}/swagger.json`);
});