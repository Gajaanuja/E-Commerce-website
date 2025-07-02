require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const cors = require('cors');
const Product = require('./product-api/models/Product');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Public login route (simple mock login)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Dummy credentials — replace with real DB check in production
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, {
      expiresIn: '1h',
    });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// JWT middleware: protect all routes except /login
app.use(
  expressJwt({ secret: JWT_SECRET, algorithms: ['HS256'] }).unless({
    path: ['/login'],
  })
);

// Protected route: get products by status (published or not)
app.get('/api/products', async (req, res) => {
  const { status } = req.query;

  if (!['published', 'not published'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const products = await Product.find({ status }).limit(50);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

// Global error handler for JWT
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }
  next(err);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});