var express = require('express');
var router = express.Router();
const Reservation = require('../models/reservations');

//Route post d'une nouvelle reservation
router.post('/', function(req, res) {
  const newReservation = new Reservation({
    arrival: req.body.arrival,
    departure: req.body.departure,
    price: req.body.price,
    status: req.body.status,
    distribution: req.body.distribution,
  });

  newReservation.save()
    .then(data => {
      console.log(data);
      res.json({newReservation : data});
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Erreur serveur');
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

//Route de recherche des reservations.
router.get('/', function(req,res) {
  Reservation.find({})
  .then(data=> {
     res.json({reservationList : data})
  })
});

// Route DELETE pour supprimer une réservation par son ID
router.delete('/:id', async (req, res) => {
  try {
      const reservation = await Reservation.findByIdAndRemove(req.params.id);

      if (!reservation) {
          return res.status(404).send('La réservation avec l\'ID donné n\'a pas été trouvée.');
      }

      res.send('La réservation a été supprimée avec succès.');
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
  }
});

module.exports = router;