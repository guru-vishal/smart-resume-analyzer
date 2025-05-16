import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import VisualizePage from "./pages/SkillVisualizationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import "./index.css";
import { AuthProvider } from "./utils/useAuth";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Authentication routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/visualize" element={<VisualizePage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
