// Import mongoose for schema and model creation
const mongoose = require('mongoose');

// Define the order schema
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User collection
    required: true,
  },
  items: [
    {
      name: String, // Product name
      quantity: Number, // Number of units
      price: Number, // Price per unit
    },
  ],
  total: Number, // 💵 Total cost of the order
  paymentMethod: String, // Payment type (e.g., COD, Online)
  shipping: {
    firstName: String, // Shipping first name
    lastName: String,  // Shipping last name
    address: String,   // Street address
    city: String,      // City
    state: String,     // State
    zip: String,       // ZIP/Postal code
    country: String,   // Country
    email: String,     // Contact email
    phone: String,     // Contact number
  },
  status: {
    type: String,
    default: 'Pending', // Default order status
  },
  cancellationReason: {
    type: String,
    default: '' // Optional cancellation reason
  },
  date: {
    type: Date,
    default: Date.now, // Order timestamp
  },
});

// Create and export the Order model
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
