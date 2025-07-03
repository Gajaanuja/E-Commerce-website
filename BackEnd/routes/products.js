const express = require('express');
const router = express.Router();
const Product = require('../product-api/models/Product'); // Adjust the path if needed
const auth = require('../Middleware/auth'); // This must export a middleware function

// Create a product (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error saving product' });
  }
});

// Get 50 products (optionally filtered by published)
router.get('/', async (req, res) => {
  try {
    const published = req.query.published;
    const filter = published ? { published: published === 'true' } : {};
    const products = await Product.find(filter).limit(50);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

module.exports = router;
