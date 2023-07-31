var express = require('express');
var router = express.Router();
const Message = require('../models/messages');


router.post('/', (req, res) => {
    const newMessage = new Message({
        Text: req.body.Text,
        username: req.body.username,
        createdAt: req.body.createdAt,
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


module.exports = router;