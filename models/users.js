const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
    token: String,
    connectionMode: String,
    role: String
})

const User = mongoose.model('users', userSchema);

module.exports = User