var express = require('express');
var router = express.Router();
const Reservation = require('../models/reservations');

// Route POST pour créer une nouvelle réservation
router.post('/', async (req, res) => {
  try {
    const newReservation = new Reservation({
      arrival: req.body.arrival,
      departure: req.body.departure,
      price: req.body.price,
      status: req.body.status,
      distribution: req.body.distribution,
    });

    const savedReservation = await newReservation.save();
    res.json({ newReservation: savedReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la sauvegarde de la réservation' });
  }
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

router.put('/:id', async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
         
          arrival: req.body.arrival,
          departure: req.body.departure,
          price: req.body.price,
          status: req.body.status,
          distribution: req.body.distribution,
      },
      
      { new: true } // Retourne le document mis à jour
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: 'La réservation n\'a pas été trouvée' });
    }
    res.json({ updatedReservation });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});



module.exports = router;
