import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./style.css";

export default function EmailVerification() {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }

    // Cooldown timer for resend button
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown, email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          verificationCode,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.msg || "Email verified successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.error || "Verification failed");
      }
    } catch (error) {
      toast.error("An error occurred during verification");
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResending(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/resend-verification-code",
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
        toast.success(result.msg || "Verification code resent to your email");
        setResendCooldown(60); // 60 seconds cooldown
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.error || "Failed to resend code");
      }
    } catch (error) {
      toast.error("An error occurred while resending code");
      console.error("Resend error:", error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verification-page">
      <div className="verification-card">
        <h1 className="verification-title">Verify Your Email</h1>
        <p className="verification-subtitle">
          We've sent a verification code to <strong>{email}</strong>
        </p>

        <form className="verification-form" onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="code">Verification Code</label>
            <input
              id="code"
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value.replace(/\D/g, ""))
              }
              disabled={loading}
            />
            <small>Check your email for the 6-digit verification code</small>
          </div>

          <button
            type="submit"
            className="verify-button"
            disabled={loading || !verificationCode}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="verification-footer">
          <p>Didn't receive the code?</p>
          <button
            type="button"
            className="resend-button"
            onClick={handleResendCode}
            disabled={resending || resendCooldown > 0}
          >
            {resending
              ? "Sending..."
              : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
          </button>
        </div>

        <div className="back-to-login">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="back-button"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
