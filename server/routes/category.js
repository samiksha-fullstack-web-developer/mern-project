const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const multer = require('multer');

// Image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/categories'),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Add new category
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const image = req.file ? req.file.filename : null;

    const category = new Category({
      name,
      image,
      subcategories: JSON.parse(subcategories), // send as JSON string from frontend
    });

    await category.save();
    res.json({ success: true, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to add category' });
  }
});

// Get all categories
router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
