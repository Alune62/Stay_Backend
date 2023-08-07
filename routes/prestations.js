var express = require('express');
var router = express.Router();
const Prestation = require('../models/prestations');
const { checkBody } = require('../modules/checkBody')





// Toute post: création de la tache

router.post('/', (req, res) => {
    if(!checkBody(req.body, ["start", "end", "status", "tache"])){
        res.json({result: false, error: "Missing or empty fields"});
        return;
    }

    const { start, end, status, tache } = req.body;

    const newPresta = new Prestation ({
        start,
        end,
        status,
        tache

    })

    newPresta.save()
    .then(data => 
    res.json({result: true, prestationList: data})
    )
})


// Route GET pour récupérer toutes les prestations
router.get('/', (req, res) => {
    Prestation.find()
        .then(prestations => {
            res.json({ result: true, prestationList: prestations });
        })
        .catch(err => {
            res.json({ result: false, error: err.message });
        });
});

// Route DELETE pour supprimer une prestation par ID
router.delete('/:id', (req, res) => {
    const prestationId = req.params.id;
    Prestation.findByIdAndDelete(prestationId)
        .then(() => {
            res.json({ result: true, message: 'Prestation deleted successfully' });
        })
        .catch(err => {
            res.json({ result: false, error: err.message });
        });
});

// Route PUT pour mettre à jour une prestation par ID
router.put('/:id', (req, res) => {
    const prestationId = req.params.id;
    if (!checkBody(req.body, ["start", "end", "status", "tache"])) {
        res.json({ result: false, error: "Missing or empty fields" });
        return;
    }

    const { start, end, status, tache } = req.body;

    Prestation.findByIdAndUpdate(prestationId, { start, end, status, tache }, { new: true })
        .then(updatedPresta => {
            res.json({ result: true, updatedPrestation: updatedPresta });
        })
        .catch(err => {
            res.json({ result: false, error: err.message });
        });
});


module.exports = router;
