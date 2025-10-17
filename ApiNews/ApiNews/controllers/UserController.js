const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel'); // Importamos Profile para la relación
// --- 1. IMPORTAMOS VALIDATIONRESULT ---
const { validationResult } = require('express-validator');

// Definimos las relaciones que queremos incluir en las consultas
const relations = [
    { model: Profile, attributes: ['id', 'nombre'], as: 'perfil' }
];

const get = (request, response) => {
    console.log('➡️  Intentando obtener usuarios...');
    User.findAll({ where: request.query, include: relations })
        .then(entities => {
            console.log(`✅  Consulta GET de usuarios exitosa. Se encontraron ${entities.length} registros.`);
            response.json(entities);
        })
        .catch(err => {
            console.log('❌  Error en consulta GET de usuarios:', err);
            response.status(500).send('Error consultando los datos');
        });
};

const getById = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando obtener usuario con ID: ${id}`);
    User.findByPk(id, { include: relations })
        .then(entitie => {
            if (entitie) {
                console.log('✅  Consulta GET by ID de usuario exitosa.');
                response.json(entitie);
            } else {
                console.log(`⚠️  No se encontró usuario con ID: ${id}`);
                response.status(404).send('Recurso no encontrado');
            }
        })
        .catch(err => {
            console.log('❌  Error en consulta GET by ID de usuario:', err);
            response.status(500).send('Error al consultar el dato');
        });
};

const create = (request, response) => {
    // --- 2. AÑADIMOS EL MANEJO DE ERRORES DE VALIDACIÓN ---
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    console.log('➡️  Intentando crear un nuevo usuario con body:', request.body);
    User.create(request.body)
        .then(newEntitie => {
            console.log('✅  Usuario creado exitosamente.');
            response.status(201).json(newEntitie);
        })
        .catch(err => {
            console.log('❌  Error al crear usuario:', err);
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
    console.log(`➡️  Intentando actualizar usuario con ID: ${id}`);
    User.update(request.body, { where: { id: id } })
        .then(numRowsUpdatedArray => {
            const numRowsUpdated = numRowsUpdatedArray[0];
            console.log(`✅  Se actualizaron ${numRowsUpdated} usuarios.`);
            if (numRowsUpdated > 0) {
                response.status(200).send('Registro actualizado');
            } else {
                response.status(404).send('No se encontró el registro para actualizar.');
            }
        })
        .catch(err => {
            console.log('❌  Error al actualizar usuario:', err);
            response.status(500).send('Error al actualizar');
        });
};

const destroy = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando eliminar usuario con ID: ${id}`);
    User.destroy({ where: { id: id } })
        .then(numRowsDeleted => {
            console.log(`✅  Se eliminaron ${numRowsDeleted} usuarios.`);
            if (numRowsDeleted > 0) {
                response.status(200).send(`${numRowsDeleted} registro eliminado`);
            } else {
                response.status(404).send('El registro no fue encontrado.');
            }
        })
        .catch(err => {
            console.log('❌  Error al eliminar usuario:', err);
            response.status(500).send('Error al eliminar');
        });
};

module.exports = { get, getById, create, update, destroy };