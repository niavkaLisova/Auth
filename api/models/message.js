var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var messageSchema = Schema({
  roomID: {
    type: ObjectId,
    ref: 'Room',
  },
  text: String,
  author: String,
  user: Object,
  read: { 
  	type: Boolean,
  	default: false
  },
  random: String,
  time: Date
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
