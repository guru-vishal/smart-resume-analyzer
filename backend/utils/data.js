// In-memory data store since we're not using a database
const inMemoryDB = {
  // Users collection
  users: [],
  
  // Resume data collection
  resumes: [],
  
  // Scores collection
  scores: [],
  
  // Leaderboard data (derived from scores)
  getLeaderboard: function() {
    return this.scores
      .map(score => {
        const user = this.users.find(u => u.email === score.email);
        return {
          email: score.email,
          name: user ? user.name : 'Anonymous',
          score: score.score,
          lastUpdated: score.lastUpdated
        };
      })
      .sort((a, b) => b.score - a.score);
  },
  
  // Find user by email
  findUserByEmail: function(email) {
    return this.users.find(user => user.email === email);
  },
  
  // Find user by ID
  findUserById: function(id) {
    return this.users.find(user => user.id === id);
  },
  
  // Find resume by email
  findResumeByEmail: function(email) {
    return this.resumes.find(resume => resume.email === email);
  },
  
  // Find score by email
  findScoreByEmail: function(email) {
    return this.scores.find(score => score.email === email);
  },
  
  // Update score (or add if not exists)
  updateScore: function(email, score, skills) {
    const existingScoreIndex = this.scores.findIndex(s => s.email === email);
    const newScoreData = {
      email,
      score,
      skills,
      lastUpdated: (new Date()).toISOString().split('T')[0]
    };
    
    if (existingScoreIndex >= 0) {
      this.scores[existingScoreIndex] = newScoreData;
    } else {
      this.scores.push(newScoreData);
    }
    
    return newScoreData;
  },
  
  // Update resume data
  updateResume: function(email, filePath, extractedText) {
    const existingResumeIndex = this.resumes.findIndex(r => r.email === email);
    const newResumeData = {
      email,
      filePath,
      extractedText,
      uploadDate: (new Date()).toISOString().split('T')[0]
    };
    
    if (existingResumeIndex >= 0) {
      this.resumes[existingResumeIndex] = newResumeData;
    } else {
      this.resumes.push(newResumeData);
    }
    
    return newResumeData;
  }
};

module.exports = inMemoryDB;