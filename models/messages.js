const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
text: String,
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
createdAt: Date,
accommodation: { type: mongoose.Schema.Types.ObjectId, ref: 'accommodations' }
});

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;