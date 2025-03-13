import React, { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth(); // Accessing the register function from AuthContext
  const navigate = useNavigate();

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(username);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    // Validation
    if (!validateUsername(username)) {
      setError("Username must be 3-20 characters long and contain only letters, numbers, and underscores.");
      return;
    }
  
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.");
      return;
    }
  
    try {
      // Try registering the user
      const response = await register(username, email, password, "USER");
      console.log("Registration Response:", response); // Log response for debugging
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Username already exists. Please choose a different username.");
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
