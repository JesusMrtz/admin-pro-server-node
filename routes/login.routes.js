const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');
const SEED = require('../config/config').SEED;
const CLIENT_ID = require('../config/config').CLIENT_ID;

const app = express();
const client = new OAuth2Client(CLIENT_ID);

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

app.post('/login/google', async(request, response) => {
    const token = request.body.token;
    const userByGoogle = await verify(token)
        .catch((error) => {
            return response.status(403).json({
                ok: false,
                message: 'Token no válido',
                errors: error
            });
        });

    User.findOne({ email: userByGoogle.email }, (error, userInDB) => {
        if (error) {
            response.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                error
            });
        }

        if (userInDB && !userInDB.google) {
            response.status(400).json({
                ok: false,
                message: 'Usuario no existe',
            });
        } else if (userInDB && userInDB.google) {
            // Crear un token
            const token = jwt.sign({
                data: userInDB
            }, SEED, { expiresIn: 14400 });

            response.status(200).json({
                ok: true,
                data: userInDB,
                token,
                id: userInDB._id
            });
        } else {
            const user = new User();
            user.name = userByGoogle.name;
            user.email = userByGoogle.email;
            user.google = true;
            user.password = ':)';
            user.image = userByGoogle.image;

            user.save((error, userSave) => {
                if (error) {
                    response.status(500).json({
                        ok: false,
                        message: 'Error al buscar usuarios',
                        error
                    });
                }

                response.status(200).json({
                    ok: true,
                    data: userSave,
                    token,
                    id: userSave._id
                });
            });
        }
    });
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    }
}


module.exports = app;