// Requires
const express = require('express');
const mongoose = require('mongoose');



// Inicializar variables
const app = express();

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Conectado a la BD CORRECTAMENTE'));

// Rutas
app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        message: 'Petición realizada correctamente'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000 online');
});