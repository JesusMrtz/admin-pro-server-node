const express = require('express');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middlewares/autenticate.middleware');
const User = require('../models/user.model');


const app = express();

app.get('/users', (request, response, next) => {

    User.find({}, 'name email image role')
        .exec((error, usersDB) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    message: 'Error en la base de datos al obtener usuarios',
                    errors: error
                });
            }

            response.status(200).json({
                ok: true,
                data: usersDB
            });
        });
});

app.post('/user', [verifyToken], (request, response) => {
    const body = request.body;
    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        image: body.image,
        role: body.role
    });

    user.save((error, userSave) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: error
            });
        }

        response.status(201).json({
            ok: true,
            data: userSave
        });
    });
});

app.put('/user/:id', [verifyToken], (request, response) => {
    const id = request.params.id;
    const body = request.body;

    User.findById(id, (error, userDB) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error al encontrar el usuario',
                errors: error
            });
        }

        if (!userDB) {
            return response.status(400).json({
                ok: false,
                message: `El usuario con el id ${id} no existe`,
                error: {
                    message: 'No se encuentra el usuario'
                }
            });
        }

        userDB.name = body.name;
        userDB.email = body.email;
        userDB.role = body.role;

        userDB.save((error, userSave) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    errors: error
                });
            }

            response.status(200).json({
                ok: true,
                data: userSave
            });
        });
    });
});

app.delete('/user/:id', [verifyToken], (request, response) => {
    const id = request.params.id;

    User.findByIdAndRemove(id, (error, userDeleted) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error al borrar el usuario',
                errors: error
            });
        }

        if (!userDeleted) {
            return response.status(400).json({
                ok: false,
                message: 'El usuario no existe',
                errors: {
                    message: 'No existe el usuario'
                }
            });
        }

        response.status(200).json({
            ok: true,
            data: userDeleted
        });

    });
});


module.exports = app;