# 🗄️ How to Check if Database is Connected

## 🎯 The Easiest Way (30 seconds)

### Run This Command:
```bash
node test-database-connection.js
```

### You'll See One of Two Results:

#### ✅ SUCCESS (Database Connected):
```
🔍 Testing Database Connection...

📋 Database Configuration:
   Host: ep-empty-base-aj7ieu78-pooler...
   Database: neondb
   User: neondb_owner

🔌 Attempting to connect to database...
✅ Database connection successful!

📊 Running diagnostic tests...
   ✅ PostgreSQL 16.0
   ✅ Server time: 2026-05-05...
   ✅ Connected to: neondb
   ✅ Found 3 tables: users, accounts, trades
   ✅ Total users: 15
   ✅ Write permissions verified

═══════════════════════════════════════════════════════
✅ DATABASE CONNECTION TEST PASSED!
═══════════════════════════════════════════════════════

Your database is properly configured and ready to use.
```

#### ❌ FAILURE (Database Not Connected):
```
🔍 Testing Database Connection...

❌ DATABASE CONNECTION FAILED!
═══════════════════════════════════════════════════════

Error: getaddrinfo ENOTFOUND...

🔧 Troubleshooting: DNS/Host Resolution Error
   - Check your internet connection
   - Verify the database host is correct
   - Check if your firewall is blocking the connection
```

## 🚀 Alternative Methods

### Method 2: Check Server Logs

```bash
# Start your server
npm run dev

# Look for these messages:
```

**✅ Connected:**
```
GameXchange API running on http://localhost:4000
[DEV MODE] Email service not configured
Database connected successfully
```

**❌ Not Connected:**
```
❌ Database connection failed
Error: ...
```

### Method 3: Test Health Endpoint

```bash
# 1. Start server
npm run dev

# 2. In another terminal, test the endpoint
curl http://localhost:4000/api/health

# Or open in browser:
# http://localhost:4000/api/health
```

**✅ Connected Response:**
```json
{
  "status": "ok",
  "now": "2026-05-05T10:30:45.123Z"
}
```

**❌ Not Connected Response:**
```json
{
  "error": "Internal server error"
}
```

### Method 4: View Database Data

```bash
node view-database.js
```

**✅ Connected:**
```
📊 GameXchange Database Overview
═══════════════════════════════════════════════════════

👥 Users: 15 total
📦 Accounts: 8 active, 2 sold
💰 Trades: 2 completed, 3 pending
```

**❌ Not Connected:**
```
❌ Database connection failed
```

## 🔍 Visual Indicators

### In Your Terminal:
```
┌─────────────────────────────────────────────────────────────┐
│                    ✅ CONNECTED                             │
├─────────────────────────────────────────────────────────────┤
│ GameXchange API running on http://localhost:4000            │
│ Database: neondb                                            │
│ Tables: users, accounts, trades                             │
│ Status: Ready ✓                                             │
└─────────────────────────────────────────────────────────────┘
```

### In Your Browser:
Visit: `http://localhost:4000/api/health`

```
┌─────────────────────────────────────────────────────────────┐
│ {                                                           │
│   "status": "ok",                                           │
│   "now": "2026-05-05T10:30:45.123Z"                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
```

## 🚨 What If It's Not Connected?

### Step 1: Check .env File

Open `GameXchange_2.0/.env` and verify:

```env
DATABASE_URL=postgresql://neondb_owner:npg_PL45KmqyxAsX@ep-empty-base-aj7ieu78-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Make sure:**
- ✅ Line exists (not commented out with #)
- ✅ No typos
- ✅ Complete connection string
- ✅ Includes `?sslmode=require`

### Step 2: Check Internet Connection

```bash
# Try pinging Google
ping google.com

# If this fails, check your internet connection
```

### Step 3: Verify Neon Database

1. Go to: https://console.neon.tech/
2. Login to your account
3. Check if database is active (not suspended)
4. Copy the connection string
5. Update DATABASE_URL in .env if different

### Step 4: Run Test Script Again

```bash
node test-database-connection.js
```

The script will tell you exactly what's wrong!

## 📊 Connection Status Summary

| Method | Command | Success Indicator |
|--------|---------|-------------------|
| **Test Script** | `node test-database-connection.js` | "DATABASE CONNECTION TEST PASSED!" |
| **Server Logs** | `npm run dev` | "Database connected successfully" |
| **Health Endpoint** | `curl http://localhost:4000/api/health` | `{"status":"ok"}` |
| **View Data** | `node view-database.js` | Shows user/account/trade counts |

## 🎯 Quick Decision Tree

```
Want to check database connection?
         │
         ▼
Run: node test-database-connection.js
         │
         ├─── ✅ Passes? ──────────────────────┐
         │                                     │
         └─── ❌ Fails?                        │
                │                              │
                ▼                              ▼
         Read error message            Database is connected!
                │                       You're good to go! 🎉
                ▼
         Follow troubleshooting steps
                │
                ▼
         Fix the issue
                │
                ▼
         Run test again
```

## 📋 Troubleshooting Quick Reference

| Error Message | What It Means | Quick Fix |
|---------------|---------------|-----------|
| "DATABASE_URL is not set" | Missing .env configuration | Add DATABASE_URL to .env |
| "ENOTFOUND" | Can't find database host | Check internet, verify host |
| "password authentication failed" | Wrong credentials | Check username/password |
| "ETIMEDOUT" | Connection timeout | Check firewall, try again |
| "SSL certificate" | SSL issue | Add `?sslmode=require` |
| "database does not exist" | Wrong database name | Check Neon dashboard |

## ✅ Success Checklist

Your database is connected when:

- ☐ Test script shows "DATABASE CONNECTION TEST PASSED!"
- ☐ Server starts without database errors
- ☐ Health endpoint returns `{"status":"ok"}`
- ☐ Can view data with `view-database.js`
- ☐ Application works (signup, login, trades)

## 🎉 You're All Set!

If you see:
```
✅ DATABASE CONNECTION TEST PASSED!
```

**Your database is connected and working perfectly!**

---

## 📚 Need More Help?

- **Quick Check**: `DATABASE_CONNECTION_CHECK.md`
- **Full Guide**: `docs/DATABASE_CONNECTION_GUIDE.md`
- **Test Script**: `test-database-connection.js`

---

**Start Here:**
```bash
node test-database-connection.js
```

**That's it!** This one command tells you everything you need to know. 🚀
