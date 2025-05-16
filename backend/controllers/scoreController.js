const User = require("../models/User");
const Score = require("../models/Score");
const Resume = require("../models/Resume");
const chartDataGenerator = require("../utils/chartDataGenerator");
const resumeParser = require("../services/resumeParser");
const scoreCalculator = require("../services/scoreCalculator");

// Get user's score
const getUserScore = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const scoreData = await Score.findOne({ email: user.email });
    if (!scoreData) {
      return res.json({
        score: 0,
        skills: [],
        hasScore: false,
        message: "No resume uploaded yet",
      });
    }

    res.json({
      score: scoreData.score,
      skills: scoreData.skills,
      lastUpdated: scoreData.lastUpdated,
      hasScore: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get visualization data
const getVisualizationData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const scoreData = await Score.findOne({ email: user.email });
    if (!scoreData) return res.status(404).json({ msg: "No score data found" });

    const resume = await Resume.findOne({ email: user.email });
    if (!resume) return res.status(404).json({ msg: "No resume found" });

    const skillNames = [...new Set(scoreData.skills.map((s) => s.name))];

    const chartData = chartDataGenerator.generateChartData(
      resume.extractedText,
      skillNames
    );

    res.json(chartData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Trigger score recalculation
const updateScore = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const resume = await Resume.findOne({ email: user.email });
    if (!resume) return res.status(404).json({ msg: "No resume found" });

    const skills = resumeParser.extractSkills(resume.extractedText);
    const score = scoreCalculator.calculateScore(resume.extractedText, skills);

    await Score.findOneAndUpdate(
      { email: user.email },
      { score, skills, lastUpdated: new Date() },
      { upsert: true }
    );

    res.json({
      msg: "Score updated successfully",
      score,
      skillsFound: skills.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getUserScore,
  getVisualizationData,
  updateScore,
};
