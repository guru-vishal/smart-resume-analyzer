// Utility to generate visualization data for frontend charts

// Group skills by category
const skillCategories = {
  "Programming Languages": [
    "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust",
    "TypeScript", "Scala", "Perl", "Objective-C", "R", "Dart", "Elm", "Clojure", "Haskell",
  ],
  Frontend: [
    "React", "Angular", "Vue", "Svelte", "jQuery", "Redux", "HTML", "CSS", "SASS", "LESS",
    "Bootstrap", "Tailwind", "Material UI", "Styled Components", "Webpack", "Babel", "JSX",
    "Next.js", "Gatsby", "Ember",
  ],
  Backend: [
    "Node.js", "Express", "Django", "Flask", "Spring", "Laravel", "Ruby on Rails", "ASP.NET",
    "FastAPI", "Nest.js", "GraphQL", "REST API", "Microservices", "Serverless",
  ],
  Database: [
    "SQL", "MongoDB", "PostgreSQL", "MySQL", "Oracle", "Redis", "Cassandra", "DynamoDB", "Firebase",
    "ElasticSearch", "SQLite", "MariaDB", "Neo4j", "Couchbase",
  ],
  "DevOps & Cloud": [
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "GitLab CI", "Travis CI",
    "CircleCI", "Terraform", "Ansible", "Puppet", "Chef", "Prometheus", "Grafana", "ELK Stack",
    "CI/CD", "Nginx", "Apache",
  ],
  Mobile: [
    "Android", "iOS", "React Native", "Flutter", "Xamarin", "Ionic", "Swift", "Kotlin",
  ],
  "Data Science & ML": [
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
    "Data Analysis", "Data Science", "Neural Networks", "NLP", "Computer Vision", "Big Data",
    "Hadoop", "Spark", "Keras", "NLTK", "OpenCV",
  ],
  Testing: [
    "Unit Testing", "Integration Testing", "Jest", "Mocha", "Jasmine", "Pytest", "Selenium",
    "Cypress", "JUnit", "TestNG", "Enzyme", "Testing Library",
  ],
  Other: [
    "Git", "GitHub", "GitLab", "Bitbucket", "SVN", "Agile", "Scrum", "Kanban", "Jira",
    "Confluence", "Trello",
  ],
};

// Generate chart data based on resume text and skills
const generateChartData = (resumeText, skills) => {
  // 1. Skills by category for pie chart
  const skillsByCategory = {};
  Object.keys(skillCategories).forEach((category) => {
    skillsByCategory[category] = 0;
  });

  skills.forEach((skill) => {
    let category = "Other";
    for (const [cat, catSkills] of Object.entries(skillCategories)) {
      if (catSkills.includes(skill)) {
        category = cat;
        break;
      }
    }
    skillsByCategory[category]++;
  });

  const pieChartData = Object.entries(skillsByCategory)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => ({
      name: category,
      value: count,
    }));

  // 2. Top skills for bar chart (frequency based)
  const words = resumeText.toLowerCase().match(/\b\w+\b/g) || [];
  const wordCounts = {};
  words.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  const skillFrequency = {};
  skills.forEach((skill) => {
    const count = wordCounts[skill.toLowerCase()] || 0;
    skillFrequency[skill] = count;
  });

  const topSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({
      name: skill,
      value: count,
    }));

  // 3. Skill level estimation based on context
  const levelRegexPatterns = [
    {
      level: "advanced",
      patterns: [
        /advanced\s+([a-zA-Z#+]+)\b/g,
        /\b([a-zA-Z#+]+)\s*\(advanced\)/gi,
      ],
    },
    {
      level: "intermediate",
      patterns: [
        /intermediate\s+([a-zA-Z#+]+)\b/g,
        /\b([a-zA-Z#+]+)\s*\(intermediate\)/gi,
      ],
    },
    {
      level: "beginner",
      patterns: [
        /beginner\s+in\s+([a-zA-Z#+]+)\b/g,
        /beginner\s+([a-zA-Z#+]+)\b/g,
        /\b([a-zA-Z#+]+)\s*\(beginner\)/gi,
      ],
    },
  ];

  const foundLevels = {};
  const resumeLower = resumeText.toLowerCase();

  levelRegexPatterns.forEach(({ level, patterns }) => {
    patterns.forEach((regex) => {
      for (const match of resumeLower.matchAll(regex)) {
        const skillName = match[1].trim().replace(/[^a-zA-Z#+]/g, "");
        if (skills.map(s => s.toLowerCase()).includes(skillName.toLowerCase())) {
          foundLevels[skillName.toLowerCase()] = level;
        }
      }
    });
  });

  const skillLevels = [];
  skills.slice(0, 8).forEach((skill) => {
    const skillLower = skill.toLowerCase();
    const detectedLevel = foundLevels[skillLower];
    let level = "beginner"; // Default

    if (detectedLevel === "intermediate") level = "intermediate";
    else if (detectedLevel === "advanced") level = "advanced";

    skillLevels.push({
      skill,
      level,
      value: level === "beginner" ? 1 : level === "intermediate" ? 2 : 3,
    });
  });

  return {
    skillsByCategory: pieChartData,
    topSkills,
    skillLevels,
    totalSkills: skills.length,
  };
};

module.exports = {
  generateChartData,
};
