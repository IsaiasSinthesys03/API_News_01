const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Ruta:
 *       type: object
 *       required:
 *         - origen
 *         - destino
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la ruta
 *         origen:
 *           type: string
 *           description: Ciudad de origen
 *         destino:
 *           type: string
 *           description: Ciudad de destino
 *         distancia:
 *           type: number
 *           description: Distancia en kilómetros
 */

/**
 * @swagger
 * /api/rutas:
 *   get:
 *     summary: Obtiene todas las rutas
 *     tags: [Rutas]
 *     responses:
 *       200:
 *         description: Lista de todas las rutas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ruta'
 */
router.get('/', (req, res) => {
    // Por ahora, devolvemos datos de ejemplo
    res.json([
        {
            id: "1",
            origen: "Madrid",
            destino: "Barcelona",
            distancia: 621
        },
        {
            id: "2",
            origen: "Barcelona",
            destino: "Valencia",
            distancia: 351
        }
    ]);
});

/**
 * @swagger
 * /api/rutas/{id}:
 *   get:
 *     summary: Obtiene una ruta por ID
 *     tags: [Rutas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la ruta
 *     responses:
 *       200:
 *         description: Ruta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ruta'
 *       404:
 *         description: Ruta no encontrada
 */
router.get('/:id', (req, res) => {
    const rutaEjemplo = {
        id: req.params.id,
        origen: "Madrid",
        destino: "Barcelona",
        distancia: 621
    };
    res.json(rutaEjemplo);
});

module.exports = router;