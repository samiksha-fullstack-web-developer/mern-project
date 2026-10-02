// Import mongoose to define schema
const mongoose = require('mongoose');

// Define the schema for User
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,      // Username is mandatory
    trim: true,          // Removes leading/trailing whitespace
  },
  email: {
    type: String,
    required: true,      // Email is required
    unique: true,        // Ensures no duplicate emails
    trim: true,          // Removes whitespace
    lowercase: true,     // Converts email to lowercase before saving
  },
  phone: String,         // Optional phone number

  role: {
    type: String,
    default: 'user',     // Default role is 'user'; cant be 'admin'
  },
  password: {
    type: String,
    required: true,      // Password is required
  },

  // Array of saved addresses
  addresses: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  ],

  // OTP for forgot password flow
  forget_password_otp: {
    type: String,
    default: null,
  },

  // Expiry time for the OTP
  forget_password_expiry: {
    type: String,
    default: null,
  }
});

// Create and export User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
