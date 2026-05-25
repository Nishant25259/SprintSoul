const express = require('express');
const verifyToken = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

// In-memory cart stored per user in DB via a simple array on User, or we manage it here
// For simplicity we store the cart in the Order model with status 'cart'

const getCart = (userId) =>
  Order.findOne({ user: userId, status: 'cart' }).populate('items.product');

// GET /api/cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await getCart(req.user._id);
    res.json(cart || { items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart — add item
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Order.findOne({ user: req.user._id, status: 'cart' });
    if (!cart) {
      cart = new Order({ user: req.user._id, items: [], total: 0, status: 'cart' });
    }

    const existingItem = cart.items.find((i) => i.product.toString() === productId);
    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
      });
    }

    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/cart/:itemId — update qty
router.put('/:itemId', verifyToken, async (req, res) => {
  try {
    const { qty } = req.body;
    const cart = await Order.findOne({ user: req.user._id, status: 'cart' });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (qty <= 0) {
      item.deleteOne();
    } else {
      item.qty = qty;
    }

    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/:itemId — remove item
router.delete('/:itemId', verifyToken, async (req, res) => {
  try {
    const cart = await Order.findOne({ user: req.user._id, status: 'cart' });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart/checkout — place order
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const cart = await Order.findOne({ user: req.user._id, status: 'cart' });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    cart.status = 'pending';
    await cart.save();
    res.json({ message: 'Order placed successfully!', order: cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
