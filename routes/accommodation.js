var express = require('express');
var router = express.Router();
const Accommodation = require('../models/accommodations');
const User = require('../models/users');


////////// Préparation du checkBody ////////
// Utilisé dans les routes Post(Nouvel Hébergement), Put/Update(hébergement), Delete(hébergement)
const { checkBody } = require('../modules/checkBody')

////////// Préparation de l'accès à Cloudninary ////////
// Utilisé dans la route Post(Nouvel Hébergement), aurait pu servir dans la route Put/Update(hébergement)
const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');


///////////////////////////////////////////////////////////////////
////////// Route Post pour ajouter un nouvel hébergement //////////
///////////////////////////////////////////////////////////////////
// 1. Vérifie si les champs requis sont présents dans le corps de la requête.
// Si des champs manquent, renvoie une réponse d'erreur.
// 2. Si les champs sont présents, extrait les données du corps de la requête.
// 3. Recherche l'utilisateur propriétaire en utilisant le token fourni.
// Si l'utilisateur n'est pas trouvé, renvoie une réponse d'erreur.
// 4. Si l'utilisateur est trouvé, extrait son ID.
// 5. Crée un nouvel hébergement avec les données fournies.
// 6. Enregistre cette nouvelle instance d'hébergement dans la base de données.
// Si l'enregistrement est réussi, renvoie les données de l'hébergement en réponse.
// Si une erreur se produit lors de l'enregistrement, renvoie une réponse d'erreur.

router.post('/', (req, res) => {
  // 1. Vérification des champs requis dans le corps de la requête.
  console.log('req.body', req.body);
  console.log('req.files', req.files);

  // Vérification champ par champ pour identifier les erreurs.
  if (!checkBody(req.body, ["name"])) {
    // Si certains champs sont manquants ou vides, renvoyer une réponse d'erreur.
    res.json({ result: false, error: "Backend, CheckBody error : Missing or empty name" });
    return;
  }
  // if (!checkBody(req.body, ["picture"])) {
  //   // Si certains champs sont manquants ou vides, renvoyer une réponse d'erreur.
  //   res.json({ result: false, error: "Backend, CheckBody error : Missing or empty picture" });
  //   return;
  // }
  // if (!checkBody(req.body, ["address"])) {
  //   // Si certains champs sont manquants ou vides, renvoyer une réponse d'erreur.
  //   res.json({ result: false, error: "Backend, CheckBody error : Missing or empty address" });
  //   return;
  // }
  // if (!checkBody(req.body, ["description"])) {
  //   // Si certains champs sont manquants ou vides, renvoyer une réponse d'erreur.
  //   res.json({ result: false, error: "Backend, CheckBody error : Missing or empty description" });
  //   return;
  // }
  // if (!checkBody(req.body, ["price"])) {
  //   // Si certains champs sont manquants ou vides, renvoyer une réponse d'erreur.
  //   res.json({ result: false, error: "Backend, CheckBody error : Missing or empty price" });
  //   return;
  // }
  // if (!checkBody(req.body, ["distribution"])) {
  //   // Si certains champs sont manquants ou vides, renvoyer une réponse d'erreur.
  //   res.json({ result: false, error: "Backend, CheckBody error : Missing or empty distribution" });
  //   return;
  // }
  // if (!checkBody(req.body, ["ownerToken"])) {
  //   // Si certains champs sont manquants ou vides, renvoyer une réponse d'erreur.
  //   res.json({ result: false, error: "Backend, CheckBody error : Missing or empty ownerToken" });
  //   return;
  // }






  if (!checkBody(req.body, ["name", "address", "description", "price", "distribution", "ownerToken"])) {
    // Si certains champs sont manquants ou vides, renvoyer une réponse d'erreur.
    res.json({ result: false, error: "Backend, CheckBody error : Missing or empty fields" });
    return;
  }

  // 2. Extraction des données du corps de la requête.
  let { name, picture, address, description, price, distribution, ownerToken } = req.body;
  console.log('req.body : ', req.body);
  console.log('ownerToken : ', ownerToken);

  // 3. Recherche de l'utilisateur ayant le token du propriétaire.
  User.findOne({ token: ownerToken }).then(async (userData) => {
    console.log('userData : ', userData);
    if (!userData) {
      // Si l'utilisateur n'est pas trouvé, renvoyer une réponse d'erreur.
      res.json({ result: false, error: 'Owner not found in users' });
    } else {
      // 4. L'utilisateur propriétaire est trouvé, extraire son ID.
      let ownerId = userData._id;
      console.log('ownerId : ', ownerId, 'userData._id : ', userData._id);

      // 5. Enregistrement de la photo dans Cloudinary, récupération de l'uri.
      // A noter que si on reçoit le string "photo", ça veut dire que l'utilisateur n'en a pas ajouté. On envoit donc vers l'uri signifiant pas d'image.
      if (picture==='photo') {
        picture = 'https://media.istockphoto.com/id/1439407042/fr/vectoriel/pas-de-symbole-vectoriel-dimage-ic%C3%B4ne-disponible-manquante-pas-despace-r%C3%A9serv%C3%A9-de.jpg?s=612x612&w=0&k=20&c=NDbjCizbrjUwsy2699aFm4XjoxNPzZvCD3DSLj3vNVQ='
      } else {
        const photoPath = `./tmp/${uniqid()}.jpg`;
        const resultMove = await req.files.photoFromFront.mv(photoPath);

        if (!resultMove) {
          const resultCloudinary = await cloudinary.uploader.upload(photoPath);
          if (resultCloudinary.secure_url) {
            picture=resultCloudinary.secure_url;
          } else {
            picture = 'https://media.istockphoto.com/id/1439407042/fr/vectoriel/pas-de-symbole-vectoriel-dimage-ic%C3%B4ne-disponible-manquante-pas-despace-r%C3%A9serv%C3%A9-de.jpg?s=612x612&w=0&k=20&c=NDbjCizbrjUwsy2699aFm4XjoxNPzZvCD3DSLj3vNVQ='
          }
        } else {
          picture = 'https://media.istockphoto.com/id/1439407042/fr/vectoriel/pas-de-symbole-vectoriel-dimage-ic%C3%B4ne-disponible-manquante-pas-despace-r%C3%A9serv%C3%A9-de.jpg?s=612x612&w=0&k=20&c=NDbjCizbrjUwsy2699aFm4XjoxNPzZvCD3DSLj3vNVQ='
          //res.json({ result: false, error: resultMove });
        }

        fs.unlinkSync(photoPath);

        
      }

      // 5. Création d'une nouvelle instance d'hébergement avec les données fournies.
      const newAccommodation = new Accommodation({
        name,
        picture,
        address,
        description,
        price,
        distribution,
        owner: ownerId, // ici, en comparaison des lignes précédentes, on voit bien que dans la syntaxe new Object, si on garde les mêmes termes de variables que les keys dans le modèle, il n'y a pas besoin de les répéter.
      });
      console.log('New Accommodation en const : ', newAccommodation);

      // 6. Enregistrement de la nouvelle instance d'hébergement dans la base de données.
      newAccommodation.save()
        .then(data => {
          // Si l'enregistrement est réussi, renvoyer les données de l'hébergement en réponse.
          console.log('data du newAccommodation.save : ', data);
          res.json({ result: true, newAccommodation: data });
        })
        .catch(error => {
          // Si une erreur se produit lors de l'enregistrement, renvoyer une réponse d'erreur.
          console.error("Erreur lors de l'enregistrement de l'hébergement:", error);
          res.status(500).json({ result: false, error: "Une erreur est survenue lors de l'enregistrement de l'hébergement." });
        });
    }
  });
});


router.put('/update', function(req, res) {
  if(!checkBody(req.body, ["name", "picture", "address", "description", "price", "distribution", "owner"])){
    res.json({result: false, error: "Missing or empty fields"});
  }
  
  const { name, picture, address, description, price, owner } = req.body
  const updatedAccommodation = {
    name,
    picture,
    address,
    description,
    price,
    owner,
   };

   console.log(updatedAccommodation);

   Accommodation.updateOne({ _id: req.body._id }, updatedAccommodation).then((data) => {
    res.json({result: true, newAccommodations: data})
	});
});




router.get('/', function(req, res) {
  Accommodation.find({})
  .then(data=> {
     res.json({result: true, accommodationList : data})
  })
});

// router.get('/:owner', (req, res) => {
//   Accommodation.find({ owner: req.params.owner })
//   .then(data => {
//     if (data) {
//       res.json(data);
//     } else {
//       res.json({ result: false, error: 'User not found' });
//     }
//   });
// });

router.get('/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(userData => {
    if (!userData) {
      res.json({ result: false, error: 'Owner not found in users' });
    } else {
      Accommodation.find({ owner: userData._id })
      .then(accommodationData => {
        if (accommodationData) {
          res.json(accommodationData);
        } else {
          res.json({ result: false, error: 'User not found in accommodations' });
        }
      });
      //res.json({ result: true, canBookmark: data.canBookmark });
    }
  });



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
