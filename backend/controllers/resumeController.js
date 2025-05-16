const Resume = require("../models/Resume");
const User = require("../models/User");
const Score = require("../models/Score");
const resumeParser = require("../services/resumeParser");
const scoreCalculator = require("../services/scoreCalculator");
const fs = require("fs");
const path = require("path");

// Upload resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const userEmail = req.user.email;
    const filePath = req.file.path;

    // Extract text from resume
    const extractedText = await resumeParser.parseResume(filePath);

    // Extract email from resume
    const emailFromResume = resumeParser.extractEmail(extractedText);

    // Optional strict email check
    // if (emailFromResume && emailFromResume !== userEmail) {
    //   fs.unlinkSync(filePath);
    //   return res.status(400).json({ msg: 'Email in resume does not match your account email' });
    // }

    // Upsert resume document by email
    const resumeDoc = await Resume.findOneAndUpdate(
      { email: userEmail },
      {
        filePath,
        extractedText,
        uploadDate: new Date(),
      },
      { upsert: true, new: true }
    );

    // Extract skills and calculate score
    const skills = resumeParser.extractSkills(extractedText);
    const scoreValue = scoreCalculator.calculateScore(extractedText, skills);

    // Update or create score document
    await Score.findOneAndUpdate(
      { email: userEmail },
      {
        score: scoreValue,
        skills,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    res.json({
      msg: "Resume uploaded successfully",
      score: scoreValue,
      skillsFound: skills.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get resume by user ID
const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const resume = await Resume.findOne({ email: user.email });
    if (!resume) {
      return res.status(404).json({ msg: "No resume found for this user" });
    }

    res.json({
      filePath: resume.filePath,
      uploadDate: resume.uploadDate,
      hasResume: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  uploadResume,
  getResume,
};
