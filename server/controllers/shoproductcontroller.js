const mongoose = require("mongoose");
const Product = require("../models/Product");
// FILTERED PRODUCT CONTROLLER
exports.getFilteredProduct = async (req, res) => {
  try {
    const { category, brand, price, page = 1, limit = 9, sort } = req.query;
    const filter = {};

    // Parse and filter categories
    let categoryArray = [];
    if (Array.isArray(category)) categoryArray = category;
    else if (typeof category === "string") categoryArray = category.split(",");
    if (categoryArray.length > 0) {
      filter.category = {
        $in: categoryArray.map(cat => new RegExp(`^${cat}$`, 'i')), // case-insensitive match
      };
    }

    // Parse and filter brands
    let brandArray = [];
    if (Array.isArray(brand)) brandArray = brand;
    else if (typeof brand === "string") brandArray = brand.split(",");
    if (brandArray.length > 0) {
      filter.brand = {
        $in: brandArray.map(br => new RegExp(`^${br}$`, 'i')), // case-insensitive match
      };
    }

    // Filter by price (if provided)
    if (price !== undefined && price !== null && price > 0) {
      filter.price = { $lte: price };
    }
  

    // Sorting logic
    let sortOption = { createdAt: -1 }; // default
    if (sort === "low_high") sortOption = { price: 1 };
    else if (sort === "high_low") sortOption = { price: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    // Pagination setup
    const pageNumber = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 8;
    const skip = (pageNumber - 1) * pageLimit;

    // Count total filtered products
    const total = await Product.countDocuments(filter);

    // Fetch filtered products with pagination
    const products = await Product.find(filter)
      .limit(pageLimit)
      .skip(skip)
      .sort(sortOption);

    res.json({
      success: true,
      products,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageLimit),
    });

  } catch (error) {
    console.error("❌ Filter error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET FILTER OPTIONS (distinct categories & brands)
exports.getFilterOptions = async (req, res) => {
  try {
    // Get all unique categories and brands (excluding null/undefined)
    const categories = (await Product.distinct("category")).filter(Boolean);
    const brands = (await Product.distinct("brand")).filter(Boolean);

    res.status(200).json({ success: true, categories, brands });
  } catch (err) {
    console.error("Error fetching filters:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  // Check for valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("Error getting product by ID:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ADD PRODUCT REVIEW
exports.addReview = async (req, res) => {
  try {
    const { name, email, comment, rating } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Construct review object
    const review = {
      name,
      email,
      comment,
      rating: Number(rating),
      createdAt: new Date(),
    };

    // Append review and save
    product.reviews.push(review);
    await product.save();

    res.status(201).json({ success: true, message: "Review submitted successfully" });

  } catch (err) {
    console.error("Review submit error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// UPDATE REVIEW
exports.updateReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Update review fields
    review.name = req.body.name;
    review.email = req.body.email;
    review.comment = req.body.comment;
    review.rating = Number(req.body.rating);

    await product.save();

    res.json({ success: true, message: "Review updated" });
  } catch (err) {
    console.error("Update review error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE REVIEW
exports.deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // Remove review by ID
    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );

    await product.save();

    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET WISHLIST PRODUCTS BY IDS
exports.getWishlistProducts = async (req, res) => {
  try {
    // Split and validate product IDs
    const wishlistProductIds = req.query.ids?.split(",") || [];
    const validIds = wishlistProductIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

    // Fetch products by valid IDs
    const products = await Product.find({
      _id: { $in: validIds }
    });

    res.json({ success: true, products });
  } catch (err) {
    console.error("Error fetching wishlist Product:", err);
    res.status(500).json({ success: false, error: "Failed to fetch wishlist Product" });
  }
};
