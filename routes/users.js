var express = require('express');
var router = express.Router();
const User = require('../models/users');
const uid2 = require('uid2');

router.post('/', (req, res) => {
  if(!checkBody(req.body, ["firstname", "lastname", "email", "password", "token", "connectionMode", "role"])){
    res.json({result: false, error: "Missing or empty fields"});
}
const { firstname, lastname, email, password, connectionMode, role } = req.body

  const newUser = new User({
    firstname,
    lastname,
    email,
    password,
    token: uid2,
    connectionMode,
    role
   });

   newUser.save()
   .then(data => {
    console.log(data);
    res.json({result: true, })
   });
});


router.get('/', function(req, res) {
  User.find({})
  .then(data=> {
     res.json({result: true, userList : data})
  })
});

router.delete("/:id", (req, res) =>{
  if(!checkBody(req.body, ["id"])){
      res.json({ result: false, error: "Missing or empty fields"});
      return;
  }
  const { id } = req.body;
  User.deleteOne({ id: { $regex: new RegExp(id, "i")}})
  .then(deletedDoc => {
      if(deletedDoc.deletedCount > 0){
          res.json({ result: true})
      } else {
          res.json({result: false, error: " not found"})
      }
  })
})

module.exports = router;
