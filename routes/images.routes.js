const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();


app.get('/images/:type/:img', (request, response) => {
    const type = request.params.type;
    const img = request.params.img;

    const pathImage = path.resolve(__dirname, `../uploads/${type}/${img}`);

    if (fs.existsSync(pathImage)) {
        response.sendFile(pathImage);
    } else {
        const pathNoImage = path.resolve(__dirname, '../assets/img/no-img.jpg');
        response.sendFile(pathNoImage);
    }
});


module.exports = app;