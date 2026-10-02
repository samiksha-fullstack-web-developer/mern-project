const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/Users');
const Product = require('../models/Product'); 

// Middleware
const requireAuth = (req, res, next) => {
  if (!req.session?.user?._id) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

// Place a New Order
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items, total, paymentMethod, shipping } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const newOrder = new Order({
      user: req.session.user._id,
      items,
      total,
      paymentMethod,
      shipping,
      status: 'Pending',
    });

    await newOrder.save();

    // Save address to user if new
    const user = await User.findById(req.session.user._id);
    if (user) {
      user.email = shipping.email || user.email;
      user.phone = shipping.phone || user.phone;

      const newAddress = {
        street: shipping.address,
        city: shipping.city,
        state: shipping.state,
        zip: shipping.zip,
        country: shipping.country,
      };

      const exists = user.addresses.some(addr =>
        addr.street === newAddress.street &&
        addr.city === newAddress.city &&
        addr.zip === newAddress.zip
      );

      if (!exists) {
        user.addresses.push(newAddress);
      }

      await user.save();
    }

    res.status(201).json({ success: true, message: 'Order placed successfully' });
  } catch (err) {
    console.error('❌ Order creation failed:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get User's Orders
router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.user._id }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error('❌ Fetch user orders error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// =====================
//  Admin: Get All Orders
// =====================

const requireAdmin = (req, res, next) => {
  if (!req.session?.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
  }
  next();
};
//  Dashboard Summary
router.get('/summary', requireAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();

    const recentOrders = await Order.find()
      .sort({ date: -1 })
      .limit(5)
      .populate('user', 'username');

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        cancelledOrders,
        totalUsers,
        totalProducts,
        recentOrders,
      }
    });
  } catch (err) {
    console.error('❌ Admin summary fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error('❌ Admin fetch orders failed:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//  Admin: Cancel Order (with reason)
router.put('/admin/:id/cancel', requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (['Cancelled', 'Delivered'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
    }
    order.status = 'Cancelled';
    order.cancellationReason = reason || 'Cancelled by admin';
    await order.save();

    res.json({ success: true, message: 'Order cancelled by admin', order });
  } catch (err) {
    console.error('❌ Cancel order failed:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: Update Status (without cancel reason)
router.put('/admin/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ success: true, message: 'Order status updated', order });
  } catch (err) {
    console.error('❌ Status update failed:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/orders/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    console.error("❌ Order delete error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
