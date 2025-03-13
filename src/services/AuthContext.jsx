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
      const response = await axios.get("http://localhost:8081/users/me");
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
      const response = await axios.post("http://localhost:8081/users/login", {
        username,
        password,
      });

      if (response.data?.token) {
        localStorage.setItem("authToken", response.data.token); // Correctly store the token
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

  // Register function for SignUpPage
  const register = async (username, email, password, role) => {
    try {
      const response = await axios.post("http://localhost:8081/users/register", {
        username,
        email,
        password,
        role,
      });
  
      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };
  
  

  const logout = () => {
    localStorage.removeItem("authToken"); // Ensure correct key 'authToken'
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
