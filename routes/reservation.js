var express = require('express');
var router = express.Router();
const Reservation = require('../models/reservations');

router.post('/', function(req, res) {

  const newReservation = new Reservation({
    arrival: req.body.arrival,
    departure: req.body.departure,
    price: req.body.price,
    status: req.body.status,
    distribution: req.body.distribution,
     user: req.body.user
   });
   newReservation.save()
   .then(data => {
    console.log(data);
    res.json({newReservation : data})
   });
});


router.get('/', function(req,res) {
  Reservation.find({})
  .then(data=> {
     res.json({reservationList : data})
  })
});


router.delete('/:id',(req,res) => {
 
Reservation.deleteOne({id: req.params.id})
.then(data => {
  res.json({result: data})
})
  });

module.exports = router;