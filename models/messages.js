const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
Text: String,
username: { type: mongoose.Schema.Types.name, ref: 'username' },
createdAt: Date,
accommodation: { type: mongoose.Schema.Types.name, ref: 'accomodation' }
});

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;