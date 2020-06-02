const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;


verifyToken = (request, response, next) => {
    const token = request.query.token;

    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                ok: false,
                message: 'Token incorrecto',
                errors: error
            });
        }

        request.user = decoded.data;
        next();
    });
}


module.exports = {
    verifyToken
}