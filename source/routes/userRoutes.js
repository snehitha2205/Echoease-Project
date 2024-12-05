const express = require('express');
const User = require('../models/user');  // Import the User model
const router = express.Router();

// GET route to retrieve all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users from the database
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// POST route to add a new user
// POST route to add a new user
router.post('/add', async (req, res) => {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Create and save the new user with plaintext password
        const newUser = new User({ username, password, role });
        await newUser.save();

        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add user' });
    }
});


// DELETE route to remove a user by username
router.delete('/remove/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOneAndDelete({ username });  // Find and delete user by username
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove user' });
  }
});

// Fetch user data by username (GET method)
router.get('/user/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Request body:', req.body); // Log the incoming request

        // Fetch the user from the database based on the username
        const user = await User.findOne({ username });
        console.log('User found:', user); // Log user data

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the password directly (no bcrypt)
        if (user.password !== password) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // If the password matches
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Error during login:', err.message || err);
        res.status(500).json({ error: err.message || 'Server error' });
    }
});


module.exports = router;
