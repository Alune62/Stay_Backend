var express = require('express');
var router = express.Router();
const Accommodation = require('../models/accommodations');
const { checkBody } = require('../modules/checkBody')

router.post('/', (req, res) => {console.log(req.body);
  if(!checkBody(req.body, ["name", "picture", "address", "description", "price", "distribution"])){
    res.json({result: false, error: "Missing or empty fields"});return;
}
const { name, picture, address, description, price, distribution } = req.body

  const newAccommodation = new Accommodation({
    name,
    picture,
    address,
    description,
    price,
    distribution,
   });

   newAccommodation.save()
   .then(data => {
    console.log(data);
    res.json({result: true, })
   });
});


router.get('/', function(req, res) {
  Accommodation.find({})
  .then(data=> {
     res.json({result: true, accommodationList : data})
  })
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
