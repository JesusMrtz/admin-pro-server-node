const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const SEED = require('../config/config').SEED;


const app = express();

app.post('/login', (request, response) => {
    const body = request.body;

    User.findOne({ email: body.email }, (error, userDB) => {
        if (error) {
            response.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                error
            });
        }

        if (!userDB || !bcrypt.compareSync(body.password, userDB.password)) {
            response.status(400).json({
                ok: false,
                message: 'Email o password son incorrectos',
            });
        }

        // Crear un token
        const token = jwt.sign({
            data: userDB
        }, SEED, { expiresIn: 14400 });
        response.status(200).json({
            ok: true,
            data: userDB,
            token,
            id: userDB._id
        });
    });
});


module.exports = app;