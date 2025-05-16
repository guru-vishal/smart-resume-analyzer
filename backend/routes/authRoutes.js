const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/auth/signup
// @desc    Register a user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;