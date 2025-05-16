const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/score
// @desc    Get user's score
// @access  Private
router.get('/', authMiddleware, scoreController.getUserScore);

// @route   GET api/score/visualize
// @desc    Get visualization data
// @access  Private
router.get('/visualize', authMiddleware, scoreController.getVisualizationData);

// @route   POST api/score/update
// @desc    Recalculate user score
// @access  Private
router.post('/update', authMiddleware, scoreController.updateScore);

module.exports = router;