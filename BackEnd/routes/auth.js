// routes/auth.js

const router = require('express').Router();
const User = require('../models/User'); // Assuming you have a User model
const { verifyToken } = require('../Middleware/auth'); // <-- Import middleware

// ROUTE FOR LOGIN (DOES NOT NEED MIDDLEWARE)
router.post('/login', async (req, res) => {
    // ... your login logic here
});

// EXAMPLE PROTECTED ROUTE (USES MIDDLEWARE)
router.put('/:id', verifyToken, async (req, res) => {
    // Because of the verifyToken middleware, this code will only run
    // if the token is valid. The user info will be in req.user.
    // ... your update logic here
});


module.exports = router;