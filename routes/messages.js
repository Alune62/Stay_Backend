var express = require('express');
var router = express.Router();
const Message = require('../models/messages');
const User = require('../models/users');
/* 
router.post('/', (req, res) => {
    const newMessage = new Message({
        text: req.body.text,
        username: req.body.username,
        createdAt: new Date(),
        accommodation: req.body.accommodation
    })

    newMessage.save()
    .then(() => {
        res.json({result: true})
    })
})

// Route GET pour récupérer tous les messages
router.get('/', async (req, res) => {
    try {
      const messages = await Message.find({});
      res.json(messages);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  });


// Route DELETE pour supprimer un message par son ID
router.delete('/:id', async (req, res) => {
    try {
      const message = await Message.findByIdAndRemove(req.params.id);
      if (message) {
        res.json({ result: true });
      } else {
        res.status(404).json({ error: 'Message non trouvé' });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  });

  //delete tt les message d'un utlisateur by id
  router.delete('/all/:id', async (req, res) => {
    try {
      // Supprime tous les messages où 'username' correspond à 'req.params.id'
      await Message.deleteMany({ username: req.params.id });
  
      res.send('Les messages ont été supprimés avec succès.');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  }); */

  var express = require('express');
  var router = express.Router();
  
  const Pusher = require('pusher');
  const pusher = new Pusher({
    appId: process.env.PUSHER_APPID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  });
  
  
  // Send message
  router.post('/', (req, res) => {
    pusher.trigger('chat', 'message', req.body);
    console.log(req.body);
  
    res.json({ result: true });
  });


module.exports = router;