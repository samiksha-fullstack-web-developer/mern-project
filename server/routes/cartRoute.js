// Import Express framework
const express = require('express');

// Import controller functions for cart operations
const {addToCart, getCart, updateCartItem, removeFromCart, clearCart} = require('../controllers/cartController');

// Create a new Express router instance
const router = express.Router();

// Route to get the user's cart
router.get('/', getCart);

// Route to add an item to the cart
router.post('/add', addToCart);

// Route to update quantity or details of a cart item
router.put('/update', updateCartItem);

// Route to remove a specific item from the cart
router.delete('/remove', removeFromCart);

// Route to clear all items from the cart
router.delete('/clear', clearCart);

// Export the router to use in other files
module.exports = router;
