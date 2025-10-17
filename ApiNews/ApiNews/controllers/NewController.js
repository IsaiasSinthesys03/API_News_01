const { New } = require('../models/NewModel');
// Importamos todos los modelos para las relaciones
const { Category } = require('../models/CategoryModel');
const { State } = require('../models/StateModel');
const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');
// --- 1. IMPORTAMOS VALIDATIONRESULT ---
const { validationResult } = require('express-validator');

// Definimos la relación anidada para el perfil del usuario
const relationsUser = [
    { model: Profile, attributes: ['id', 'nombre'], as: 'perfil' }
];
// Definimos todas las relaciones para una Noticia
const relations = [
    { model: Category, attributes: ['id', 'nombre'], as: 'categoria' },
    { model: State, attributes: ['id', 'nombre'], as: 'estado' },
    { model: User, attributes: ['id', 'username'], as: 'usuario', include: relationsUser }
];

const get = (request, response) => {
    console.log('➡️  Intentando obtener noticias...');
    New.findAll({ where: request.query, include: relations })
        .then(entities => {
            console.log(`✅  Consulta GET de noticias exitosa. Se encontraron ${entities.length} registros.`);
            response.json(entities);
        })
        .catch(err => {
            console.log('❌  Error en consulta GET de noticias:', err);
            response.status(500).send('Error consultando los datos');
        });
};

const getById = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando obtener noticia con ID: ${id}`);
    New.findByPk(id, { include: relations })
        .then(entitie => {
            if (entitie) {
                console.log('✅  Consulta GET by ID de noticia exitosa.');
                response.json(entitie);
            } else {
                console.log(`⚠️  No se encontró noticia con ID: ${id}`);
                response.status(404).send('Recurso no encontrado');
            }
        })
        .catch(err => {
            console.log('❌  Error en consulta GET by ID de noticia:', err);
            response.status(500).send('Error al consultar el dato');
        });
};

const create = (request, response) => {
    // --- 2. AÑADIMOS EL MANEJO DE ERRORES DE VALIDACIÓN ---
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    console.log('➡️  Intentando crear una nueva noticia con body:', request.body);
    New.create(request.body)
        .then(newEntitie => {
            console.log('✅  Noticia creada exitosamente.');
            response.status(201).json(newEntitie);
        })
        .catch(err => {
            console.log('❌  Error al crear noticia:', err);
            response.status(500).send('Error al crear');
        });
};

const update = (request, response) => {
    // --- 3. AÑADIMOS EL MANEJO DE ERRORES DE VALIDACIÓN ---
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    const id = request.params.id;
    console.log(`➡️  Intentando actualizar noticia con ID: ${id}`);
    New.update(request.body, { where: { id: id } })
        .then(numRowsUpdatedArray => {
            const numRowsUpdated = numRowsUpdatedArray[0];
            console.log(`✅  Se actualizaron ${numRowsUpdated} noticias.`);
            if (numRowsUpdated > 0) {
                response.status(200).send('Registro actualizado');
            } else {
                response.status(404).send('No se encontró el registro para actualizar.');
            }
        })
        .catch(err => {
            console.log('❌  Error al actualizar noticia:', err);
            response.status(500).send('Error al actualizar');
        });
};

const destroy = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando eliminar noticia con ID: ${id}`);
    New.destroy({ where: { id: id } })
        .then(numRowsDeleted => {
            console.log(`✅  Se eliminaron ${numRowsDeleted} noticias.`);
            if (numRowsDeleted > 0) {
                response.status(200).send(`${numRowsDeleted} registro eliminado`);
            } else {
                response.status(404).send('El registro no fue encontrado.');
            }
        })
        .catch(err => {
            console.log('❌  Error al eliminar noticia:', err);
            response.status(500).send('Error al eliminar');
        });
};

module.exports = { get, getById, create, update, destroy };