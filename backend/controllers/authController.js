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

    console.log(hashedPassword);

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
  console.log(password);

  if (!email || !password) {
    return res.status(400).send("Fields Missing");
  }

  console.log(email);

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    console.log(user)
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

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return res.status(500).json({ msg: "Server configuration error" });
    }

    // Sign token
    jwt.sign(
      payload,
      secret,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.log("error");
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
        {
          date: new Date().toISOString().split("T")[0],
          score: score ? score.score : 0,
        },
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
