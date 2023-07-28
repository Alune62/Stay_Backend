var express = require('express');
var router = express.Router();
const Reservation = require('../models/reservation');

router.post('/reservation', function(req, res) {

  const newReservation = new Reservation({
    name: req.body.name,
    picture: req.body.picture,
    address: req.body.address ,
    description: req.body.address ,
    price: req.body.price ,
    distribution: req.body.distribution ,
   });
   newReservation.save()
   .then(data => {
    console.log(data);
    res.json({newReservation : data})
   });
});


router.get('/reservation', function(req,res) {
  Reservation.find({})
  .then(data=> {
     res.json({reservationList : data})
  })
});


router.delete('/reservation/:id',(req,res) => {
 
Reservation.deleteOne({id: req.params.id})
.then(data => {
  res.json({result: data})
})
  });

module.exports = router;