const mongoose = require('mongoose');
const {Schema} = mongoose;

//Création du sous document
const userServicesSchema = new Schema({
    prestation: String,
    company: String,
    address: String,
    position: String
});

//Schéma principal
const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
    token: String,
    connectionMode: String,
    role: String,
    services: userServicesSchema, //Incorporation du sous document
});



const User = mongoose.model('users', userSchema);

module.exports = User