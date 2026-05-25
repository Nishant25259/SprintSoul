const express = require('express');
const verifyToken = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// All admin routes require auth + admin role
router.use(verifyToken, adminOnly);

// GET /api/admin/orders — all orders (excluding 'cart' status)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'cart' } })
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/orders/:id — update order status
router.patch('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users — all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats — dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ status: { $ne: 'cart' } });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    res.json({ totalOrders, totalUsers, revenue, pendingOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
