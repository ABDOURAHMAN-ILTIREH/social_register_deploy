// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/usersController');

const { authenticateToken } = require("../middleware/authenticate");
const { authorizeAdmin } = require("../middleware/authenticate");

// Password routes
router.post('/forgot_password', userController.forgotPassword);
router.post('/reset_password', userController.resetPassword);

router.use(authenticateToken);
router.get('/getCurrentUser', userController.getCurrentUser);

router.use(authorizeAdmin);
router.get('/users', userController.getAllUsers);

// Routes pour les utilisateurs
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);


module.exports = router;