// routes/items.js
const express = require('express');
const router = express.Router(); // Create a new router object

// Define a base collection path for user-specific data
const getUserCollectionPath = (appId, userId, collectionName) => {
    // For private data, use: `/artifacts/${appId}/users/${userId}/${collectionName}`
    return `artifacts/${appId}/users/${userId}/${collectionName}`;
};

// GET all items for the authenticated user
router.get('/items', async (req, res) => {
    const db = req.app.get('db'); // Get db instance from app settings
    const appId = req.app.get('appId'); // Get appId from app settings
    const userId = req.userId; // userId is set by the auth middleware

    const itemsCollectionRef = db.collection(getUserCollectionPath(appId, userId, 'items'));
    try {
        const snapshot = await itemsCollectionRef.get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(items);
    } catch (error) {
        console.error('Error getting items:', error);
        res.status(500).json({ error: 'Failed to retrieve items.' });
    }
});

// GET a single item by ID for the authenticated user
router.get('/items/:id', async (req, res) => {
    const db = req.app.get('db');
    const appId = req.app.get('appId');
    const userId = req.userId;
    const itemId = req.params.id;

    const itemDocRef = db.collection(getUserCollectionPath(appId, userId, 'items')).doc(itemId);
    try {
        const doc = await itemDocRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error getting item:', error);
        res.status(500).json({ error: 'Failed to retrieve item.' });
    }
});

// POST a new item for the authenticated user
router.post('/items', async (req, res) => {
    const db = req.app.get('db');
    const appId = req.app.get('appId');
    const userId = req.userId;
    const newItem = req.body; // Expecting { name: '...', description: '...' }

    if (!newItem || !newItem.name) {
        return res.status(400).json({ error: 'Item name is required.' });
    }

    const itemsCollectionRef = db.collection(getUserCollectionPath(appId, userId, 'items'));
    try {
        const docRef = await itemsCollectionRef.add({
            ...newItem,
            createdAt: new Date().toISOString() // Add a timestamp
        });
        res.status(201).json({ id: docRef.id, ...newItem, createdAt: new Date().toISOString() });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Failed to add item.' });
    }
});

// PUT (update) an existing item for the authenticated user
router.put('/items/:id', async (req, res) => {
    const db = req.app.get('db');
    const appId = req.app.get('appId');
    const userId = req.userId;
    const itemId = req.params.id;
    const updatedItem = req.body;

    const itemDocRef = db.collection(getUserCollectionPath(appId, userId, 'items')).doc(itemId);

    try {
        await itemDocRef.update({
            ...updatedItem,
            updatedAt: new Date().toISOString() // Add an update timestamp
        });
        res.status(200).json({ message: 'Item updated successfully.' });
    } catch (error) {
        console.error('Error updating item:', error);
        if (error.code === 5) { // NOT_FOUND
            return res.status(404).json({ error: 'Item not found for update.' });
        }
        res.status(500).json({ error: 'Failed to update item.' });
    }
});

// DELETE an item for the authenticated user
router.delete('/items/:id', async (req, res) => {
    const db = req.app.get('db');
    const appId = req.app.get('appId');
    const userId = req.userId;
    const itemId = req.params.id;

    const itemDocRef = db.collection(getUserCollectionPath(appId, userId, 'items')).doc(itemId);

    try {
        await itemDocRef.delete();
        res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (error) {
        console.error('Error deleting item:', error);
        if (error.code === 5) { // NOT_FOUND
            return res.status(404).json({ error: 'Item not found for deletion.' });
        }
        res.status(500).json({ error: 'Failed to delete item.' });
    }
});

module.exports = router;
