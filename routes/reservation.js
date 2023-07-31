var express = require('express');
var router = express.Router();
const Reservation = require('../models/reservations');

// Route POST pour créer une nouvelle réservation
router.post('/', function(req, res) {
  const newReservation = new Reservation({
    name: req.body.name,
    picture: req.body.picture,
    address: req.body.address,
    description: req.body.description, // Correction du champ description
    price: req.body.price,
    distribution: req.body.distribution,
    userTenant: req.body.userTenant // Correction du champ userTenant
  });

  newReservation.save()
    .then(data => {
      console.log(data);
      res.json({ newReservation: data });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de la sauvegarde de la réservation' });
    });
});

// Route GET pour récupérer toutes les réservations d'un utilisateur
router.get('/:id', async (req, res) => {
  try {
    const reservations = await Reservation.find({ userTenant: req.params.id });
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route GET pour récupérer toutes les réservations
router.get('/', function(req, res) {
  Reservation.find({})
    .then(data => {
      res.json({ reservationList: data });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des réservations' });
    });
});



// Route DELETE pour supprimer une réservation par son ID
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndRemove(req.params.id);
    res.json({ result: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});



module.exports = router;
