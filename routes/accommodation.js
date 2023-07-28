var express = require('express');
var router = express.Router();
const Accommodation = require('../models/accommodation');

router.post('/accommodation', function(req, res) {

  const newAccommodation = new Accommodation({
    name: req.body.name,
    picture: req.body.picture,
    address: req.body.address ,
    description: req.body.address ,
    price: req.body.price ,
    distribution: req.body.distribution ,
   });
   newAccommodation.save()
   .then(data => {
    console.log(data);
    res.json({newAccommodation : data})
   });
});


router.get('/accommodation', function(req,res) {
  Accommodation.find({})
  .then(data=> {
     res.json({accommodationList : data})
  })
});


router.delete('/accommodation/:id',(req,res) => {
 
Accommodation.deleteOne({id: req.params.id})
.then(data => {
  res.json({result: data})
})
  });

module.exports = router;
