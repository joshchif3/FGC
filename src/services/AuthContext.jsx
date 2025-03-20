import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false); // Skip user fetch if no token
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get("https://gc-backend-1.onrender.com/users/me");
      setUser(response.data);
    } catch (error) {
      console.error("User fetch error:", error);
      localStorage.removeItem("authToken"); // Remove invalid token
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post("https://gc-backend-1.onrender.com/users/login", {
        username,
        password,
      });

      if (response.data?.token) {
        localStorage.setItem("authToken", response.data.token); // Store the token
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        setUser(response.data);
        navigate("/dashboard");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post("https://gc-backend-1.onrender.com/users/register", {
        username,
        email,
        password,
      });

      if (response.data.message === "Registration successful") {
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);