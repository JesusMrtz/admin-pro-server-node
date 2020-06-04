// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');

// Inicializar variables
const app = express();
// Body parser 
// Parse aplication /x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Importar rutas
const LOGIN = require('./routes/login.routes');
const APP_ROUTES = require('./routes/app.routes');
const USER_ROUTES = require('./routes/user.routes');
const HOSPITAL = require('./routes/hospital.routes');
const DOCTORS = require('./routes/doctor.routes');
const SEARCH = require('./routes/search.routes');
const UPLOAD = require('./routes/upload.routes');
const IMAGES = require('./routes/images.routes');

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Conectado a la BD CORRECTAMENTE'));

/*
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*/

// Importar rutas
app.use('/', LOGIN);
app.use('/', USER_ROUTES);
app.use('/', HOSPITAL);
app.use('/', DOCTORS);
app.use('/', SEARCH);
app.use('/', UPLOAD);
app.use('/', IMAGES);
app.use('/', APP_ROUTES);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000 online');
});