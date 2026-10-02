// Import mongoose for schema and model creation
const mongoose = require('mongoose');

// Define a sub-schema for individual items in the cart
const cartItemSchema = new mongoose.Schema({
  product: 
  { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }, // Reference to a Product document
  quantity: { 
    type: Number, 
    required: true, 
    default: 1 }, // Quantity of the product in the cart
});

// Define the main cart schema
const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    unique: true }, // Reference to the User, one cart per user
  items: [cartItemSchema], // Array of cart items using the sub-schema
});

// Export the Cart model
module.exports = mongoose.model('Cart', cartSchema);
