const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/leaderboard
// @desc    Get leaderboard
// @access  Private
router.get('/', authMiddleware, leaderboardController.getLeaderboard);

module.exports = router;