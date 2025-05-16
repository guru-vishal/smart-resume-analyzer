/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, Upload, Award, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const sampleData = [
  { date: new Date("2025-01-15").toISOString().split("T")[0], score: 65 },
  { date: new Date("2025-02-15").toISOString().split("T")[0], score: 59 },
  { date: new Date("2025-03-15").toISOString().split("T")[0], score: 80 },
  { date: new Date("2025-04-15").toISOString().split("T")[0], score: 81 },
];

const skillsData = [
  { name: "React", value: 85 },
  { name: "JavaScript", value: 78 },
  { name: "HTML/CSS", value: 90 },
  { name: "Node.js", value: 65 },
  { name: "Python", value: 72 },
];

function DashboardPage() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState({
    name: user?.name || "Guest",
    currentScore: 0,
    lastUpload: null,
    progressData: sampleData,
    skills: skillsData,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topPercent, setTopPercent] = useState('');
  const [leaderboardRank, setLeaderboardRank] = useState('-');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your dashboard.");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("api/auth/profile", {
          headers: {
            "x-auth-token": token,
          },
        });
        const data = response.data;
        const res = await axios.get("api/leaderboard", {
          headers: {
            "x-auth-token": token,
          },
        });
        setIsLoading(false);
        setLeaderboardRank(res.data.userRank);
        setTopPercent((res.data.userRank / res.data.leaderboard?.length) * 100);
        const topSkills = data.skills
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        setUserData({
          name: data.name || userData.name,
          currentScore: data.currentScore || 0,
          lastUpload: data.lastUpload || null,
          progressData: data.progressData || sampleData,
          skills: topSkills || skillsData,
        });
      } catch (error) {
        setError(error.response?.data?.message);
        toast.error(error.message);
      }
    };
    fetchUserData();
  }, [isAuthenticated, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700">
      {/* Header */}
      <div className="bg-white shadow dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {userData.name}! Here's an overview of your resume
            analytics.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-400">
                Current Score
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  userData.currentScore >= 80
                    ? "bg-green-100 text-green-800"
                    : userData.currentScore >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {userData.currentScore >= 90
                  ? "Outstanding"
                  : userData.currentScore >= 80
                  ? "Excellent"
                  : userData.currentScore >= 70
                  ? "Good"
                  : userData.currentScore >= 60
                  ? "Average"
                  : "Needs Improvement"}
              </span>
            </div>
            <div className="mt-2 flex items-baseline">
              <p className="text-5xl font-semibold text-gray-800 dark:text-white">
                {userData.currentScore ? userData.currentScore : '-'}
              </p>
              <p className="ml-2 text-sm font-medium text-gray-500">/ 100</p>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Your resume score is in the top {topPercent}% of all applicants.
            </p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-400">Last Upload</h2>
              <Upload className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {userData.lastUpload
                  ? new Date(userData.lastUpload).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No uploads yet"}
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate("/upload")}
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Upload new resume
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-400">
                Leaderboard Rank
              </h2>
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {'#'+leaderboardRank}
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate("/leaderboard")}
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View full leaderboard
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Progress Chart */}
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-900">
            <h2 className="text-lg font-medium text-gray-700 mb-4 dark:text-gray-400">
              Score Progress
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={userData.progressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/visualize")}
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View detailed analytics
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Top Skills Chart */}
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-900">
            <h2 className="text-lg font-medium text-gray-700 mb-4 dark:text-gray-400">
              Top Skills
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userData.skills}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickMargin={10}
                    width={100}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Proficiency" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/visualize")}
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all skills
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4 dark:text-gray-400">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/upload")}
              className="flex items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow hover:bg-gray-50"
            >
              <Upload className="mr-2 h-5 w-5 text-indigo-600" />
              <span className="font-medium text-gray-900 dark:text-gray-400">Upload Resume</span>
            </button>
            <button
              onClick={() => navigate("/visualize")}
              className="flex items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow hover:bg-gray-50"
            >
              <PieChart className="mr-2 h-5 w-5 text-indigo-600" />
              <span className="font-medium text-gray-900 dark:text-gray-400">
                Skill Visualization
              </span>
            </button>
            <button
              onClick={() => navigate("/leaderboard")}
              className="flex items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow hover:bg-gray-50"
            >
              <Award className="mr-2 h-5 w-5 text-indigo-600" />
              <span className="font-medium text-gray-900 dark:text-gray-400">Leaderboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
