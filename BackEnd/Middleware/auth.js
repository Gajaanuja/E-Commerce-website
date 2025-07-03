// middleware/auth.js

// This middleware authenticates the user by verifying Firebase ID tokens
const authMiddleware = async (req, res, next) => {
    const auth = req.app.get('auth'); // Get Firebase Auth Admin SDK instance from app settings

    // Get the ID token from the Authorization header
    // Expected format: "Bearer <ID_TOKEN>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('Authentication failed: No Bearer token provided or invalid format.');
        return res.status(401).json({ error: 'Unauthorized: No token provided or invalid format.' });
    }

    const idToken = authHeader.split(' ')[1]; // Extract the ID token

    try {
        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await auth.verifyIdToken(idToken);

        // The token is valid. Extract the user ID (uid)
        req.userId = decodedToken.uid;
        console.log(`User authenticated: ${req.userId}`);

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Token verification failed (e.g., token expired, invalid, revoked)
        console.error('Error verifying Firebase ID token:', error.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
