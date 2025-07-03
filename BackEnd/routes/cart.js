const express = require('express');
const router = express.Router();
const Cart = require('../product-api/models/Cart');
const Product = require('../product-api/models/Product'); // Assuming you have a Product model for validation
const { verifyToken } = require('../Middleware/auth'); // Corrected to use verifyToken

/**
 * @route   POST /api/cart
 * @desc    Add an item to the cart or update its quantity
 * @access  Private
 */
router.post('/', verifyToken, async (req, res) => { // Corrected to use verifyToken
  // Destructure with a default for quantity
  const { productId, quantity = 1 } = req.body;

  // --- Input Validation ---
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive integer.' });
  }

  try {
    // Check if the product actually exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
        return res.status(404).json({ message: 'Product not found.' });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId: req.user.id });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if the item already exists in the cart
    // Use .equals() for reliable MongoDB ObjectId comparison
    const existingItem = cart.items.find(item => item.productId.equals(productId));

    if (existingItem) {
      // If item exists, update its quantity
      existingItem.quantity += quantity;
    } else {
      // If item doesn't exist, add it to the cart
      cart.items.push({ productId, quantity });
    }

    // Save the cart and populate product details for the response
    await cart.save();
    const populatedCart = await cart.populate('items.productId', 'name price imageUrl');
    
    res.status(200).json(populatedCart);

  } catch (err) {
    console.error('Cart Error:', err.message);
    res.status(500).json({ message: 'Server error while processing your request.' });
  }
});

/**
 * @route   GET /api/cart
 * @desc    Get the user's cart with product details
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => { // Corrected to use verifyToken
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
                           // Populate product details for each item in the cart
                           .populate('items.productId', 'name price imageUrl'); 

    if (!cart) {
      // If user has no cart yet, return an empty one
      return res.status(200).json({ userId: req.user.id, items: [], totalPrice: 0 });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error('Cart Error:', err.message);
    res.status(500).json({ message: 'Server error while retrieving cart.' });
  }
});

/**
 * @route   PUT /api/cart/:productId
 * @desc    Update the quantity of a specific item in the cart
 * @access  Private
 */
router.put('/:productId', verifyToken, async (req, res) => { // Corrected to use verifyToken
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive integer.' });
    }

    try {
        const cart = await Cart.findOneAndUpdate(
            // Find the cart by userId and the specific item by productId
            { "userId": req.user.id, "items.productId": productId },
            // Set the new quantity for the matched item
            { "$set": { "items.$.quantity": quantity } },
            // Return the updated document
            { new: true }
        ).populate('items.productId', 'name price imageUrl');

        if (!cart) {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }

        res.status(200).json(cart);
    } catch (err) {
        console.error('Cart Error:', err.message);
        res.status(500).json({ message: 'Server error while updating item quantity.' });
    }
});


/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove a specific item from the cart
 * @access  Private
 */
router.delete('/:productId', verifyToken, async (req, res) => { // Corrected to use verifyToken
    const { productId } = req.params;

    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.user.id },
            // Use $pull to remove the item object from the items array
            { $pull: { items: { productId: productId } } },
            { new: true }
        ).populate('items.productId', 'name price imageUrl');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found or item already removed.' });
        }

        res.status(200).json(cart);
    } catch (err) {
        console.error('Cart Error:', err.message);
        res.status(500).json({ message: 'Server error while removing item from cart.' });
    }
});


module.exports = router;