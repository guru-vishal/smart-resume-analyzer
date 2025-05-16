import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../utils/useAuth";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; // Set your API base URL here

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    // try {
    //   // In a real app, you would make an API call here
    //   // For demo purposes, we'll simulate a successful registration
    //   setTimeout(() => {
    //     const userData = {
    //       id: '1',
    //       name: name,
    //       email: email,
    //       profileScore: 0
    //     }

    //     // login(userData);
    //     toast.success('Account created successfully!');
    //     navigate('/dashboard');
    //   }, 1000)
    // } catch (error) {
    //   toast.error('Registration failed. Please try again.')
    // } finally {
    //   setIsLoading(false)
    // }
    try {
      const response = await axios.post("api/auth/signup", {
        name,
        email,
        password,
      });

      const token = response.data.token;
      const user = {name, email};
      login(user, token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (e) {
      toast.error("Registration failed. Please try again." + e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Create an Account
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input text-black dark:text-white"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input text-black dark:text-white"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input text-black dark:text-white"
            placeholder="••••••••"
            minLength="8"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input text-black dark:text-white"
            placeholder="••••••••"
            minLength="8"
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
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
