const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
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
    }
}, {
    collection: 'Hospital'
});

module.exports = mongoose.model('Hospital', hospitalSchema);