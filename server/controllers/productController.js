const Product = require('../models/Product');

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    console.log( "File received in req.file:", req.file);

    // 🔍 Check if image file is uploaded
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Image upload failed. No file or path received.",
        file: req.file,
      });
    }

    // Get Cloudinary or local image URL
    const imageUrl = req.file?.secure_url || req.file?.path;
    console.log("Cloudinary Image URL:", imageUrl);

    // Create new product instance
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      saleprice: req.body.saleprice,
      image: imageUrl,  // 📸 Product image
      additionalInfo: req.body.additionalInfo,
      category: req.body.category,
      tag: req.body.tag,
      brand: req.body.brand,
    });

    // Save product to database
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added",
      product,
    });

  } catch (error) {
    console.error("❌ FULL SERVER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Server error",
      error: error.message || "Unknown error",
    });
  }
};

// Get all products (with pagination)
exports.getAllProducts = async (req, res) => {
  try {
    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    // Fetch products from DB
    const products = await Product.find({})
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({});

    return res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ success: false, message: "❌ Server error" });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = {...req.body, };

    // Clean up empty or "null" strings
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "null" || updateData[key] === "") {
        updateData[key] = null;
      }
    });

    // Convert numeric fields properly
    const numberFields = ["price", "saleprice", "quantity"];
    numberFields.forEach((field) => {
      if (updateData[field] !== null && updateData[field] !== undefined) {
        const value = Number(updateData[field]);
        updateData[field] = isNaN(value) ? null : value;
      }
    });

    // Update image if a new one is uploaded
    if (req.file) {
      updateData.image = req.file.path.startsWith("http")
        ? req.file.path
        : req.file.secure_url;
    }

    // Update product in database
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(200).json({ success: true, product: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
