// routes/userRoute.js
const express = require('express');
const User = require('../models/Users');
const router = express.Router();

// routes/userRoute.js
router.get('/me', async (req, res) => {
  try {    
    if (!req.session?.user?._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const user = await User.findById(req.session.user._id).select('-password'); // exclude password

    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Failed to fetch user profile:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Middleware: ensure user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session?.user?._id) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

// POST /api/users/address
router.post('/address', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id); // ✅ use session
    user.addresses.push(req.body);
    await user.save();
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Update an address
router.put('/address/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id); // ✅ use session
    const index = user.addresses.findIndex(a => a._id.toString() === req.params.id);
    if (index !== -1) {
      user.addresses[index] = req.body;
    }
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// DELETE /api/user/address/:id
router.delete('/address/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const addressId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove address by ID from array
    user.addresses.pull(addressId);

    await user.save();

    res.json({ success: true, message: 'Address deleted', user });
  } catch (err) {
    console.error('❌ Error deleting address:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
