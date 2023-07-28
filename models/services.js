const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref:'users' },
    prestation: String,
    company: String,
    address: String,
    position: String
})


const Service = mongoose.model('services', serviceSchema);

module.exports = Service;