const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use user ID + timestamp to ensure uniqueness
    const userId = req.user ? req.user.id : 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${userId}-${timestamp}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.pdf', '.docx', '.doc'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, and DOC are allowed.'));
  }
};

// Set up multer upload
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// @route   POST api/resume/upload
// @desc    Upload a resume
// @access  Private
router.post(
  '/upload', 
  authMiddleware, 
  upload.single('resume'), 
  resumeController.uploadResume
);

// @route   GET api/resume
// @desc    Get user's resume
// @access  Private
router.get('/', authMiddleware, resumeController.getResume);

module.exports = router;