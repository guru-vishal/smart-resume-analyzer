import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../utils/useAuth";
import axios from "axios";

axios.defaults.baseURL = "https://smart-resume-analyzer-1u14.onrender.com/"; // Set your API base URL here

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("api/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      const user = { email };
      login(user, token);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (e) {
      toast.error("Login failed. Please try again." + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input text-white"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input text-white"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
