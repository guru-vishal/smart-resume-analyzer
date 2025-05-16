import { useState, useEffect, createContext, useContext } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage or session
    setIsLoading(true);
    const loggedInUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (loggedInUser && token) {
      try {
        const parsedUser = JSON.parse(loggedInUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse user data:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        toast.error("Invalid session data. " + e.message);
        setIsAuthenticated(false);
        setUser(null);
      }

    }
    else{
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
