require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const contactRoutes = require('./src/routes/contact');
const replyRoutes = require('./src/routes/reply');
const feedbackRoutes = require('./src/routes/feedback'); // Adjust the path if needed
const userRoutes = require('./src/routes/userRoutes'); // Import user routes
const applianceStatusRoutes = require('./src/routes/appliance');
const app = express();

// Validate environment variables
const REQUIRED_ENV_VARS = ['MONGO_URI', 'PORT'];
REQUIRED_ENV_VARS.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Environment variable ${key} is missing. Please add it to your .env file.`);
    process.exit(1); // Exit if any required environment variable is missing
  }
});

const { MONGO_URI, PORT } = process.env;

// Enable CORS (allowing all origins for now, adjust as needed)
app.use(cors({
  origin: '*', // Allow all origins (restrict in production if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow common methods
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies or authorization headers if needed
}));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/reply', replyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/appliance-status', applianceStatusRoutes);
// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit on database connection failure
  }
};

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Default error handler
app.use((err, req, res, next) => {
  console.error('Unexpected server error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});


app.post('/updateStatusPost', (req, res) => {
  const { id, status } = req.body;

  // Validate input
  if (!id || !status) {
      return res.status(400).json({ message: 'Both id and status are required.' });
  }

  // Here you can perform any operations like saving to the database
  console.log(`Received ID: ${id}, Status: ${status}`);

  // Respond to the client
  res.status(201).json({
      message: 'Post created successfully!',
      data: { id, status }
  });
});





// Start the server
const startServer = async () => {
  await connectToDatabase(); // Ensure DB is connected before starting server

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
};

// Run the server
startServer();
