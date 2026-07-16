import axios from "axios";
import crypto from "crypto";

function senderDetails() {
  const configured =
    process.env.EMAIL_FROM || "Neo Code Syndicate <onboarding@resend.dev>";
  const match = configured.match(/^(.*?)\s*<([^>]+)>$/);
  return match
    ? { name: match[1].trim() || "Neo Code Syndicate", email: match[2].trim() }
    : { name: "Neo Code Syndicate", email: configured.trim() };
}

function emailDeliveryError(error) {
  if (error.publicMessage) return error;

  const status = error.response?.status;
  const providerMessage = String(error.response?.data?.message || "");
  const normalized = providerMessage.toLowerCase();
  let publicMessage = "The email could not be sent. Please try again.";

  if (status === 401 || status === 403) {
    publicMessage = "Email service authentication failed. Please update RESEND_API_KEY.";
  } else if (normalized.includes("sender") || normalized.includes("verified")) {
    publicMessage = "EMAIL_FROM is not verified in Resend. Please verify the sending domain.";
  } else if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    publicMessage = "The email provider timed out. Please try again.";
  }

  console.error("Email delivery rejected", { status, code: error.code, providerMessage });
  const deliveryError = new Error("Email delivery failed");
  deliveryError.publicMessage = publicMessage;
  return deliveryError;
}

async function deliverEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    const error = new Error("RESEND_API_KEY is not configured");
    error.publicMessage = "Email service is not configured. Please add RESEND_API_KEY.";
    throw error;
  }

  const sender = senderDetails();
  await axios.post(
    "https://api.resend.com/emails",
    { from: `${sender.name} <${sender.email}>`, to: [to], subject, html },
    {
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    },
  );
}

function verificationMarkup(username, verificationCode) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px"><h2>Welcome to Neo Code Syndicate, ${username}!</h2><p>Use this verification code to finish creating your account:</p><h1 style="letter-spacing:6px">${verificationCode}</h1><p>This code expires in 15 minutes. If you did not request this account, you can ignore this email.</p></div>`;
}

function resetMarkup(username, resetCode) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px"><h2>Password reset request</h2><p>Hi ${username}, use this code to reset your password:</p><h1 style="letter-spacing:6px">${resetCode}</h1><p>This code expires in 1 hour. If you did not request a reset, you can ignore this email.</p></div>`;
}

export const sendVerificationEmail = async (email, verificationCode, username) => {
  try {
    await deliverEmail({
      to: email,
      subject: "Email Verification - Neo Code Syndicate",
      html: verificationMarkup(username, verificationCode),
    });
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    throw emailDeliveryError(error);
  }
};

export const sendPasswordResetEmail = async (email, resetCode, username) => {
  try {
    await deliverEmail({
      to: email,
      subject: "Password Reset Request - Neo Code Syndicate",
      html: resetMarkup(username, resetCode),
    });
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    throw emailDeliveryError(error);
  }
};

export const generateVerificationCode = () =>
  crypto.randomInt(100000, 1000000).toString();

export const verifyEmailServiceConfig = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured. Email functionality will be disabled.");
    return false;
  }
  return true;
};
