// Import Express framework
const express = require('express');

// Import Product and Order models
const product = require('../models/Product');
const Order = require('../models/Order');

// Import controller functions related to product/shop actions
const {getFilteredProduct, getFilterOptions, getProductById, addReview, updateReview, deleteReview, getWishlistProducts} = require('../controllers/shoproductcontroller');

// Create a new router instance
const router = express.Router();

// Route: Search products by keyword (name, category, brand)
router.get('/search', async (req, res) => {
  const q = req.query.q?.toLowerCase(); // Get search query

  // If no query provided, return error
  if (!q) {
    return res.status(400).json({ success: false, message: 'Missing search query' });
  }

  try {
    // Find products matching the search criteria
    const products = await product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } }
      ]
    });

    // Return the matching products
    return res.json({ success: true, products });
  } catch (err) {
    // Handle server error
    return res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// Route: Get filter options for product listing
router.get('/filters/options', getFilterOptions);

// Route: Get products in the user's wishlist
router.get('/products/wishlist', getWishlistProducts);

// Route: Get filtered product list (e.g., by category, brand, etc.)
router.get('/', getFilteredProduct);

// Route: Get details of a product by its ID
router.get('/:id', getProductById);

// Route: Add a review to a specific product
router.post('/:id/reviews', addReview);

// Route: Update a specific review for a product
router.put('/:id/reviews/:reviewId', updateReview);

// Route: Delete a specific review from a product
router.delete('/:id/reviews/:reviewId', deleteReview);

// Route: Delete an order by ID
router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;

    // Delete the order with the given ID
    const deleted = await Order.findByIdAndDelete(orderId); 

    // If no order was found, send not found response
    if (!deleted)
      return res.status(404).json({ success: false, message: 'Order not found' });

    // If deletion successful, send confirmation
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    // Handle server error
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Export the router
module.exports = router;
