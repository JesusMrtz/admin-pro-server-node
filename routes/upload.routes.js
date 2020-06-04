const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');

const app = express();
app.use(fileUpload());

app.put('/upload/:type/:id', (request, response, next) => {
    const type = request.params.type;
    const id = request.params.id;
    const validTypes = ['hospital', 'doctor', 'user'];

    if (validTypes.indexOf(type) < 0) {
        return response.status(400).json({
            ok: true,
            message: 'La colección no es válida',
            errors: {
                message: 'La colección no es válida'
            }
        });
    }

    if (!request.files) {
        return response.status(400).json({
            ok: true,
            message: 'No seleccionó una imagen',
            errors: {
                message: 'No seleccionó una imagen'
            }
        });
    }

    const file = request.files.image;
    const splitFile = file.name.split('.');
    const extensionFile = splitFile[splitFile.length - 1];

    const extensionValid = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionValid.indexOf(extensionFile) < 0) {
        return response.status(400).json({
            ok: true,
            message: 'EXtensión no válida',
            errors: {
                message: 'Las extensiones válidas son: ' + extensionValid.join(', ')
            }
        });
    }

    const nameFile = `${id}-${new Date().getMilliseconds()}.${extensionFile}`;

    const path = `./uploads/${type}/${nameFile}`;
    file.mv(path, (error) => {
        if (error) {
            return response.status(400).json({
                ok: true,
                message: 'Error guardar la imagen',
                errors: error
            });
        }
    });

    const MODEL = uploadByType(type);

    MODEL.findById(id, (error, responseDB) => {
        let oldPath = `./uploads/${type}/${responseDB.image}`;

        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }

        responseDB.image = nameFile;
        responseDB.save((error, responseSave) => {
            response.status(200).json({
                ok: true,
                message: `Imagen de ${type} actualizada`,
                data: responseSave
            });
        });
    });
});

function uploadByType(type) {
    let modelInProgress;
    switch (type) {
        case 'user':
            modelInProgress = User;
            break;
        case 'doctor':
            modelInProgress = Doctor;
            break;
        case 'hospital':
            modelInProgress = Hospital;
            break;
        default:
            modelInProgress = false;
            break;
    }

    return modelInProgress;
}


module.exports = app;