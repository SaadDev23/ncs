import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./style.css";

export default function FspcLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const { sessionUser } = await response.json();
          if (sessionUser) navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleRememberMeChange = () => {
    setRememberMe((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { username: user, role, access } = await response.json();
        localStorage.setItem("access", access);
        toast.success("Login successful");
        navigate("/home");
      } else {
        const errorData = await response.json();

        // Check if email needs verification
        if (errorData.needsVerification) {
          const notify = errorData.codeSent ? toast.success : toast.error;
          notify(
            errorData.error || "Please verify your email before logging in",
          );
          // Optionally redirect to verification page
          setTimeout(() => {
            navigate("/verify-email", { state: { email: errorData.email } });
          }, 1500);
        } else {
          toast.error(errorData.error || "Incorrect credentials", {
            position: "top-right",
            autoClose: true,
            hideProgressBar: false,
            closeOnClick: true,
            theme: "colored",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Sign in to NCS</h1>

        <form className="login-form" onSubmit={handleSubmit}>
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

          <div className="login-meta">
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              Remember me
            </label>
            <button
              type="button"
              className="forgot-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="login-submit">
            Login
          </button>
        </form>

        <div className="login-footer">
          <span>Don&apos;t have an account?</span>
          <button
            type="button"
            className="link-button"
            onClick={redirectToRegister}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
