import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { toast } from "react-toastify";
import { useAuth } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "https://smart-resume-analyzer-1u14.onrender.com/";

// COLORS for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
];

const ChartSelector = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor="chart-type"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Select Chart Type
      </label>
      <select
        id="chart-type"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 w-full md:w-64 text-white"
      >
        <option value="bar">Bar Chart (Top Skills)</option>
        <option value="pie">Pie Chart (Skills by Category)</option>
        <option value="radar">Radar Chart (Skills Levels)</option>
      </select>
    </div>
  );
};

const SkillBarChart = ({ data }) => {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
          <YAxis
            label={{ value: "Frequency", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Occurrences" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const SkillPieChart = ({ data }) => {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `Count: ${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const SkillRadarChart = ({ data }) => {
  // Transform skill levels for radar chart
  const radarData = data.map((item) => ({
    name: item.skill,
    value: item.value * 33, // Convert 1-3 scale to 0-100 scale
    level: item.level,
  }));

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip
            formatter={(value, name, props) => [
              `${props.payload.level} (${value}%)`,
              "Level",
            ]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LevelIndicator = ({ level }) => {
  const colors = {
    beginner: "bg-yellow-500",
    intermediate: "bg-blue-500",
    advanced: "bg-green-500",
  };

  const values = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };

  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${colors[level]} mr-2`}></div>
      <span className="capitalize text-white">{level}</span>
      <div className="ml-2 flex">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 mx-0.5 rounded-full ${
              i <= values[level] ? colors[level] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const SkillVisualizationPage = () => {
  const navigate = useNavigate();

  const [chartType, setChartType] = useState("bar");
  const [visualizationData, setVisualizationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeScore, setResumeScore] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your dashboard.");
      navigate("/login");
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 800);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/score", {
          headers: {
            "x-auth-token": token,
          },
        });
        const userScore = res.data.score;
        setResumeScore(userScore);

        const response = await axios.get("/api/score/visualize", {
          headers: {
            "x-auth-token": token,
          },
        });
        setVisualizationData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching visualization data:", err);
        setError("Failed to load skills data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!visualizationData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">
            No data available to visualize.
          </span>
        </div>
      </div>
    );
  }

  const { skillsByCategory, topSkills, skillLevels, totalSkills } =
    visualizationData;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-black">
        Skills Visualization
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <ChartSelector value={chartType} onChange={setChartType} />

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            {chartType === "bar" && "Top Skills (By Frequency)"}
            {chartType === "pie" && "Skills by Category"}
            {chartType === "radar" && "Skills Proficiency Levels"}
          </h2>

          {chartType === "bar" && <SkillBarChart data={topSkills} />}
          {chartType === "pie" && <SkillPieChart data={skillsByCategory} />}
          {chartType === "radar" && <SkillRadarChart data={skillLevels} />}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
            Key Insights
          </h3>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
            <li>
              Detected <strong>{totalSkills}</strong> unique skills in your
              resume
            </li>
            <li>
              Your most frequent skills are{" "}
              <strong>{topSkills[0]?.name}</strong> and{" "}
              <strong>{topSkills[1]?.name}</strong>
            </li>
            <li>
              Most skills are concentrated in the{" "}
              <strong>{skillsByCategory[0]?.name}</strong> category
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Resume Score
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Based on your resume analysis, we've calculated an overall score
            that reflects your skill diversity and presentation.
          </p>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400">
                {resumeScore}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Overall Score
              </span>
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${resumeScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Skill Level Distribution
          </h2>
          <div className="space-y-4">
            {["beginner", "intermediate", "advanced"].map((level) => {
              const count = skillLevels.filter(
                (skill) => skill.level === level
              ).length;
              const percentage =
                totalSkills > 0
                  ? Math.round((count / skillLevels.length) * 100)
                  : 0;

              return (
                <div key={level}>
                  <div className="flex justify-between mb-1">
                    <LevelIndicator level={level} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {count} skills ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        level === "beginner"
                          ? "bg-yellow-500"
                          : level === "intermediate"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-blue-700 dark:text-blue-300">
              Strengthen Your Profile
            </h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
              <li>
                Consider adding more context to your {skillLevels[0]?.skill}{" "}
                experience
              </li>
              <li>Highlight specific projects for your top skills</li>
              <li>Add measurable achievements for your most frequent skills</li>
            </ul>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-green-700 dark:text-green-300">
              Skills to Highlight
            </h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
              {topSkills.slice(0, 3).map((skill, index) => (
                <li key={index}>
                  {skill.name} (mentioned {skill.value} times)
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillVisualizationPage;
