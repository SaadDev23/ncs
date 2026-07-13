# Email Verification & Password Recovery Implementation

This document explains how to set up and use the email verification and password recovery system with Brevo SMTP.

## Features Implemented

### 1. **Email Verification on Registration**

- Users must verify their email after registration
- A 6-digit verification code is sent to their email
- Code expires after 15 minutes
- Users can resend the code if needed
- Account is only active after email verification

### 2. **Forgot Password Recovery**

- Users can request a password reset
- A 6-digit reset code is sent to their email
- Users verify the code and set a new password
- Reset code expires after 1 hour
- Seamless password recovery flow

## Setup Instructions

### 1. Create a Brevo Account

1. Go to [brevo.com](https://brevo.com)
2. Sign up for a free account
3. Verify your email and complete the registration
4. Access your dashboard

### 2. Get SMTP Credentials

1. In Brevo Dashboard, go to **Settings** → **SMTP & API**
2. Find your SMTP credentials:
   - **SMTP Host**: `smtp-relay.brevo.com`
   - **SMTP Port**: `587` (or 25)
   - **Login (Email)**: Your Brevo login email
   - **Password**: Your Brevo password (or SMTP key)

### 3. Verify a Sender Email

1. In Brevo Dashboard, go to **Senders & Domains**
2. Add your sender email address (e.g., noreply@ncs.com)
3. Click the verification link sent to that email
4. Wait for Brevo to verify (usually instant)

### 4. Configure Backend Environment Variables

Create or update `/server/.env` with:

```env
# MongoDB Connection
MONGO_URL=mongodb+srv://your_username:your_password@cluster.mongodb.net/your_database

# Brevo SMTP Configuration
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your_brevo_email@example.com
BREVO_SMTP_PASS=your_brevo_password
BREVO_FROM_EMAIL=noreply@ncs.com

# Server Configuration
NODE_ENV=development
PORT=8080
```

### 5. Restart Backend Server

After updating `.env`, restart the backend:

```bash
cd server
npm start
```

## Frontend User Flow

### Registration Flow

1. User fills registration form (Username, Email, Password)
2. Clicks "Sign-up"
3. If successful, redirects to **Email Verification Page**
4. User enters the 6-digit code received in email
5. After verification, user can log in

### Login Flow

1. User enters username and password
2. If email is not verified, gets error: "Please verify your email before logging in"
3. Can click link to go to verification page
4. Otherwise, logs in successfully

### Forgot Password Flow

1. From login page, click "Forgot password?"
2. Enter email address
3. Check email for reset code
4. Enter reset code
5. Create new password
6. Password is reset, user can log in with new password

## Backend API Endpoints

### 1. Register User

**POST** `/api/register`

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPass": "password123"
}
```

Response: User created with unverified status, verification email sent

### 2. Verify Email

**POST** `/api/verify-email`

```json
{
  "email": "john@example.com",
  "verificationCode": "123456"
}
```

Response: Email verified, account activated

### 3. Resend Verification Code

**POST** `/api/resend-verification-code`

```json
{
  "email": "john@example.com"
}
```

Response: New verification code sent

### 4. Forgot Password

**POST** `/api/forgot-password`

```json
{
  "email": "john@example.com"
}
```

Response: Reset code sent to email

### 5. Verify Reset Code

**POST** `/api/verify-reset-code`

```json
{
  "email": "john@example.com",
  "resetCode": "123456"
}
```

Response: Reset code verified

### 6. Reset Password

**POST** `/api/reset-password-with-code`

```json
{
  "email": "john@example.com",
  "resetCode": "123456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

Response: Password reset successfully

## Database Changes

The User model now includes:

- `isVerified` (Boolean): Whether email is verified
- `verificationCode` (String): Current verification code
- `verificationCodeExpiry` (Date): When verification code expires
- `resetPasswordToken` (String): Reset password code
- `resetPasswordExpiry` (Date): When reset code expires

## Email Templates

### Verification Email

- Professional HTML template
- Shows 6-digit code with large font
- Expires in 15 minutes
- Includes brand styling

### Password Reset Email

- Professional HTML template
- Shows 6-digit reset code
- Expires in 1 hour
- Security warning included

## Testing

### Test Registration with Verification

1. Go to http://localhost:3000/register
2. Fill in registration form
3. Should redirect to verification page
4. Check terminal or email (if configured) for verification code
5. Enter code and verify

### Test Password Recovery

1. Go to http://localhost:3000/login
2. Click "Forgot password?"
3. Enter email
4. Check terminal or email for reset code
5. Enter code and new password

### Use Test Email Service

For development, you can use:

- **MailHog**: http://localhost:1025 (SMTP)
- **Temp Mail**: Temporary email services
- Actual Brevo account with test sender

## Troubleshooting

### Emails Not Sending

**Issue**: "Failed to send verification email"

**Solutions**:

1. Check `.env` file has correct Brevo credentials
2. Verify BREVO_SMTP_USER is your Brevo login email
3. Verify BREVO_SMTP_PASS is correct
4. Check sender email is verified in Brevo
5. Check backend console for error messages

### Email Verification Code Not Working

**Issue**: "Invalid verification code"

**Solutions**:

1. Code is case-sensitive (numbers only)
2. Code expires after 15 minutes
3. Click "Resend Code" to get a new one
4. Check email spam folder

### Reset Code Expired

**Issue**: "Reset code has expired"

**Solutions**:

1. Request new reset code
2. Expires after 1 hour
3. Codes are one-time use

## Security Best Practices

1. ✅ Verification codes are 6-digit random numbers
2. ✅ Codes expire after 15 minutes (verification) or 1 hour (password reset)
3. ✅ Passwords are hashed with bcrypt (salt: 10 rounds)
4. ✅ Unverified users cannot log in
5. ✅ Reset codes are one-time use
6. ✅ SMTP credentials stored in environment variables

## Email Rate Limits

**Brevo Free Plan**:

- Up to 300 emails per day
- Unlimited recipients per email
- Good for development and small projects

**Upgrade for more**:

- Higher volume tiers available
- Premium support
- Additional features

## Files Modified/Created

### Backend

- ✅ `/server/src/model/User.model.js` - Added verification fields
- ✅ `/server/src/utils/emailService.js` - Email sending utility
- ✅ `/server/src/controllers/appController.js` - Updated register, login, added new endpoints
- ✅ `/server/src/router/route.js` - Added new routes
- ✅ `/server/.env` - Environment variables template

### Frontend

- ✅ `/client/src/components/screens/FspcSignup/FspcSignup.js` - Updated to redirect to verification
- ✅ `/client/src/components/screens/EmailVerification/EmailVerification.js` - New component
- ✅ `/client/src/components/screens/EmailVerification/style.css` - Styling
- ✅ `/client/src/components/screens/ForgotPassword/ForgotPassword.js` - New component
- ✅ `/client/src/components/screens/ForgotPassword/style.css` - Styling
- ✅ `/client/src/components/screens/FspcLogin/FspcLogin.js` - Updated with forgot password link
- ✅ `/client/src/components/screens/FspcLogin/style.css` - Updated button styling
- ✅ `/client/src/App.js` - Added routes for new pages

## Next Steps

1. Sign up for Brevo and get SMTP credentials
2. Update `.env` file with credentials
3. Restart backend server
4. Test registration and email verification
5. Test password recovery flow
6. Deploy to production when ready

## Support

For Brevo SMTP issues:

- Visit: https://www.brevo.com/support
- Documentation: https://developers.brevo.com

For application issues:

- Check terminal for error messages
- Verify environment variables are set correctly
- Test with actual Brevo account
