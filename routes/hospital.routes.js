const express = require('express');
const Hospital = require('../models/hospital.model');
const { verifyToken } = require('../middlewares/autenticate.middleware');

const app = express();


app.get('/hospitals', (request, response) => {
    const from = Number(request.query.from) || 5;

    Hospital.find({})
        .limit(5)
        .skip(from)
        .populate('user', 'name email')
        .exec((error, HospitalsDB) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    error
                });
            }

            Hospital.countDocuments({}, (error, countHospitals) => {
                response.json({
                    ok: true,
                    data: HospitalsDB,
                    count: countHospitals
                });
            });
        });
});

app.get('/hospital/:id', verifyToken, (request, response) => {
    let id = request.params.id;

    Hospital.findById(id, (error, HospitalDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: HospitalDB
        });
    });
});

app.post('/hospital', [verifyToken], (request, response) => {
    let body = request.body;
    let newHospital = new Hospital({
        name: body.name,
        user: request.user._id
    });

    newHospital.save((error, saveHospital) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: saveHospital
        });
    });
});

app.put('/hospital/:id', [verifyToken], (request, response) => {
    let id = request.params.id;
    let body = {
        name: request.body.name,
        user: request.user._id
    };

    Hospital.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (error, hospitalDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: hospitalDB
        });
    });
});

app.delete('/hospital/:id', [verifyToken], function(request, response) {
    let id = request.params.id;

    Hospital.findOneAndRemove(id, (error, hospitalDelete) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        if (!hospitalDelete) {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'Hospital no encontrado'
                }
            });
        }

        response.json({
            ok: true,
            data: hospitalDelete
        });
    });
});

module.exports = app;