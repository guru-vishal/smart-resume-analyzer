const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const Score = require("../models/Score");

// Register a new user
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create JWT payload
    const payload = {
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user._id,
        email: user.email,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const score = await Score.findOne({ email: user.email });

    res.json({
      name: user.name,
      email: user.email,
      currentScore: score ? score.score : 0,
      lastUpload: score ? score.lastUpdated : null,
      progressData: [
        { date: "2025-01-14", score: 65 },
        { date: "2025-02-14", score: 59 },
        { date: "2025-03-14", score: 80 },
        { date: "2025-04-14", score: 81 },
        { date: new Date().toISOString().split("T")[0], score: score ? score.score : 0 },
      ],
      skills: score ? score.skills : [],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  signup,
  login,
  getProfile,
};
