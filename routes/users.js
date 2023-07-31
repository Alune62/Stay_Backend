var express = require('express');
var router = express.Router();
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody')
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
  if(!checkBody(req.body, ["firstname", "lastname", "username", "email", "password", "connectionMode", "role"])){
    res.json({result: false, error: "Missing or empty fields"});
    return;
}

 // Check if the user has not already been registered
 User.findOne({ username: req.body.username }).then(data => {
  if (data === null) {
    const hash = bcrypt.hashSync(req.body.password, 10);

  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: hash,
    token: uid2(32),
    connectionMode: req.body.connectionMode,
    role: req.body.role
   });

   newUser.save().then(newDoc => {
    res.json({ result: true, token: newDoc.token });
  });
          } else {
  // User already exists in database
          res.json({ result: false, error: 'User already exists' });
          }
return;
     });
})



router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

router.delete("/:id", (req, res) =>{
  if(!checkBody(req.body, ["username"])){
      res.json({ result: false, error: "Missing or empty fields"});
      return;
  }
  const { username } = req.body;
  User.deleteOne({ username: { $regex: new RegExp(username, "i")}})
  .then(deletedDoc => {
      if(deletedDoc.deletedCount > 0){
          res.json({ result: true})
      } else {
          res.json({result: false, error: " not found"})
      }
  })
})

module.exports = router;

