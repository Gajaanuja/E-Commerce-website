const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../Middleware/auth.js');

// Place an order
router.post('/', auth, async (req, res) => {
  const { products, total } = req.body;
  const order = new Order({
    userId: req.user.id,
    products,
    total,
    status: 'pending'
  });
  await order.save();
  res.status(201).json(order);
});

// Get orders for user
router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

module.exports = router;
