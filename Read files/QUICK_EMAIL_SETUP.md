# ⚡ Quick Email Setup (5 Minutes)

## 🎯 Goal
Enable real email sending for verification, welcome, and notification emails.

## 📋 Steps

### 1️⃣ Enable 2-Step Verification (2 minutes)
1. Go to: https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click "Get Started" and follow prompts
4. ✅ Done when you see "2-Step Verification is on"

### 2️⃣ Generate App Password (2 minutes)
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter name: **GameXchange**
5. Click **Generate**
6. 📋 **Copy the 16-character password** (remove spaces)
   - Example: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

### 3️⃣ Update .env File (1 minute)
Open `GameXchange_2.0/.env` and update these lines:

```env
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM=GameXchange <your-actual-email@gmail.com>
```

**Example:**
```env
SMTP_USER=gamexchange.platform@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM=GameXchange <gamexchange.platform@gmail.com>
```

### 4️⃣ Test Configuration (30 seconds)
```bash
# Test SMTP connection
node test-email-setup.js

# If successful, restart your server
npm run dev
```

## ✅ Verification

You'll know it's working when:
1. ✅ Test script shows "SMTP connection successful!"
2. ✅ Server logs show "Email service configured" (not "DEV MODE")
3. ✅ Signup sends real verification email
4. ✅ You receive emails in your inbox

## 🚨 Common Issues

### "Invalid login: 535-5.7.8"
- ❌ Wrong email or app password
- ✅ Double-check SMTP_USER and SMTP_PASS
- ✅ Regenerate app password

### "Connection timeout"
- ❌ Firewall blocking port 587
- ✅ Try port 465 with SMTP_SECURE=true

### Still in "DEV MODE"
- ❌ .env not loaded or server not restarted
- ✅ Restart server: `npm run dev`
- ✅ Check .env file has no typos

## 📖 Full Documentation

For detailed troubleshooting and alternatives:
- **Full Guide**: `docs/GMAIL_SMTP_SETUP_GUIDE.md`
- **Test Script**: `test-email-setup.js`

## 🎉 That's It!

Your GameXchange application can now send real emails! 📧

---

**Quick Commands:**
```bash
# Test email setup
node test-email-setup.js

# Start server
npm run dev

# Check if emails are enabled
# Look for: "Email service configured" (not "DEV MODE")
```
