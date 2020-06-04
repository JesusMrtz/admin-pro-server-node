const express = require('express');
const Hospital = require('../models/hospital.model');
const app = express();

app.get('/search/todo/:search', (request, response, next) => {
    const search = request.params.search;
    const regex = new RegExp(search, 'i');

    Hospital.find({ name: regex }, (error, hospitalsDB) => {
        response.status(200).json({
            ok: true,
            data: hospitalsDB
        });
    });
});


module.exports = app;