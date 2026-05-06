# 🗄️ Quick Database Connection Check

## ⚡ 3 Ways to Check Database Connection

### Method 1: Test Script (RECOMMENDED) ✅

```bash
node test-database-connection.js
```

**What it does:**
- ✅ Tests connection
- ✅ Shows database info
- ✅ Checks tables
- ✅ Verifies permissions
- ✅ Provides troubleshooting

**Expected output:**
```
✅ DATABASE CONNECTION TEST PASSED!
```

---

### Method 2: Start Server 🚀

```bash
npm run dev
```

**Look for:**
```
✅ GameXchange API running on http://localhost:4000
✅ Database connected
```

**NOT:**
```
❌ Database connection failed
```

---

### Method 3: Health Endpoint 🏥

**Start server first:**
```bash
npm run dev
```

**Then check:**
```bash
curl http://localhost:4000/api/health
```

**Or visit in browser:**
```
http://localhost:4000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "now": "2026-05-05T10:30:45.123Z"
}
```

## 🚨 Common Issues

### Issue: "DATABASE_URL is not set"
**Fix:** Add DATABASE_URL to `.env` file

### Issue: "ENOTFOUND"
**Fix:** Check internet connection and DATABASE_URL host

### Issue: "password authentication failed"
**Fix:** Verify username and password in DATABASE_URL

### Issue: "Connection timeout"
**Fix:** Check firewall, try again, verify Neon database is active

## 📋 Quick Checklist

```
☐ .env file exists
☐ DATABASE_URL is set
☐ Internet connection working
☐ Test script passes
☐ Server starts without errors
☐ Health endpoint returns OK
```

## 🎯 Quick Commands

```bash
# Test connection
node test-database-connection.js

# Start server
npm run dev

# Check health
curl http://localhost:4000/api/health

# View database data
node view-database.js
```

## 📖 Full Guide

For detailed troubleshooting:
👉 **`docs/DATABASE_CONNECTION_GUIDE.md`**

---

**Start here:** Run `node test-database-connection.js` 🚀
