const express = require('express');
const router = express.Router();
const {getAllUsers, createUser, updateUser, deleteUser, getUserById} = require('../controllers/userControllers');

// Define routes for user operations
router.get('/', getAllUsers); // Get all users
router.post('/', createUser); // Create a new user
router.put('/:id', updateUser); // Update a user by ID
router.delete('/:id', deleteUser); // Delete a user by ID
router.get('/:id', getUserById); // Get a user by ID


module.exports = router;
// This code defines the user routes for the Express application.
// It imports the necessary modules, sets up the router, and defines the routes for user operations.
