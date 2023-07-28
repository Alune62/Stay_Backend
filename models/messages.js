const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
Text: string,
//Username: ObjectId ==> User
createdAt: Date,
//Accommodation : ObjectId ==> accommodation
});

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;