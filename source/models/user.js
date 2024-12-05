const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs'); // For hashing passwords

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Enforce minimum password length
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Role can either be 'user' or 'admin'
      default: 'user',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Middleware to hash passwords before saving the user to the database


// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
