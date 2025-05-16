const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// List of technical skills to look for
const TECH_SKILLS = [
  // Programming Languages
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "Go",
  "Rust",
  "TypeScript",
  "Scala",
  "Perl",
  "Objective-C",
  "R",
  "Dart",
  "Elm",
  "Clojure",
  "Haskell",

  // Frontend
  "React",
  "Angular",
  "Vue",
  "Svelte",
  "jQuery",
  "Redux",
  "HTML",
  "CSS",
  "SASS",
  "LESS",
  "Bootstrap",
  "Tailwind",
  "Material UI",
  "Styled Components",
  "Webpack",
  "Babel",
  "JSX",
  "Next.js",
  "Gatsby",
  "Ember",

  // Backend
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring",
  "Laravel",
  "Ruby on Rails",
  "ASP.NET",
  "FastAPI",
  "Nest.js",
  "GraphQL",
  "REST API",
  "Microservices",
  "Serverless",

  // Database
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Oracle",
  "Redis",
  "Cassandra",
  "DynamoDB",
  "Firebase",
  "ElasticSearch",
  "SQLite",
  "MariaDB",
  "Neo4j",
  "Couchbase",

  // DevOps & Cloud
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "GitLab CI",
  "Travis CI",
  "CircleCI",
  "Terraform",
  "Ansible",
  "Puppet",
  "Chef",
  "Prometheus",
  "Grafana",
  "ELK Stack",
  "CI/CD",
  "Nginx",
  "Apache",

  // Mobile
  "Android",
  "iOS",
  "React Native",
  "Flutter",
  "Xamarin",
  "Ionic",
  "Swift",
  "Kotlin",

  // Data Science & ML
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Data Analysis",
  "Data Science",
  "Neural Networks",
  "NLP",
  "Computer Vision",
  "Big Data",
  "Hadoop",
  "Spark",
  "Keras",
  "NLTK",
  "OpenCV",

  // Testing
  "Unit Testing",
  "Integration Testing",
  "Jest",
  "Mocha",
  "Jasmine",
  "Pytest",
  "Selenium",
  "Cypress",
  "JUnit",
  "TestNG",
  "Enzyme",
  "Testing Library",

  // Version Control
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "SVN",

  // Project Management
  "Agile",
  "Scrum",
  "Kanban",
  "Jira",
  "Confluence",
  "Trello",
];

// Parse resume file and extract text
const parseResume = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (ext === ".docx" || ext === ".doc") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else {
      throw new Error("Unsupported file format");
    }
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw new Error("Failed to parse resume file");
  }
};

// Extract email from resume text
const extractEmail = (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : null;
};

// Extract skills from resume text
const extractSkills = (text) => {
  const skills = [];
  const textLower = text.toLowerCase();

  const words = text.toLowerCase().split(/\s+/);

  // Check for each skill in the text
  TECH_SKILLS.forEach((skill) => {
    const normalizedSkill = skill.toLowerCase();
    const matchCount = words.filter((word) => word === normalizedSkill).length;
    if (matchCount > 0) {
      skills.push({
        name: skill,
        value: matchCount,
      });
    }
  });

  return skills;
};

// Extract experience info (years, jobs)
const extractExperience = (text) => {
  // Basic experience regex patterns
  const yearsOfExpRegex =
    /(\d+)(?:\+)?\s*(?:years?|yrs?)(?:\s*of)?\s*experience/gi;
  const jobTitleRegex =
    /(software engineer|developer|architect|manager|lead|director|specialist|analyst|consultant|designer|administrator|devops|engineer)/gi;

  // Extract years of experience
  const yearsMatches = text.match(yearsOfExpRegex) || [];
  const years = yearsMatches.map((match) => {
    const num = match.match(/\d+/);
    return num ? parseInt(num[0], 10) : 0;
  });

  // Extract job titles
  const jobTitles = text.match(jobTitleRegex) || [];

  return {
    yearsOfExperience: years.length > 0 ? Math.max(...years) : 0,
    jobTitles: [...new Set(jobTitles.map((title) => title.trim()))],
  };
};

module.exports = {
  parseResume,
  extractEmail,
  extractSkills,
  extractExperience,
};
