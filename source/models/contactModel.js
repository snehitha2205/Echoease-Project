const mongoose = require('mongoose');

// Define the schema for the contact form data
const contactSchema = new mongoose.Schema({
  username: {  // Added username
    type: String,
    required: true, // Username is required
  },
  name: {
    type: String,
    required: true, // Name is required
  },
  email: {
    type: String,
    required: true, // Email is required
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Basic email validation
  },
  message: {
    type: String,
    required: true, // Message is required
  },
  replies: [
    {  username: {  // Added username
        type: String,
        required: true, // Username is required
      },
      replyMessage: {
        type: String,
        required: true, // Reply message is required
      },
      replyDate: { 
        type: Date, 
        default: Date.now // Automatically set the date when the reply is created
      }
    }
  ]
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

// Create and export the model
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
