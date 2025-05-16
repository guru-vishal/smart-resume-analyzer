const resumeParser = require("./resumeParser");

// Keywords that can increase score
const BONUS_KEYWORDS = [
  // Leadership
  "lead",
  "leader",
  "leadership",
  "managed",
  "manager",
  "management",
  "director",
  "supervisor",
  "head",
  "chief",
  "senior",
  "principal",

  // Achievement
  "achieved",
  "accomplishment",
  "award",
  "awarded",
  "honor",
  "honored",
  "recognition",
  "recognized",
  "success",
  "successful",
  "excelled",
  "exceeded",

  // Project management
  "delivered",
  "launched",
  "implemented",
  "developed",
  "created",
  "built",
  "designed",
  "architected",
  "planned",
  "coordinated",
  "spearheaded",

  // Communication
  "presented",
  "presentation",
  "communicate",
  "communication",
  "authored",
  "wrote",
  "documented",
  "published",
  "speaker",
  "spoke",

  // Technical excellence
  "optimized",
  "improved",
  "enhanced",
  "reduced",
  "increased",
  "decreased",
  "efficiency",
  "performance",
  "scalability",
  "reliability",
  "maintainability",

  // Education
  "phd",
  "master",
  "bachelor",
  "degree",
  "certification",
  "certified",
  "license",
  "licensed",
  "graduate",
  "graduated",
];

// Calculate resume score
const calculateScore = (resumeText, skills) => {
  const textLower = resumeText.toLowerCase();
  let score = 0;

  // 1. Skills score (max 50 points)
  const skillsScore = Math.min(skills.length * 3, 50);
  score += skillsScore;

  // 2. Experience score (max 25 points)
  const experience = resumeParser.extractExperience(resumeText);
  const yearsScore = Math.min(experience.yearsOfExperience * 2.5, 20);
  const jobTitlesScore = Math.min(experience.jobTitles.length * 2, 5);
  score += yearsScore + jobTitlesScore;

  // 3. Bonus keywords score (max 15 points)
  let bonusKeywordsCount = 0;
  const words = textLower.split(/\s+/);
  BONUS_KEYWORDS.forEach((keyword) => {
    if (words.includes(keyword.toLowerCase())) {
      bonusKeywordsCount++;
    }
  });
  const bonusScore = Math.min(bonusKeywordsCount, 15);
  score += bonusScore;

  // 4. Resume length and quality score (max 10 points)
  const wordCount = resumeText.split(/\s+/).length;
  const lengthScore = Math.min(wordCount / 100, 5); // 5 points for 500+ words

  // Check for email, phone, education section, etc.
  const hasContact = /email|phone|tel|contact/i.test(resumeText);
  const hasEducation = /education|university|college|degree|school/i.test(
    resumeText
  );
  const hasStructure =
    /experience|work|employment|project|skill|summary|objective/i.test(
      resumeText
    );

  const structureScore =
    (hasContact ? 2 : 0) + (hasEducation ? 1 : 0) + (hasStructure ? 2 : 0);
  score += lengthScore + structureScore;

  // Return rounded score
  return Math.round(score);
};

module.exports = {
  calculateScore,
};
