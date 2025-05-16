/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  // const logout = user?.logout;
  //   const { isAuthenticated, logout } = useAuth() || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600">
                Smart Resume Analyzer
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 dark:text-gray-300 px-3 py-2"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 dark:text-gray-300 px-3 py-2"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="text-gray-700 hover:text-primary-600 dark:text-gray-300 px-3 py-2"
                >
                  Upload
                </Link>
                <Link
                  to="/leaderboard"
                  className="text-gray-700 hover:text-primary-600 dark:text-gray-300 px-3 py-2"
                >
                  Leaderboard
                </Link>
                <Link
                  to="/visualize"
                  className="text-gray-700 hover:text-primary-600 dark:text-gray-300 px-3 py-2"
                >
                  Visualize
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Upload
                </Link>
                <Link
                  to="/leaderboard"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Leaderboard
                </Link>
                <Link
                  to="/visualize"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Visualize
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
