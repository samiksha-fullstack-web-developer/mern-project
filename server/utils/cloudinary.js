// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;

  cloudinary.config({ 
        cloud_name: 'dtntpogoh', 
        api_key: '985691991212818', 
        api_secret: 'U9rEkPAWxUuNY-Ah0v2jqhfPIgs' 
    });


module.exports = cloudinary;
