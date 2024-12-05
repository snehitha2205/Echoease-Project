// routes/messages.js
const express = require('express');
const ContactMessage = require('../models/contact');
const router = express.Router();

// Get all received contact messages
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ timestamp: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;
