const mongoose = require('mongoose');


const accommodationSchema = mongoose.Schema({
 name: String,
 picture: String,
 address: String,
 description: String,
 price: Number,
 distribution: Array,
 owner: { type: mongoose.Schema.Types.ObjectId, ref:'users' },
});

const Accommodation = mongoose.model('accommodations', accommodationSchema);

module.exports = Accommodation;
