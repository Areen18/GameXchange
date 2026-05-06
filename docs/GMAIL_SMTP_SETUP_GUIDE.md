# 📧 Gmail SMTP Setup Guide for GameXchange

## 🎯 Overview

This guide will help you configure real email sending using Gmail's SMTP server for:
- ✅ Email verification
- ✅ Welcome emails
- ✅ Trade notifications
- ✅ Payment alerts

## 📋 Prerequisites

- Gmail account (personal or Google Workspace)
- 2-Step Verification enabled on your Google account

## 🔐 Step 1: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click on "2-Step Verification"
4. Follow the prompts to enable it (if not already enabled)

## 🔑 Step 2: Generate App Password

### Why App Password?
Google doesn't allow regular passwords for third-party apps. You need a special "App Password" for security.

### How to Generate:

1. **Go to App Passwords page:**
   - Visit: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords

2. **Create App Password:**
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other (Custom name)"
   - Enter name: "GameXchange"
   - Click "Generate"

3. **Copy the Password:**
   - Google will show a 16-character password like: `abcd efgh ijkl mnop`
   - **Copy this immediately** (you won't see it again)
   - Remove spaces: `abcdefghijklmnop`

## ⚙️ Step 3: Update .env File

Open your `.env` file and add these lines:

```env
# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM=GameXchange <your-email@gmail.com>
```

### Replace These Values:

1. **SMTP_USER**: Your Gmail address
   ```
   SMTP_USER=yourgmail@gmail.com
   ```

2. **SMTP_PASS**: The 16-character app password (no spaces)
   ```
   SMTP_PASS=abcdefghijklmnop
   ```

3. **SMTP_FROM**: Your Gmail address (can use custom name)
   ```
   SMTP_FROM=GameXchange <yourgmail@gmail.com>
   ```

## 📝 Complete Example

Here's a complete example with a real Gmail account:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_PL45KmqyxAsX@ep-empty-base-aj7ieu78-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret
JWT_SECRET=9ZZE4aNO0izuKt5Gu66wwVjHu6mYoekIJr0B2w0AGvI=

# Client Origin
CLIENT_ORIGIN=http://localhost:3000

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=gamexchange.platform@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM=GameXchange <gamexchange.platform@gmail.com>
```

## 🧪 Step 4: Test Email Sending

### Option 1: Test via Signup

1. Start your server:
   ```bash
   npm run dev
   ```

2. Sign up with a real email address
3. Check your inbox for verification email
4. Check server logs for email status

### Option 2: Test Script

Create a test file `test-email.js`:

```javascript
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'your-test-email@example.com', // Replace with your email
      subject: 'Test Email from GameXchange',
      text: 'If you receive this, your SMTP setup is working!',
      html: '<h1>Success!</h1><p>Your SMTP setup is working correctly.</p>',
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
}

testEmail();
```

Run the test:
```bash
node test-email.js
```

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Cause**: Wrong email or app password

**Solution**:
1. Double-check your Gmail address in `SMTP_USER`
2. Regenerate app password (make sure no spaces)
3. Ensure 2-Step Verification is enabled

### Issue 2: "Connection timeout"

**Cause**: Firewall or network blocking port 587

**Solution**:
1. Check your firewall settings
2. Try port 465 with `SMTP_SECURE=true`:
   ```env
   SMTP_PORT=465
   SMTP_SECURE=true
   ```

### Issue 3: "Self-signed certificate"

**Cause**: SSL certificate validation issue

**Solution**: Add to your email.js:
```javascript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Only for development
  }
});
```

### Issue 4: "Daily sending limit exceeded"

**Cause**: Gmail has sending limits

**Limits**:
- Personal Gmail: 500 emails/day
- Google Workspace: 2,000 emails/day

**Solution**:
- Use a dedicated email service (SendGrid, Mailgun, AWS SES)
- Or create multiple Gmail accounts for rotation

## 🔒 Security Best Practices

### 1. Never Commit .env File
```bash
# Make sure .env is in .gitignore
echo ".env" >> .gitignore
```

### 2. Use Different Emails for Dev/Prod
```env
# Development
SMTP_USER=gamexchange.dev@gmail.com

# Production (use environment variables in Vercel)
SMTP_USER=gamexchange.prod@gmail.com
```

### 3. Rotate App Passwords Regularly
- Regenerate app passwords every 3-6 months
- Revoke old passwords immediately

### 4. Monitor Email Activity
- Check Gmail "Recent security activity"
- Review sent emails regularly

## 🚀 Production Setup (Vercel)

### Add Environment Variables in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project: **gamexchange**
3. Go to: **Settings** → **Environment Variables**
4. Add these variables:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=GameXchange <your-production-email@gmail.com>
```

5. Select environment: **Production**, **Preview**, **Development**
6. Click "Save"
7. Redeploy your application

## 📊 Email Templates

Your application already has beautiful email templates for:

### 1. Verification Email
- Sent when user signs up
- Contains verification link
- Expires in 24 hours

### 2. Welcome Email
- Sent after email verification
- Welcomes user to platform

### 3. Seller Payment Notification
- Sent when buyer reports payment
- Prompts seller to submit credentials

### 4. Buyer Credentials Ready
- Sent when seller submits credentials
- Notifies buyer to verify account

## 🎨 Customizing Email Templates

Email templates are in `server/email.js` and `api/email.js`:

```javascript
// Change the sender name
const mailOptions = {
  from: `"Your Custom Name" <${process.env.SMTP_FROM}>`,
  // ...
};

// Customize email content
html: `
  <h1>Your Custom Header</h1>
  <p>Your custom message...</p>
`
```

## 🔄 Alternative Email Services

If Gmail doesn't meet your needs, consider:

### 1. SendGrid (Recommended for Production)
- Free tier: 100 emails/day
- Better deliverability
- Detailed analytics

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### 2. Mailgun
- Free tier: 5,000 emails/month
- Good for transactional emails

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

### 3. AWS SES
- Very cheap ($0.10 per 1,000 emails)
- Requires AWS account

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-access-key
SMTP_PASS=your-aws-secret-key
```

## ✅ Verification Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated
- [ ] .env file updated with correct values
- [ ] No spaces in app password
- [ ] Server restarted after .env changes
- [ ] Test email sent successfully
- [ ] Verification email received
- [ ] Welcome email received
- [ ] Trade notification emails working
- [ ] Production environment variables set (if deploying)

## 🆘 Still Having Issues?

### Check Server Logs:
```bash
# Look for email-related messages
npm run dev

# You should see:
# ✅ Email service configured
# ✅ Verification email sent to: user@example.com
```

### Enable Debug Mode:

Add to your email service:
```javascript
const transporter = nodemailer.createTransport({
  // ... existing config
  debug: true, // Show SMTP traffic
  logger: true // Log to console
});
```

### Test SMTP Connection:

```javascript
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ SMTP Error:', error);
  } else {
    console.log('✅ Server is ready to send emails');
  }
});
```

## 📞 Support

If you're still stuck:
1. Check Gmail "Less secure app access" (should be OFF - use app passwords instead)
2. Verify your Gmail account isn't locked or suspended
3. Try generating a new app password
4. Check your server's firewall settings
5. Review server logs for detailed error messages

---

**Quick Start Summary:**
1. Enable 2-Step Verification on Gmail
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Update .env with your Gmail and app password
4. Restart server
5. Test by signing up with a real email

**That's it!** 🎉
