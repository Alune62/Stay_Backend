var express = require('express');
var router = express.Router();
const Accommodation = require('../models/accommodations');
const { checkBody } = require('../modules/checkBody')

router.post('/', (req, res) => {
  if(!checkBody(req.body, ["name", "picture", "address", "description", "price", "distribution", "owner"])){
    res.json({result: false, error: "Missing or empty fields"});
  }
  const { name, picture, address, description, price, distribution, owner } = req.body

  const newAccommodation = new Accommodation({
    name,
    picture,
    address,
    description,
    price,
    distribution,
    owner,
   });
   console.log(newAccommodation);

   newAccommodation.save()
   .then(data => {
    console.log(data);
    res.json({result: true, })
   });
});


router.put('/update', function(req, res) {
  if(!checkBody(req.body, ["name", "picture", "address", "description", "price", "distribution", "owner"])){
    res.json({result: false, error: "Missing or empty fields"});
  }
  
  const { name, picture, address, description, price, owner } = req.body
  const updatedAccommodation = {
    name,
    picture,
    address,
    description,
    price,
    owner,
   };

   console.log(updatedAccommodation);

   Accommodation.updateOne({ _id: req.body._id }, updatedAccommodation).then((data) => {
    res.json({result: true, newAccommodations: data})
	});
});




router.get('/', function(req, res) {
  Accommodation.find({})
  .then(data=> {
     res.json({result: true, accommodationList : data})
  })
});

router.get('/:owner', (req, res) => {
  Accommodation.find({ owner: req.params.owner })
  .then(data => {
    if (data) {
      res.json(data);
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});








router.delete("/:id", (req, res) =>{
  if(!checkBody(req.body, ["name"])){
      res.json({ result: false, error: "Missing or empty fields"});
      return;
  }
  const { name } = req.body;
  Accommodation.deleteOne({ name: { $regex: new RegExp(name, "i")}})
  .then(deletedDoc => {
      if(deletedDoc.deletedCount > 0){
          res.json({ result: true})
      } else {
          res.json({result: false, error: " not found"})
      }
  })
})


module.exports = router;
