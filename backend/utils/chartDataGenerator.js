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
  "Full Stack": [
    "MERN Stack",      // MongoDB, Express, React, Node.js
    "MEAN Stack",      // MongoDB, Express, Angular, Node.js
    "LAMP Stack",      // Linux, Apache, MySQL, PHP/Python/Perl
    "Django + React",
    "Rails + React",
    "Next.js Full Stack",
    "Nuxt.js Full Stack",
    "Serverless Full Stack",
    "GraphQL Full Stack",
    "REST API Integration",
    "WebSockets",
    "OAuth / Authentication",
    "JWT",
    "API Development",
    "CI/CD for Full Stack",
    "Docker for Full Stack",
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
    "Data Science", "Neural Networks", "NLP", "Computer Vision", "Big Data", "Hadoop", "Spark",
    "Keras", "NLTK", "OpenCV",
  ],
  "Artificial Intelligence": [
    "Artificial Intelligence", "Generative AI", "Reinforcement Learning", "Transformers", "LLMs",
    "GPT", "BERT", "T5", "AutoML", "Explainable AI (XAI)", "AI Ethics", "AI Governance",
    "Prompt Engineering", "LangChain", "OpenAI API", "Hugging Face", "Fine-tuning", "Few-shot Learning",
    "AI Planning", "Expert Systems", "Fuzzy Logic", "Knowledge Graphs", "Multi-agent Systems",
    "Natural Language Understanding", "Cognitive Computing",
  ],
  "Data Analytics": [
    "Data Analysis", "Excel", "Google Sheets", "Power BI", "Tableau", "Looker", "Google Data Studio",
    "Data Wrangling", "Data Visualization", "Exploratory Data Analysis (EDA)", "Statistics",
    "SQL for Analytics", "Python for Analytics", "R for Analytics", "Pivot Tables", "DAX",
    "Time Series Analysis", "Data Cleaning", "Business Intelligence", "KPI Dashboards",
  ],
  Cybersecurity: [
  "Network Security", "Cryptography", "Ethical Hacking", "Penetration Testing",
  "Firewall", "VPN", "IDS/IPS", "Malware Analysis", "Security Auditing",
  "Risk Assessment", "Incident Response", "Security Policies", "Cyber Threat Intelligence",
  "Data Encryption", "Secure Coding", "Compliance", "IAM", "SIEM",
  "Zero Trust Architecture", "Cloud Security", "Security Automation", "SOAR",
  "Vulnerability Assessment", "Nessus", "OpenVAS", "Endpoint Security",
  "Digital Forensics", "MFA", "NIST", "ISO 27001", "Threat Hunting",
  "Security Awareness", "Privileged Access Management", "SAST", "DAST",
  "CWPP", "Container Security", "Aqua Security", "Twistlock", "Mobile Security"
],
  Blockchain: [
  "Blockchain", "Ethereum", "Smart Contracts", "Solidity", "Hyperledger",
  "DeFi", "NFT", "ICO", "DApps", "Consensus Algorithms", "Bitcoin",
  "Wallets", "Token Standards", "ERC20", "ERC721", "Gas Optimization",
  "IPFS", "Layer 2 Scaling", "Web3.js", "Ethers.js", "Truffle", "Hardhat",
  "Chainlink", "Cryptoeconomics", "Sidechains", "Proof of Stake",
  "Proof of Work", "Delegated Proof of Stake", "Solana", "Polkadot",
  "Cardano", "Interoperability", "Cosmos", "Filecoin", "Storj",
  "Security Auditing", "Mythril", "Slither", "Blockchain Explorers",
  "Etherscan", "Tokenomics", "Gas Fees", "Governance", "Wallet Development",
  "Metamask", "Trust Wallet", "Distributed Ledger Technology"
],
  "Game Development": [
    "Unity", "Unreal Engine", "Cocos2d", "Godot", "GameMaker", "CryEngine", "Phaser", "Pygame",
    "Blender", "3ds Max", "Maya", "Shader Programming", "OpenGL", "DirectX", "FMOD", "Photon Engine",
    "Mirror Networking", "PlayFab", "C#", "C++", "Level Design", "Game Physics",
  ],
  "AR/VR": [
    "AR", "VR", "Mixed Reality", "Unity XR", "AR Foundation", "Vuforia", "8thWall", "WebXR",
    "ARKit", "ARCore", "Oculus SDK", "OpenXR", "HoloLens", "Magic Leap", "Spatial Mapping",
    "Hand Tracking", "Gaze Input", "Passthrough", "XR Interaction Toolkit", "Scene Understanding",
  ],
  VLSI: [
    "VLSI Design", "Verilog", "VHDL", "SystemVerilog", "FPGA", "ASIC Design", "Cadence", "Synopsys",
    "RTL Design", "EDA Tools", "Synthesis", "Timing Analysis", "DFT", "Physical Design",
    "Floorplanning", "Layout Design", "Static Timing Analysis", "Low Power Design", "UVM", "SoC",
  ],
  "UI/UX": [
    "UI Design", "UX Design", "Figma", "Adobe XD", "Sketch", "Wireframing", "Prototyping",
    "Design Thinking", "User Research", "Information Architecture", "Heuristic Evaluation",
    "User Flows", "Personas", "Accessibility", "Color Theory", "Typography", "Usability Testing",
    "Responsive Design", "Interaction Design", "Human-Centered Design",
  ],
  IoT: [
    "Internet of Things", "IoT Protocols", "MQTT", "CoAP", "Zigbee", "LoRa", "NB-IoT", "Bluetooth LE",
    "WiFi", "Raspberry Pi", "Arduino", "ESP32", "ESP8266", "IoT Security", "Edge Computing",
    "IoT Analytics", "ThingSpeak", "AWS IoT", "Google Cloud IoT", "Azure IoT Hub", "Blynk",
    "Node-RED", "Embedded C", "Sensors", "Actuators", "RTOS", "Mbed OS",
  ],
  Networking: [
    "Computer Networks", "OSI Model", "TCP/IP", "IP Addressing", "Subnetting", "DNS", "DHCP", "Routing",
    "Switching", "NAT", "IPv4", "IPv6", "LAN", "WAN", "VLAN", "VPN", "Firewall", "Load Balancer",
    "QoS", "Network Monitoring", "Wireshark", "Traceroute", "Netstat", "Ping", "Cisco", "Juniper",
    "Network Troubleshooting", "Ethernet", "Wireless Networks", "Network Configuration", "SNMP",
  ],
  Deployment: [
    "CI/CD Pipelines",
    "Docker",
    "Kubernetes",
    "Helm",
    "Ansible",
    "Terraform",
    "AWS Elastic Beanstalk",
    "Azure App Service",
    "Google App Engine",
    "Netlify",
    "Vercel",
    "Heroku",
    "Firebase Hosting",
    "Cloud Run",
    "DigitalOcean",
    "Linode",
    "Apache HTTP Server",
    "Nginx",
    "Load Balancing",
    "Auto Scaling",
    "Serverless Deployment",
    "Monitoring & Logging",
    "Prometheus",
    "Grafana",
    "ELK Stack",
    "Docker Compose",
    "Istio",
    "OpenShift",
    "Version Control for Deployment",
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
