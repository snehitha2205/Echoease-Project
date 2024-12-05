const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  messageId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact', 
    required: true 
  },
  username: {
    type: String, 
    required: true
  },
  replyText: {
    type: String, 
    required: true
  },
  repliedAt: {
    type: Date, 
    default: Date.now
  }
});

const Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;
