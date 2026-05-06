# 📧 Visual Email Setup Guide

## 🎯 3-Step Visual Guide

```
┌─────────────────────────────────────────────────────────────┐
│                    STEP 1: ENABLE 2-STEP                    │
└─────────────────────────────────────────────────────────────┘

1. Visit: https://myaccount.google.com/security

   ┌───────────────────────────────────────────┐
   │  Google Account Security                  │
   ├───────────────────────────────────────────┤
   │  How you sign in to Google                │
   │                                           │
   │  ► 2-Step Verification                    │
   │    Add an extra layer of security         │
   │                                           │
   │    [Get Started] ← Click here             │
   └───────────────────────────────────────────┘

2. Follow the prompts to enable 2-Step Verification
3. ✅ Done when you see "2-Step Verification is on"


┌─────────────────────────────────────────────────────────────┐
│                STEP 2: GENERATE APP PASSWORD                │
└─────────────────────────────────────────────────────────────┘

1. Visit: https://myaccount.google.com/apppasswords

   ┌───────────────────────────────────────────┐
   │  App passwords                            │
   ├───────────────────────────────────────────┤
   │  Select app:                              │
   │  [Mail ▼]  ← Select "Mail"                │
   │                                           │
   │  Select device:                           │
   │  [Other (Custom name) ▼]                  │
   │                                           │
   │  Enter name: GameXchange                  │
   │                                           │
   │  [Generate] ← Click here                  │
   └───────────────────────────────────────────┘

2. Copy the generated password:

   ┌───────────────────────────────────────────┐
   │  Your app password for GameXchange        │
   ├───────────────────────────────────────────┤
   │                                           │
   │     abcd efgh ijkl mnop                   │
   │                                           │
   │  [Copy] ← Click to copy                   │
   │                                           │
   │  ⚠️ You won't see this again!             │
   └───────────────────────────────────────────┘

3. Remove spaces: abcd efgh ijkl mnop → abcdefghijklmnop


┌─────────────────────────────────────────────────────────────┐
│                   STEP 3: UPDATE .ENV FILE                  │
└─────────────────────────────────────────────────────────────┘

Open: GameXchange_2.0/.env

Find these lines:
┌─────────────────────────────────────────────────────────────┐
│ SMTP_USER=your-email@gmail.com                              │
│ SMTP_PASS=your-16-character-app-password                    │
│ SMTP_FROM=GameXchange <your-email@gmail.com>                │
└─────────────────────────────────────────────────────────────┘

Replace with your values:
┌─────────────────────────────────────────────────────────────┐
│ SMTP_USER=gamexchange.platform@gmail.com                    │
│ SMTP_PASS=abcdefghijklmnop                                  │
│ SMTP_FROM=GameXchange <gamexchange.platform@gmail.com>      │
└─────────────────────────────────────────────────────────────┘

Save the file!
```

## 🧪 Testing Your Setup

```bash
# Run the test script
$ node test-email-setup.js

# Expected output:
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Testing Email Configuration...                           │
│                                                             │
│ 📋 Current Configuration:                                   │
│    SMTP_HOST: smtp.gmail.com                                │
│    SMTP_PORT: 587                                           │
│    SMTP_SECURE: false                                       │
│    SMTP_USER: gamexchange.platform@gmail.com                │
│    SMTP_PASS: **************** (hidden)                     │
│                                                             │
│ 🔌 Testing SMTP connection...                               │
│ ✅ SMTP connection successful!                              │
│                                                             │
│ 📧 Ready to send emails!                                    │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Start Your Server

```bash
$ npm run dev

# Look for this message:
┌─────────────────────────────────────────────────────────────┐
│ ✅ Email service configured                                 │
│ GameXchange API running on http://localhost:4000            │
└─────────────────────────────────────────────────────────────┘

# NOT this:
┌─────────────────────────────────────────────────────────────┐
│ [DEV MODE] Email service not configured                     │
└─────────────────────────────────────────────────────────────┘
```

## 📧 Email Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER SIGNUP FLOW                         │
└─────────────────────────────────────────────────────────────┘

User Signs Up
     │
     ▼
┌─────────────────┐
│ Create Account  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 📧 Send Verification Email          │
│                                     │
│ To: user@example.com                │
│ Subject: Verify Your Account        │
│ Content: Click link to verify       │
└────────┬────────────────────────────┘
         │
         ▼
User Clicks Link
         │
         ▼
┌─────────────────────────────────────┐
│ ✅ Email Verified                   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 🎉 Send Welcome Email               │
│                                     │
│ To: user@example.com                │
│ Subject: Welcome to GameXchange!    │
│ Content: Getting started guide      │
└─────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                    TRADE NOTIFICATION FLOW                  │
└─────────────────────────────────────────────────────────────┘

Buyer Reports Payment
         │
         ▼
┌─────────────────────────────────────┐
│ 💰 Notify Seller                    │
│                                     │
│ To: seller@example.com              │
│ Subject: Payment Received           │
│ Content: Submit credentials         │
└────────┬────────────────────────────┘
         │
         ▼
Seller Submits Credentials
         │
         ▼
┌─────────────────────────────────────┐
│ 🎮 Notify Buyer                     │
│                                     │
│ To: buyer@example.com               │
│ Subject: Credentials Ready          │
│ Content: Verify account access      │
└─────────────────────────────────────┘
```

## 🎨 Email Preview

### Verification Email
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ╔═══════════════════════════════════════════════════════╗ │
│  ║                                                       ║ │
│  ║              🎮 GameXchange                           ║ │
│  ║         Secure Gaming Account Marketplace            ║ │
│  ║                                                       ║ │
│  ╚═══════════════════════════════════════════════════════╝ │
│                                                             │
│  Welcome, John Doe! 🎮                                      │
│                                                             │
│  Thank you for signing up for GameXchange!                  │
│                                                             │
│  To complete your registration, please verify your          │
│  email address:                                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         [Verify Email Address]                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Or copy this link:                                         │
│  https://game-xchange.shop/verify-email?token=...           │
│                                                             │
│  This link expires in 24 hours.                             │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  © 2026 GameXchange. All rights reserved.                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Payment Notification Email
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ╔═══════════════════════════════════════════════════════╗ │
│  ║                                                       ║ │
│  ║              💰 Payment Received!                     ║ │
│  ║                                                       ║ │
│  ╚═══════════════════════════════════════════════════════╝ │
│                                                             │
│  Hi Seller Name,                                            │
│                                                             │
│  Great news! A buyer has completed payment for your         │
│  IMMORTAL 2 account.                                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Trade Details                                       │   │
│  │                                                     │   │
│  │ Account: IMMORTAL 2 - Level 156                    │   │
│  │ Sale Price: ₹12,500                                │   │
│  │ Trade ID: abc-123-xyz                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🔒 Next Step: Submit Credentials                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         [Go to Dashboard]                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  © 2026 GameXchange. All rights reserved.                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Troubleshooting Flowchart

```
Start Testing
     │
     ▼
Run: node test-email-setup.js
     │
     ├─── ✅ Success? ──────────────────────────┐
     │                                          │
     └─── ❌ Error?                             │
            │                                   │
            ▼                                   ▼
     What's the error?                    Restart Server
            │                                   │
            ├─── "Invalid login"                ▼
            │         │                    npm run dev
            │         ▼                          │
            │    Check SMTP_USER                 ▼
            │    Check SMTP_PASS            Look for:
            │    Regenerate password        "Email service configured"
            │                                    │
            ├─── "Connection timeout"            ▼
            │         │                    Test Signup
            │         ▼                          │
            │    Check firewall                  ▼
            │    Try port 465              Receive Email?
            │                                    │
            ├─── "Certificate error"             ├─── ✅ Yes → Success!
            │         │                          │
            │         ▼                          └─── ❌ No
            │    Add tls config                       │
            │                                         ▼
            └─── Other error                    Check spam folder
                      │                               │
                      ▼                               ▼
                 See full guide              Check server logs
```

## 📊 Configuration Checklist

```
┌─────────────────────────────────────────────────────────────┐
│                    SETUP CHECKLIST                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Gmail Account Setup:                                       │
│  ☐ 2-Step Verification enabled                             │
│  ☐ App Password generated                                  │
│  ☐ Password copied (no spaces)                             │
│                                                             │
│  .env File Configuration:                                   │
│  ☐ SMTP_USER updated with Gmail address                    │
│  ☐ SMTP_PASS updated with app password                     │
│  ☐ SMTP_FROM updated with Gmail address                    │
│  ☐ No placeholder values remaining                         │
│                                                             │
│  Testing:                                                   │
│  ☐ test-email-setup.js runs successfully                   │
│  ☐ Server shows "Email service configured"                 │
│  ☐ Test signup sends verification email                    │
│  ☐ Verification email received                             │
│  ☐ Welcome email received after verification               │
│                                                             │
│  Production (if deploying):                                 │
│  ☐ Environment variables set in Vercel                     │
│  ☐ Application redeployed                                  │
│  ☐ Production emails working                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Quick Reference

### Important URLs
```
┌─────────────────────────────────────────────────────────────┐
│ Google Security:                                            │
│ https://myaccount.google.com/security                       │
│                                                             │
│ App Passwords:                                              │
│ https://myaccount.google.com/apppasswords                   │
│                                                             │
│ Vercel Dashboard:                                           │
│ https://vercel.com/dashboard                                │
└─────────────────────────────────────────────────────────────┘
```

### Key Commands
```
┌─────────────────────────────────────────────────────────────┐
│ Test email setup:                                           │
│ $ node test-email-setup.js                                  │
│                                                             │
│ Start development server:                                   │
│ $ npm run dev                                               │
│                                                             │
│ Build for production:                                       │
│ $ npm run build                                             │
└─────────────────────────────────────────────────────────────┘
```

### .env Template
```
┌─────────────────────────────────────────────────────────────┐
│ SMTP_HOST=smtp.gmail.com                                    │
│ SMTP_PORT=587                                               │
│ SMTP_SECURE=false                                           │
│ SMTP_USER=your-email@gmail.com                              │
│ SMTP_PASS=your-16-char-password                             │
│ SMTP_FROM=GameXchange <your-email@gmail.com>                │
└─────────────────────────────────────────────────────────────┘
```

---

**Need more help?**
- Quick Guide: `QUICK_EMAIL_SETUP.md`
- Detailed Guide: `docs/GMAIL_SMTP_SETUP_GUIDE.md`
- Complete Package: `EMAIL_SETUP_COMPLETE.md`
