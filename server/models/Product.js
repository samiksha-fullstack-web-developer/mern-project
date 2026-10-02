// Import mongoose for schema and model creation
const mongoose = require('mongoose');

// Define review schema for product reviews
const reviewSchema = new mongoose.Schema({
  name: String,            // Reviewer's name
  email: String,           // Reviewer's email
  comment: String,         // Review content
  rating: Number,          // Review rating
  createdAt: {
    type: Date,
    default: Date.now,     // Timestamp for review
  },
});

// Define product schema
const productSchema = new mongoose.Schema({
  name: String,            // Product name
  description: String,     // Product description
  price: Number,           // Original price
  saleprice: Number,       // Discounted price
  image: String,           // Product image URL
  additionalInfo: String,  // Additional product details
  category: String,        // Product category
  tag: String,             // Product tag
  brand: String,           // Brand name
  reviews: [reviewSchema], // Array of customer reviews
}, { timestamps: true });  // Automatically manage createdAt & updatedAt


// Export the Product model
module.exports = mongoose.model('Product', productSchema);
