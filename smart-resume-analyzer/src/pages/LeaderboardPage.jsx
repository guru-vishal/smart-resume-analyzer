/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const LeaderboardPage = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [filter, setFilter] = useState("all");
  // const [timeRange, setTimeRange] = useState("week");
  const [currentUserId, setCurrentUserId] = useState("");
  const [leaderboardRank, setLeaderboardRank] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your dashboard.");
      navigate("/login");
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // const fetchSkillsData = async () => {
    //   try{
    //     setIsLoading(true);
    //     const token=localStorage.getItem("token");
    //     const response=await axios.get("api/score/visualize",{
    //       headers:{
    //         "x-auth-token": token,
    //       },
    //     });
    //     const data=response.data;
    //     const skillsByCategory=data.skillsByCategory;
    //   }
    //   catch(error){
    //     toast.error(error.message);
    //     console.error(error);
    //   }
    // }
    // fetchSkillsData();

    const fetchLeaderBoardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("api/leaderboard", {
          headers: {
            "x-auth-token": token,
          },
        });
        const data = response.data;
        setCurrentUserId(data.id);
        setLeaderboardData(data.leaderboard);
        setLeaderboardRank(
          data.leaderboard.find((item) => item.id === data.id)?.rank || 0
        );
      } catch (error) {
        toast.error(error.message);
        console.error(error);
      }
    };
    fetchLeaderBoardData();
  }, [isAuthenticated, navigate, toast]);

  const getRecentThursday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const daysSinceThursday = (dayOfWeek + 7 - 4) % 7; // 4 is Thursday
  const recentThursday = new Date(today);
  recentThursday.setDate(today.getDate() - daysSinceThursday);
  return recentThursday;
};

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Leaderboard
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 w-full text-white"
            >
              <option value="all" className="text-white">
                All Categories
              </option>
              <option value="frontend" className="text-white">
                Frontend Skills
              </option>
              <option value="backend" className="text-white">
                Backend Skills
              </option>
              <option value="design" className="text-white">
                Design Skills
              </option>
            </select>
          </div> */}

          {/* <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 w-full text-white"
            >
              <option value="week" className="text-white">
                This Week
              </option>
              <option value="month" className="text-white">
                This Month
              </option>
              <option value="alltime" className="text-white">
                All Time
              </option>
            </select>
          </div> */}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            <span className="font-semibold">Rankings updated: </span>
            {formatDate(getRecentThursday())} • Weekly rankings based on resume analysis scores
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboardData.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${
                    user.id === currentUserId
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : ""
                  } hover:bg-gray-50 dark:hover:bg-gray-700/50`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`flex items-center justify-center h-8 w-8 rounded-full ${
                          index === 0 || index === 1 || index === 2
                            ? "text-2xl"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {index + 1 === 1
                          ? "🥇"
                          : index + 1 === 2
                          ? "🥈"
                          : index + 1 === 3
                          ? "🥉"
                          : index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                          {user.id === currentUserId && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-semibold">
                      {user.score}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${user.score}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.lastUpdated)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 md:mb-0">
              <span className="font-semibold">Your Rank: </span>
              {leaderboardRank}
              {leaderboardRank == 1
                ? "st"
                : leaderboardRank == 2
                ? "nd"
                : leaderboardRank == 3
                ? "rd"
                : "th"}{" "}
              out of 142 users in your category
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-1"></span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Your Score
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Category Average
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          How to Improve Your Ranking
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
              Update Your Resume
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Keep your resume up-to-date with your latest projects and skills
              to improve your score.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">
              Add Project Details
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Include specific technologies and metrics for your projects for a
              more accurate analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
