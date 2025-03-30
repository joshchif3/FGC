import React, { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

    // // Validation
    // if (!validateUsername(username)) {
    //   setError("Username must be 3-20 characters long and contain only letters, numbers, and underscores. fr");
    //   return;
    // }

    // if (!validateEmail(email)) {
    //   setError("Please enter a valid email address. fr ");
    //   return;
    // }

    // if (!validatePassword(password)) {
    //   setError("Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters. fr");
    //   return;
    // }

    try {
      // Try registering the user
      const response = await axios.post("https://gc-backend-1.onrender.com/users/register", {
        username,
        email,
        password,
      });

      // Check if registration was successful
      if (response.data.message === "Registration successful") {
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        // Handle specific HTTP errors
        if (error.response.status === 409) {
          setError("Username already exists. Please choose a different username.");
        } else {
          setError(error.response.data.message || "Registration failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };

  // Password requirements
  const passwordRequirements = [
    { id: 1, text: "At least 8 characters", valid: password.length >= 8 },
    { id: 2, text: "At least one uppercase letter", valid: /[A-Z]/.test(password) },
    { id: 3, text: "At least one lowercase letter", valid: /[a-z]/.test(password) },
    { id: 4, text: "At least one number", valid: /\d/.test(password) },
    { id: 5, text: "At least one special character", valid: /[@$!%*?&]/.test(password) },
  ];

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
          {/* Password Requirements */}
          <div className="password-requirements">
            <p>Password must meet the following requirements:</p>
            <ul>
              {passwordRequirements.map((req) => (
                <li key={req.id} className={req.valid ? "valid" : "invalid"}>
                  {req.text}
                </li>
              ))}
            </ul>
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;