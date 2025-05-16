const User = require("../models/User");
const Score = require("../models/Score");

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const currentUser = req.user ? await User.findById(req.user.id) : null;
    const currentEmail = currentUser ? currentUser.email : null;

    const leaderboardData = await Score.find()
      .sort({ score: -1 })
      .limit(100); // optional limit

    const leaderboard = await Promise.all(
      leaderboardData.map(async (entry, index) => {
        const user = await User.findOne({ email: entry.email });

        return {
          id: user ? user._id : "unknown",
          rank: index + 1,
          name: user ? user.name : entry.email.split("@")[0],
          score: entry.score,
          lastUpdated: entry.lastUpdated,
          isCurrentUser: entry.email === currentEmail,
          avatar:
            "https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg",
        };
      })
    );

    const userRank = currentEmail
      ? leaderboard.findIndex((entry) => entry.isCurrentUser) + 1
      : null;

    res.json({
      id: currentUser?._id || null,
      leaderboard,
      userRank: userRank || "Not ranked",
      lastUpdated: new Date().toISOString().split("T")[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Weekly score adjustment
const adjustWeeklyScores = async () => {
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  const now = new Date();

  try {
    const scores = await Score.find();

    for (const score of scores) {
      const lastUpdated = new Date(score.lastUpdated);
      const timeDiff = now - lastUpdated;

      if (timeDiff > ONE_WEEK) {
        const newScore = Math.round(score.score * 0.95);
        score.score = newScore;
        score.lastUpdated = now;
        await score.save();
      }
    }
  } catch (err) {
    console.error("Weekly score adjustment error:", err.message);
  }
};

module.exports = {
  getLeaderboard,
  adjustWeeklyScores,
};
