const mongoose = require('mongoose');


const reservationSchema = mongoose.Schema({
 arrival: Date,
 departure: Date,
 price: Number,
 status: String,
 distribution: String,
 user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
});

const Reservation = mongoose.model('reservations', reservationSchema);

module.exports = Reservation;
