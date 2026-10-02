// Import Cloudinary storage engine for multer
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Import configured Cloudinary instance
const cloudinary = require('../utils/cloudinary');

// Import multer for handling multipart/form-data (file uploads)
const multer = require('multer');

// Define storage configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary, // Reference to cloudinary instance
  params: {
    folder: 'products', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Allowed file types
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Unique file name
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

// Export configured multer instance for use in routes
module.exports = upload;
