import nodemailer from "nodemailer";
import axios from "axios";
import crypto from "crypto";

let transporter = null;

async function ensureTransporter() {
  if (transporter) return transporter;

  if (process.env.USE_ETHEREAL !== "true") {
    throw new Error("Ethereal transport is only available in local development");
  }

  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log("Using Ethereal test account for email (development).");
  return transporter;
}

function senderDetails() {
  const configured =
    process.env.EMAIL_FROM || "saadiqbal.halai@gmail.com";
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
    publicMessage = "Email service authentication failed. Please update the Resend API key.";
  } else if (normalized.includes("sender") || normalized.includes("verified")) {
    publicMessage = "The sender email is not verified in Resend. Please verify EMAIL_FROM.";
  } else if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    publicMessage = "The email provider timed out. Please try again.";
  }

  console.error("Email delivery rejected", {
    status,
    code: error.code,
    providerMessage,
  });

  const deliveryError = new Error("Email delivery failed");
  deliveryError.publicMessage = publicMessage;
  return deliveryError;
}

async function deliverEmail({ to, subject, html }) {
  const sender = senderDetails();

  if (process.env.USE_ETHEREAL === "true") {
    const transporterInstance = await ensureTransporter();
    return transporterInstance.sendMail({ from: sender, to, subject, html });
  }

  if (!process.env.RESEND_API_KEY) {
    const configError = new Error("RESEND_API_KEY is not configured");
    configError.publicMessage =
      "Email service is not configured. Please add RESEND_API_KEY.";
    throw configError;
  }

  await axios.post(
    "https://api.resend.com/emails",
    {
      from: `${sender.name} <${sender.email}>`,
      to: [to],
      subject,
      html,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    },
  );
  return null;
}

/**
 * Send verification email
 * @param {string} email - Recipient email
 * @param {string} verificationCode - 6-digit verification code
 * @param {string} username - User's username
 */
export const sendVerificationEmail = async (
  email,
  verificationCode,
  username,
) => {
  try {
    const mailOptions = {
      to: email,
      subject: "Email Verification - NCS Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to NCS, ${username}!</h2>
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Thank you for registering. Please verify your email address to complete your registration.</p>
            
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">Your verification code is:</p>
              <h3 style="color: #722c5c; font-size: 32px; letter-spacing: 5px; margin: 10px 0;">${verificationCode}</h3>
              <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">This code expires in 15 minutes</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Enter this code on the verification page to confirm your email and activate your account.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">If you didn't register for this account, please ignore this email.</p>
            <p style="color: #999; font-size: 12px; margin: 10px 0;">© NCS - Neo Code Syndicate</p>
          </div>
        </div>
      `,
    };

    const info = await deliverEmail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    // Show preview URL for Ethereal
    if (process.env.USE_ETHEREAL === "true") {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    throw emailDeliveryError(error);
  }
};

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetCode - Reset code
 * @param {string} username - User's username
 */
export const sendPasswordResetEmail = async (email, resetCode, username) => {
  try {
    const mailOptions = {
      to: email,
      subject: "Password Reset Request - NCS",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Hi ${username},</p>
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">We received a request to reset your password. Use the code below to verify and reset your password.</p>
            
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">Your password reset code is:</p>
              <h3 style="color: #722c5c; font-size: 32px; letter-spacing: 5px; margin: 10px 0;">${resetCode}</h3>
              <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">This code expires in 1 hour</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Enter this code to proceed with resetting your password.</p>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0;">⚠️ If you didn't request a password reset, please ignore this email. Your account remains secure.</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">© NCS - Neo Code Syndicate</p>
          </div>
        </div>
      `,
    };

    const info = await deliverEmail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    if (process.env.USE_ETHEREAL === "true") {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    throw emailDeliveryError(error);
  }
};

/**
 * Generate random 6-digit code
 */
export const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Verify email service is configured
 */
export const verifyEmailServiceConfig = () => {
  if (process.env.USE_ETHEREAL === "true") return true;
  if (process.env.RESEND_API_KEY && senderDetails().email) return true;
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "RESEND_API_KEY is not configured. Email functionality will be disabled.",
    );
    return false;
  }
  return true;
};
