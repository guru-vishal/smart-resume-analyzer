// Main application file
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();
connectDB();

// Import routes
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Resume Analysis API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;