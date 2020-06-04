const express = require('express');
const Doctor = require('../models/doctor.model');
const { verifyToken } = require('../middlewares/autenticate.middleware');

const app = express();


app.get('/doctors', verifyToken, (request, response) => {
    const from = Number(request.query.from) || 5;

    Doctor.find({})
        .limit(5)
        .skip(from)
        .populate('user', 'name email')
        .populate('hospital', 'name image')
        .exec((error, doctorsDB) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    error
                });
            }

            Doctor.countDocuments({}, (error, countDoctors) => {
                response.json({
                    ok: true,
                    data: doctorsDB,
                    count: countDoctors
                });
            });
        });
});

app.get('/doctor/:id', verifyToken, (request, response) => {
    let id = request.params.id;

    Doctor.findById(id, (error, doctorDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: doctorDB
        });
    });
});

app.post('/doctor', [verifyToken], (request, response) => {
    let body = request.body;
    let newDoctor = new Doctor({
        name: body.name,
        user: request.user._id,
        hospital: body.hospital
    });

    newDoctor.save((error, saveDoctor) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: saveDoctor
        });
    });
});

app.put('/doctor/:id', [verifyToken], (request, response) => {
    let id = request.params.id;
    let body = {
        name: request.body.name,
        user: request.user._id,
        hospital: request.body.hospital
    };

    Doctor.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (error, doctorDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: doctorDB
        });
    });
});

app.delete('/doctor/:id', [verifyToken], function(request, response) {
    let id = request.params.id;

    Hospital.findOneAndRemove(id, (error, doctorDelete) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        if (!doctorDelete) {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'Doctor no encontrado'
                }
            });
        }

        response.json({
            ok: true,
            data: doctorDelete
        });
    });
});


module.exports = app;