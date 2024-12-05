const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');

// GET route to fetch all contact messages
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().lean();  // Fetch all contact messages
    res.status(200).json(contacts); // Return contact messages
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST route to handle adding a new contact form submission
router.post('/', async (req, res) => {
  const { username, name, email, message } = req.body;

  // Validate input
  if (!username || !name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Create a new Contact document
  const newContact = new Contact({
    username,
    name,
    email,
    message
  });

  try {
    await newContact.save(); // Save the new contact form submission to the database
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
