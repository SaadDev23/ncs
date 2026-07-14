import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function FspcSignup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendDataToBackend({ username, email, password, confirmPass });
  };

  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(
          result.msg ||
            "Registration successful. Please check your email for verification code.",
        );
        // Redirect to email verification page
        navigate("/verify-email", { state: { email: email } });
      } else {
        const errorResponse = await response.json().catch(() => ({}));
        toast.error(errorResponse.error || "Registration failed", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(
        "Could not reach the registration server. Please wait a moment and try again.",
      );
      console.error("Registration error:", error);
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">Sign-up</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPass">Confirm Password</label>
            <input
              id="confirmPass"
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="signup-button">
            Sign-up
          </button>
        </form>

        <div className="signup-footer">
          <p>Already have an account?</p>
          <button
            type="button"
            className="login-button"
            onClick={redirectToLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
