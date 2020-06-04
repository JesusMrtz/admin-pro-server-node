const express = require('express');
const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');
const app = express();


app.get('/search/collection/todo/:search', (request, response) => {
    const regexSearch = new RegExp(request.params.search, 'i');


    Promise.all([searchHospitals(regexSearch), searchDoctors(regexSearch), searchUser(regexSearch)])
        .then((responsePromise) => {
            response.status(200).json({
                ok: true,
                data: {
                    hospitals: responsePromise[0],
                    doctor: responsePromise[1],
                    users: responsePromise[2]
                }
            });
        });
});

app.get('/search/:model/:search', (request, response) => {
    const model = request.params.model;
    const regexSearch = new RegExp(request.params.search, 'i');
    let modelPromise;

    switch (model) {
        case 'user':
            modelPromise = searchUser(regexSearch);
            break;
        case 'hospital':
            modelPromise = searchHospitals(regexSearch);
            break;
        case 'doctor':
            modelPromise = searchDoctors(regexSearch);
            break;
        default:
            modelPromise = false;
            break;
    }

    if (!modelPromise) {
        return response.status(400).json({
            ok: false,
            message: 'No existe el modelo en la base de datos',
            error: {
                message: 'No existe el modelo en la base de datos'
            }
        });
    }

    modelPromise.then((responsePromise) => {
        response.status(200).json({
            ok: true,
            data: responsePromise
        });
    });
});

function searchHospitals(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec((error, hospitalsDB) => {
                if (error) {
                    reject('Error al cargar hospitales');
                } else {
                    resolve(hospitalsDB);
                }
            });
    });
}

function searchDoctors(regex) {
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex })
            .populate('user', 'name email')
            .populate('hospital')
            .exec((error, doctorsDB) => {
                if (error) {
                    reject('Error al cargar doctores');
                } else {
                    resolve(doctorsDB);
                }
            });
    });
}

function searchUser(regex) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
            .or([{ name: regex }, { email: regex }])
            .exec((error, usersDB) => {
                if (error) {
                    reject('Error al cargar usuarios');
                } else {
                    resolve(usersDB);
                }
            });
    });
}

module.exports = app;