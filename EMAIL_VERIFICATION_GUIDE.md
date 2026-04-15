# Email Verification System - Complete Guide

## Overview
This guide covers the complete email verification system implemented in GameXchange. Users must verify their email address before they can log in to the platform.

## Features Implemented

### 1. Email Verification Flow
- Users sign up with email, password, and full name
- Verification email sent automatically
- Users must click verification link before logging in
- 24-hour expiration on verification tokens
- Resend verification email option

### 2. Security Features
- Verification tokens are UUIDs (cryptographically secure)
- Tokens expire after 24 hours
- Tokens are single-use (cleared after verification)
- Email verification required before login
- Rate limiting on signup/login attempts

### 3. User Experience
- Beautiful HTML email templates
- Clear success/error messages
- Automatic redirect after verification
- Resend verification option
- Dev mode for testing without SMTP

## Database Schema

### Users Table Updates
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_token TEXT,
  verification_token_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**New Fields:**
- `email_verified`: Boolean flag indicating if email is verified
- `verification_token`: UUID token sent in verification email
- `verification_token_expires`: Expiration timestamp (24 hours from creation)

## API Endpoints

### POST /api/auth/signup
Create a new user account and send verification email.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "email_verified": false,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Account created successfully. Please check your email to verify your account.",
  "requiresVerification": true
}
```

**Note:** No tokens are returned - user must verify email first.

### POST /api/auth/login
Login with email and password (requires verified email).

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "email_verified": true
  }
}
```

**Error (403) - Email Not Verified:**
```json
{
  "error": "Please verify your email before logging in",
  "code": "EMAIL_NOT_VERIFIED",
  "email": "user@example.com"
}
```

### POST /api/auth/verify-email
Verify email address using token from email.

**Request:**
```json
{
  "token": "verification-token-uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now log in.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "email_verified": true
  }
}
```

**Error (400) - Invalid/Expired Token:**
```json
{
  "error": "Invalid or expired verification token",
  "code": "INVALID_TOKEN"
}
```

### POST /api/auth/resend-verification
Resend verification email to user.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent. Please check your inbox."
}
```

**Error (400) - Already Verified:**
```json
{
  "error": "This email is already verified",
  "code": "ALREADY_VERIFIED"
}
```

## Email Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Email Configuration (Optional - for email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=GameXchange <noreply@gamexchange.com>
```

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `SMTP_PASS`

3. **Configuration:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=GameXchange <your-gmail@gmail.com>
```

### Other Email Providers

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

**AWS SES:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

### Development Mode (No SMTP)

If SMTP is not configured, the system runs in development mode:
- Verification emails are logged to console
- Verification links are printed in server logs
- No actual emails are sent
- Perfect for local development

**Console Output:**
```
📧 [DEV MODE] Verification email for user@example.com
🔗 Verification link: http://localhost:3000/verify-email?token=abc-123-def
```

## Frontend Integration

### 1. Signup Flow

```typescript
// User signs up
const response = await signup({ email, password, fullName });

// Show success message
setSuccessMessage(response.message);
// "Account created successfully! Please check your email to verify your account."

// Don't auto-login - user must verify email first
```

### 2. Login Flow with Verification Check

```typescript
try {
  const response = await login({ email, password });
  // Success - email is verified
  storeToken(response.token, response.refreshToken, rememberMe);
  onAuthSuccess(response.user);
} catch (error: any) {
  if (error.message.includes('EMAIL_NOT_VERIFIED')) {
    // Show error with resend option
    setError('Please verify your email before logging in.');
    setShowResendButton(true);
  }
}
```

### 3. Resend Verification

```typescript
const handleResendVerification = async () => {
  try {
    const response = await resendVerification(email);
    setSuccessMessage(response.message);
  } catch (error) {
    setError('Failed to resend verification email');
  }
};
```

### 4. Email Verification Page

```typescript
// URL: /verify-email?token=abc-123-def

useEffect(() => {
  const verify = async () => {
    try {
      const response = await verifyEmail(token);
      // Auto-login after verification
      storeToken(response.token, response.refreshToken, true);
      // Redirect to dashboard
      onVerificationSuccess(response.user);
    } catch (error) {
      setStatus('error');
      setMessage('Verification failed');
    }
  };
  
  verify();
}, [token]);
```

## Email Templates

### Verification Email

**Subject:** Verify Your GameXchange Account

**Features:**
- Branded header with gradient
- Clear call-to-action button
- Alternative text link
- Expiration notice (24 hours)
- Professional footer
- Mobile-responsive design
- Dark theme styling

**Button Link:**
```
http://localhost:3000/verify-email?token={verification_token}
```

### Welcome Email

**Subject:** Welcome to GameXchange! 🎮

**Sent:** After successful email verification

**Features:**
- Welcome message
- Feature highlights
- "Start Trading" button
- Branded design

## User Flow Diagram

```
1. User Signs Up
   ↓
2. Account Created (email_verified = false)
   ↓
3. Verification Email Sent
   ↓
4. User Clicks Link in Email
   ↓
5. Verification Page Loads
   ↓
6. Token Validated
   ↓
7. Email Verified (email_verified = true)
   ↓
8. Welcome Email Sent
   ↓
9. Auto-Login & Redirect to Dashboard
```

## Testing

### Manual Testing

1. **Sign Up:**
   ```bash
   POST http://localhost:4000/api/auth/signup
   {
     "email": "test@example.com",
     "password": "TestPass123!",
     "fullName": "Test User"
   }
   ```

2. **Check Console for Dev Link:**
   ```
   📧 [DEV MODE] Verification email for test@example.com
   🔗 Verification link: http://localhost:3000/verify-email?token=abc-123
   ```

3. **Visit Verification Link:**
   ```
   http://localhost:3000/verify-email?token=abc-123
   ```

4. **Try to Login (Before Verification):**
   ```bash
   POST http://localhost:4000/api/auth/login
   {
     "email": "test@example.com",
     "password": "TestPass123!"
   }
   ```
   **Expected:** 403 error with EMAIL_NOT_VERIFIED code

5. **Verify Email** (use link from step 3)

6. **Login Again:**
   ```bash
   POST http://localhost:4000/api/auth/login
   {
     "email": "test@example.com",
     "password": "TestPass123!"
   }
   ```
   **Expected:** 200 success with tokens

### Automated Test Script

```javascript
// test-email-verification.js
const API_URL = 'http://localhost:4000/api';

async function testEmailVerification() {
  const email = `test${Date.now()}@example.com`;
  
  // 1. Sign up
  console.log('1. Testing signup...');
  const signupRes = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: 'TestPass123!',
      fullName: 'Test User'
    })
  });
  const signupData = await signupRes.json();
  console.log('✅ Signup:', signupData.message);
  
  // 2. Try to login (should fail)
  console.log('\n2. Testing login before verification...');
  const loginRes1 = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'TestPass123!' })
  });
  const loginData1 = await loginRes1.json();
  console.log(loginRes1.status === 403 ? '✅' : '❌', 'Login blocked:', loginData1.error);
  
  // 3. Get verification token from console logs
  console.log('\n3. Check server console for verification link');
  console.log('   Copy the token and verify manually');
}

testEmailVerification();
```

## Troubleshooting

### Issue: Emails Not Sending

**Solution:**
1. Check SMTP credentials in `.env`
2. Verify SMTP_HOST and SMTP_PORT
3. For Gmail, ensure App Password is used (not regular password)
4. Check server console for error messages
5. Test SMTP connection:
   ```javascript
   await transporter.verify();
   ```

### Issue: Verification Link Expired

**Solution:**
- Tokens expire after 24 hours
- Use "Resend Verification" button
- New token will be generated

### Issue: "Email Already Verified" Error

**Solution:**
- User already verified their email
- They can login directly
- No need to verify again

### Issue: Verification Page Not Loading

**Solution:**
1. Check URL format: `/verify-email?token=...`
2. Ensure App.tsx handles the route
3. Check browser console for errors
4. Verify token is in URL parameters

## Security Considerations

### Token Security
- UUIDs are cryptographically secure
- Tokens are single-use
- 24-hour expiration
- Stored securely in database
- Cleared after verification

### Email Enumeration Prevention
- Same error message for invalid email/password
- Resend endpoint doesn't reveal if email exists
- Rate limiting on all auth endpoints

### Best Practices
1. Always use HTTPS in production
2. Set secure SMTP credentials
3. Use environment variables for secrets
4. Monitor failed verification attempts
5. Log verification events for audit

## Production Deployment

### Pre-Deployment Checklist

- [ ] Configure production SMTP service
- [ ] Set CLIENT_ORIGIN to production URL
- [ ] Update email templates with production branding
- [ ] Test email delivery in production
- [ ] Set up email monitoring/alerts
- [ ] Configure SPF/DKIM/DMARC records
- [ ] Test verification flow end-to-end
- [ ] Set up email bounce handling
- [ ] Configure rate limiting
- [ ] Enable HTTPS

### Recommended Email Services

**For Production:**
1. **SendGrid** - Reliable, good free tier
2. **AWS SES** - Scalable, cost-effective
3. **Mailgun** - Developer-friendly
4. **Postmark** - High deliverability

**Avoid for Production:**
- Gmail (rate limits, not designed for bulk)
- Personal email accounts
- Free SMTP services

## Files Modified/Created

### Backend
- `server/db.js` - Updated users table schema
- `server/email.js` - Email service (NEW)
- `server/index.js` - Auth endpoints updated
- `package.json` - Added nodemailer

### Frontend
- `src/utils/api.ts` - Added verification functions
- `src/components/login-form.tsx` - Updated signup/login flow
- `src/components/verify-email-page.tsx` - Verification page (NEW)
- `src/App.tsx` - Added verification routing

### Configuration
- `.env` - Added SMTP configuration

## Support

For issues or questions:
1. Check server console logs
2. Review this documentation
3. Test in development mode first
4. Verify SMTP configuration
5. Check email spam folder

## Future Enhancements

Potential improvements:
- [ ] Email change verification
- [ ] Password reset via email
- [ ] Email notification preferences
- [ ] Multi-language email templates
- [ ] Email analytics/tracking
- [ ] Batch email sending
- [ ] Email queue system
- [ ] Webhook for email events
