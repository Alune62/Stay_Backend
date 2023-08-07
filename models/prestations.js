const mongoose = require('mongoose');


const prestaSchema = mongoose.Schema({
    start:Date,
    end: Date,
    status: String,
    tache: String,

})

const Prestation = mongoose.model('prestations', prestaSchema);

module.exports = Prestation;