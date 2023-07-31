const mongoose = require('mongoose');


const reservationSchema = mongoose.Schema({
 arrival: Date,
 departure: Date,
 price: Number,
 status: String,
 distribution: String,
 usertenant: { type: mongoose.Schema.Types.name, ref: 'usertenant' } 
});

const Reservation = mongoose.model('reservations', reservationSchema);

module.exports = Reservation;
