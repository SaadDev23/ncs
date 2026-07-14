import nodemailer from "nodemailer";
import axios from "axios";

let transporter = null;

async function ensureTransporter() {
  if (transporter) return transporter;

  // If explicitly requested, use Ethereal (dev/test SMTP)
  if (process.env.USE_ETHEREAL === "true") {
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

  // Default to Brevo SMTP
  transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    port: process.env.BREVO_SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS || process.env.BREVO_SMTP_KEY,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return transporter;
}

function senderDetails() {
  const configured =
    process.env.EMAIL_FROM || process.env.BREVO_FROM_EMAIL || "noreply@ncs.com";
  const match = configured.match(/^(.*?)\s*<([^>]+)>$/);
  return match
    ? { name: match[1].trim() || "Neo Code Syndicate", email: match[2].trim() }
    : { name: "Neo Code Syndicate", email: configured.trim() };
}

async function deliverEmail({ to, subject, html }) {
  if (process.env.BREVO_API_KEY && process.env.USE_ETHEREAL !== "true") {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: senderDetails(),
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        timeout: 15000,
      },
    );
    return null;
  }

  const transporterInstance = await ensureTransporter();
  return transporterInstance.sendMail({
    from: senderDetails(),
    to,
    subject,
    html,
  });
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
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
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
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

/**
 * Generate random 6-digit code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Verify email service is configured
 */
export const verifyEmailServiceConfig = () => {
  if (process.env.USE_ETHEREAL === "true") return true;
  if (process.env.BREVO_API_KEY && senderDetails().email) return true;
  if (
    !process.env.BREVO_SMTP_USER ||
    !(process.env.BREVO_SMTP_PASS || process.env.BREVO_SMTP_KEY)
  ) {
    console.warn(
      "⚠️ Brevo SMTP credentials not configured. Email functionality will be disabled.",
    );
    return false;
  }
  return true;
};
