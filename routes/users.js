const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uid2 = require('uid2');
const User = require('../models/users'); // Suppose que le modèle de données de l'utilisateur est défini dans le fichier 'user.js'
const { checkBody } = require('../modules/checkBody'); // Suppose que la fonction checkBody est définie dans le fichier 'utils.js'
const bodyParser = require('body-parser');
const app = express(); // (2)
app.use(bodyParser.json());
const Pusher = require('pusher');
const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});
//"connectionMode", "role"
// Route d'inscription
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ["firstname", "lastname", "username", "email", "password", "role"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    return;
  }

  // Vérifier si l'utilisateur n'est pas déjà enregistré
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
        //connectionMode: req.body.connectionMode,
        role: req.body.role,
        services: {
          prestation: req.body.services.prestation,
          company: req.body.services.company,
          address: req.body.services.address,
          position: req.body.services.position,
    },
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // L'utilisateur existe déjà dans la base de données
      res.json({ result: false, error: 'L\'utilisateur existe déjà' });
    }
  });
});


// Route de connexion
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Champs manquants ou vides' });
    return;
  }

  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'Utilisateur introuvable ou mot de passe incorrect' });
    }
  });
});
// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
      const users = await User.find({});  
      res.json(users);  // Renvoyer les utilisateurs en tant que réponse JSON
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
  }
});

// Récupérer les infos d'un propriétaire selon son token, mais pas son password quand même voyons
router.get('/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true, firstname: data.firstname, lastname: data.lastname, username: data.username, email: data.email });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

// Route de recherche d'utilisateur
/* router.get('/', (req, res) => {
  User.find({ username: req.params.user }).then(data => {
    console.log(data);
    if (data) {
      res.json({ result: true, users: data.username });
    } else {
      res.json({ result: false, error: 'Utilisateur non trouvé' });
    }
  });
}); */

// Route de recherche d'utilisateur
router.get('/search', (req, res) => {
  User.find({ username: req.query.username }).then(data => {
    console.log(data);
    if (data) {
      res.json({ result: true, users: data.username });
    } else {
      res.json({ result: false, error: 'Utilisateur non trouvé' });
    }
  });
});

// Route de suppression d'utilisateur par id
router.delete("/:id", (req, res) => {
  if (!checkBody(req.body, ["username"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    return;
  }
  const { username } = req.body;
  User.deleteOne({ username: { $regex: new RegExp(username, "i") } })
    .then(deletedDoc => {
      if (deletedDoc.deletedCount > 0) {
        res.json({ result: true });
      } else {
        res.json({ result: false, error: "Utilisateur non trouvé" });
      }
    });
});

 // Join chat
 router.put('/:username', (req, res) => {
  const username = req.params.username;
  pusher.trigger('chat', 'join', {
    username: username,
  });
  
  res.json({ result: true });
});

  // Leave chat
  router.delete("/:username", (req, res) => {
    const username = req.params.username; 
    pusher.trigger('chat', 'leave', {
      username: username,
    });
  
    res.json({ result: true });
  });

module.exports = router;
