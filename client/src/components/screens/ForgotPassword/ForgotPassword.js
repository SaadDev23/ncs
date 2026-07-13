import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./style.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: reset code, 3: new password
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.msg || "Reset code sent to your email");
        setStep(2);
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.error || "Failed to send reset code");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetCode = async (e) => {
    e.preventDefault();
    if (!resetCode) {
      toast.error("Please enter the reset code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/verify-reset-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, resetCode }),
        },
      );

      if (response.ok) {
        toast.success("Reset code verified");
        setStep(3);
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.error || "Invalid or expired reset code");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/reset-password-with-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            resetCode,
            newPassword,
            confirmPassword,
          }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.msg || "Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h1 className="forgot-password-title">Reset Password</h1>

        {step === 1 && (
          <>
            <p className="forgot-password-subtitle">
              Enter your email to receive a password reset code
            </p>
            <form onSubmit={handleRequestReset}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button type="submit" className="reset-button" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="forgot-password-subtitle">
              Enter the reset code sent to <strong>{email}</strong>
            </p>
            <form onSubmit={handleVerifyResetCode}>
              <div className="form-group">
                <label htmlFor="code">Reset Code</label>
                <input
                  id="code"
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  value={resetCode}
                  onChange={(e) =>
                    setResetCode(e.target.value.replace(/\D/g, ""))
                  }
                  disabled={loading}
                />
              </div>
              <button type="submit" className="reset-button" disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
            <button
              type="button"
              className="back-link"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="forgot-password-subtitle">
              Create a new password for your account
            </p>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button type="submit" className="reset-button" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
            <button
              type="button"
              className="back-link"
              onClick={() => {
                setStep(2);
                setResetCode("");
              }}
            >
              ← Back
            </button>
          </>
        )}

        <div className="forgot-password-footer">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="login-link"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
