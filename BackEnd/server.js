// server.js

// 1. Load environment variables from .env file (MUST be at the very top)
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// Import routes and middleware
const authMiddleware = require('./Middleware/auth');
const itemsRoutes = require('./routes/items');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000; // Use PORT from .env, default to 3000

// Middleware to parse JSON request bodies
app.use(express.json());

// Configure CORS to allow requests from your Angular frontend
// Replace 'http://localhost:4200' with the actual URL of your Angular app in production
app.use(cors({
    origin: 'http://localhost:4200', // Allow requests from your Angular development server
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// --- Firebase Admin SDK Initialization ---
// Global variables provided by the Canvas environment (if running in Canvas)
// These will be undefined when running locally, and that's okay because we use process.env
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let db;
let auth;

// Function to initialize Firebase Admin SDK
async function initializeFirebaseAdmin() {
    if (!getApps().length) {
        let serviceAccount;

        // Prioritize Canvas environment config if available
        if (typeof __firebase_config !== 'undefined') {
            const firebaseConfig = JSON.parse(__firebase_config);
            if (firebaseConfig && firebaseConfig.serviceAccountKey) {
                serviceAccount = firebaseConfig.serviceAccountKey;
                console.log('Using Firebase service account key from Canvas environment.');
            } else {
                console.error('Firebase configuration or serviceAccountKey not found in Canvas environment. Cannot initialize Firebase Admin SDK.');
                process.exit(1);
            }
        } else {
            // Running locally or in other environments: Load from environment variable
            const serviceAccountKeyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

            if (serviceAccountKeyJson) {
                try {
                    // Parse the JSON string from the environment variable
                    serviceAccount = JSON.parse(serviceAccountKeyJson);
                    console.log('Using Firebase service account key from environment variable.');
                } catch (error) {
                    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY environment variable. Ensure it is valid JSON:', error);
                    process.exit(1);
                }
            } else {
                console.error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable not found.');
                console.error('Please set this environment variable with the JSON content of your Firebase service account key in your .env file.');
                process.exit(1);
            }
        }

        if (serviceAccount) {
            try {
                // Initialize Firebase Admin SDK with the service account key
                initializeApp({
                    credential: cert(serviceAccount)
                });
                console.log('Firebase Admin SDK initialized successfully.');
                db = getFirestore();
                auth = getAuth();
            } catch (error) {
                console.error('Error initializing Firebase Admin SDK:', error);
                process.exit(1);
            }
        } else {
            console.error('No service account key found. Cannot initialize Firebase Admin SDK.');
            process.exit(1);
        }
    } else {
        db = getFirestore();
        auth = getAuth();
    }
}

// Call the initialization function and then set up routes
initializeFirebaseAdmin().then(() => {
    // Make db and auth available to routes and middleware
    app.set('db', db);
    app.set('auth', auth);
    app.set('appId', appId);
    app.set('initialAuthToken', initialAuthToken); // Pass initialAuthToken for middleware usage

    // Apply authentication middleware globally or to specific routes
    app.use(authMiddleware); // This middleware will set req.userId

    // Use item routes
    app.use('/api', itemsRoutes); // All item routes will be prefixed with /api

    // Start the server
    app.listen(port, () => {
        console.log(`Backend server listening at http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Failed to start server due to Firebase initialization error:', error);
});
