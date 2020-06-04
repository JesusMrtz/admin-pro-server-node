const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    image: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es necesario'],
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'El hospital es necesario'],
    }
}, {
    collection: 'Doctor'
});

module.exports = mongoose.model('Doctor', doctorSchema);