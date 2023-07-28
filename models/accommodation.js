const mongoose = require('mongoose');
require('./connection');

const accommodationSchema = mongoose.Schema({
 name: String,
 picture: Image,
 address: String,
 description: String,
 price: Number,
 distribution: String,
});

const Accommodation = mongoose.model('accommodation', accommodationSchema);

module.exports = Accommodation;
