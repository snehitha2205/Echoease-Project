const express = require('express');
const router = express.Router();
const Reply = require('../models/replyModel');

// POST route to save a reply
router.post('/', async (req, res) => {
  const { messageId, username, replyText } = req.body;

  // Validate required fields
  if (!messageId || !username || !replyText) {
    return res.status(400).json({ error: 'Message ID, username, and reply text are required.' });
  }

  const newReply = new Reply({ messageId, username, replyText });

  try {
    await newReply.save();
    res.status(201).json({ message: 'Reply saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save reply' });
  }
});

// GET route to fetch replies based on messageId or username
router.get('/', async (req, res) => {
  const { messageId, username } = req.query;

  try {
    // Search replies based on messageId or username if provided
    const query = {};
    if (messageId) query.messageId = messageId;
    if (username) query.username = username;

    const replies = await Reply.find(query);
    res.status(200).json(replies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

// DELETE route to delete a reply by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedReply = await Reply.findByIdAndDelete(id);
      if (deletedReply) {
        res.status(200).json({ message: 'Reply deleted successfully' });
      } else {
        res.status(404).json({ error: 'Reply not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete reply' });
    }
  });
module.exports = router;
