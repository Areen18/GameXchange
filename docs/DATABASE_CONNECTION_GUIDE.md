# 🗄️ Database Connection Guide

## 🎯 How to Check Database Connection

### Quick Test (30 seconds)

Run this command:
```bash
node test-database-connection.js
```

### Expected Output (Success):
```
🔍 Testing Database Connection...

📋 Database Configuration:
   Host: ep-empty-base-aj7ieu78-pooler.c-3.us-east-2.aws.neon.tech
   Port: 5432
   Database: neondb
   User: neondb_owner
   Password: ********** (hidden)
   SSL Mode: require

🔌 Attempting to connect to database...
✅ Database connection successful!

📊 Running diagnostic tests...

Test 1: PostgreSQL Version
   ✅ PostgreSQL 16.0 on x86_64-pc-linux-gnu

Test 2: Server Time
   ✅ Server time: 2026-05-05 10:30:45.123

Test 3: Current Database
   ✅ Connected to: neondb

Test 4: Table Structure
   ✅ Found 3 tables:
      - accounts
      - trades
      - users

Test 5: Users Table
   ✅ Users table exists
   📊 Total users: 15

Test 6: Accounts Table
   ✅ Accounts table exists
   📊 Total accounts: 10

Test 7: Trades Table
   ✅ Trades table exists
   📊 Total trades: 5

Test 8: Write Permissions
   ✅ Write permissions verified

═══════════════════════════════════════════════════════
✅ DATABASE CONNECTION TEST PASSED!
═══════════════════════════════════════════════════════

Your database is properly configured and ready to use.
```

## 🔍 Check Connection in Server Logs

### Method 1: Start Development Server

```bash
npm run dev
```

### Look for These Messages:

#### ✅ Success:
```
GameXchange API running on http://localhost:4000
Database connected successfully
Tables created/verified
Seed data inserted
```

#### ❌ Failure:
```
❌ Database connection failed
Error: getaddrinfo ENOTFOUND ...
```

### Method 2: Check Health Endpoint

Once server is running:

```bash
# Using curl
curl http://localhost:4000/api/health

# Or visit in browser
http://localhost:4000/api/health
```

#### ✅ Success Response:
```json
{
  "status": "ok",
  "now": "2026-05-05T10:30:45.123Z"
}
```

#### ❌ Failure Response:
```json
{
  "error": "Internal server error"
}
```

## 📊 Visual Connection Indicators

### In Terminal:
```
┌─────────────────────────────────────────────────────────────┐
│ ✅ CONNECTED                                                │
├─────────────────────────────────────────────────────────────┤
│ GameXchange API running on http://localhost:4000            │
│ Database: neondb                                            │
│ Tables: users, accounts, trades                             │
│ Status: Ready                                               │
└─────────────────────────────────────────────────────────────┘
```

### In Browser (Health Check):
```
┌─────────────────────────────────────────────────────────────┐
│ http://localhost:4000/api/health                            │
├─────────────────────────────────────────────────────────────┤
│ {                                                           │
│   "status": "ok",                                           │
│   "now": "2026-05-05T10:30:45.123Z"                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Troubleshooting Connection Issues

### Issue 1: "DATABASE_URL is not set"

**Symptoms:**
```
❌ DATABASE_URL is not set in .env file!
```

**Solution:**
1. Check if `.env` file exists in `GameXchange_2.0/` directory
2. Open `.env` file
3. Verify `DATABASE_URL` line exists:
   ```env
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```
4. If missing, copy from `.env.example`

### Issue 2: "ENOTFOUND" or "getaddrinfo"

**Symptoms:**
```
❌ Error: getaddrinfo ENOTFOUND ep-empty-base...
```

**Causes:**
- No internet connection
- DNS resolution failure
- Incorrect database host

**Solutions:**
1. Check internet connection
2. Verify DATABASE_URL host is correct
3. Try pinging the host:
   ```bash
   ping ep-empty-base-aj7ieu78-pooler.c-3.us-east-2.aws.neon.tech
   ```
4. Check firewall settings

### Issue 3: "password authentication failed"

**Symptoms:**
```
❌ password authentication failed for user "neondb_owner"
```

**Causes:**
- Wrong username
- Wrong password
- Incorrect DATABASE_URL

**Solutions:**
1. Go to Neon Dashboard: https://console.neon.tech/
2. Select your project
3. Go to "Connection Details"
4. Copy the correct connection string
5. Update DATABASE_URL in `.env`

### Issue 4: "Connection timeout" (ETIMEDOUT)

**Symptoms:**
```
❌ Error: connect ETIMEDOUT
```

**Causes:**
- Firewall blocking connection
- Network issues
- Neon database suspended

**Solutions:**
1. Check firewall settings (allow port 5432)
2. Verify internet connection
3. Check Neon dashboard - database might be suspended
4. Try again in a few moments

### Issue 5: "SSL certificate" error

**Symptoms:**
```
❌ SSL certificate error
```

**Causes:**
- Missing `sslmode=require` in DATABASE_URL
- SSL certificate trust issues

**Solutions:**
1. Ensure DATABASE_URL includes `?sslmode=require`
2. Update system certificates:
   ```bash
   # Windows (run as admin)
   certutil -generateSSTFromWU roots.sst
   
   # Mac
   brew install ca-certificates
   
   # Linux
   sudo apt-get update && sudo apt-get install ca-certificates
   ```

### Issue 6: "database does not exist"

**Symptoms:**
```
❌ database "neondb" does not exist
```

**Causes:**
- Wrong database name in DATABASE_URL
- Database was deleted

**Solutions:**
1. Check Neon dashboard for correct database name
2. Update DATABASE_URL with correct database name
3. If database was deleted, create a new one in Neon

## 📋 Connection String Format

### Correct Format:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?sslmode=require&channel_binding=require
```

### Example:
```
postgresql://neondb_owner:npg_PL45KmqyxAsX@ep-empty-base-aj7ieu78-pooler.c-3.us-east-2.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require
```

### Parts Explained:
- **USERNAME**: `neondb_owner`
- **PASSWORD**: `npg_PL45KmqyxAsX`
- **HOST**: `ep-empty-base-aj7ieu78-pooler.c-3.us-east-2.aws.neon.tech`
- **PORT**: `5432` (default PostgreSQL port)
- **DATABASE**: `neondb`
- **SSL MODE**: `require` (mandatory for Neon)
- **CHANNEL BINDING**: `require` (additional security)

## 🔍 Manual Connection Test (Using psql)

If you have PostgreSQL client installed:

```bash
psql "postgresql://neondb_owner:npg_PL45KmqyxAsX@ep-empty-base-aj7ieu78-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Expected Output:
```
psql (16.0)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256)
Type "help" for help.

neondb=>
```

### Test Queries:
```sql
-- Check tables
\dt

-- Count users
SELECT COUNT(*) FROM users;

-- Check database version
SELECT version();

-- Exit
\q
```

## 🎯 Connection Status Checklist

Use this checklist to verify your database connection:

```
┌─────────────────────────────────────────────────────────────┐
│                  CONNECTION CHECKLIST                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Configuration:                                             │
│  ☐ .env file exists                                        │
│  ☐ DATABASE_URL is set                                     │
│  ☐ DATABASE_URL format is correct                          │
│  ☐ No typos in connection string                           │
│                                                             │
│  Network:                                                   │
│  ☐ Internet connection working                             │
│  ☐ Can ping database host                                  │
│  ☐ Firewall allows port 5432                               │
│  ☐ No VPN/proxy blocking connection                        │
│                                                             │
│  Database:                                                  │
│  ☐ Neon database is active (not suspended)                 │
│  ☐ Database name is correct                                │
│  ☐ Username is correct                                     │
│  ☐ Password is correct                                     │
│                                                             │
│  Testing:                                                   │
│  ☐ test-database-connection.js runs successfully           │
│  ☐ Server starts without errors                            │
│  ☐ Health endpoint returns OK                              │
│  ☐ Can query tables                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Commands

```bash
# Test database connection
node test-database-connection.js

# Start server (will test connection automatically)
npm run dev

# Check health endpoint (server must be running)
curl http://localhost:4000/api/health

# View database data
node view-database.js
```

## 📊 Connection Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CONNECTION FLOW                          │
└─────────────────────────────────────────────────────────────┘

Application Start
      │
      ▼
Load .env file
      │
      ▼
Read DATABASE_URL
      │
      ├─── ❌ Not found ──────────────────────┐
      │                                       │
      ▼                                       ▼
Create connection pool              Show error message
      │                                   Exit
      ▼
Attempt connection
      │
      ├─── ❌ Failed ─────────────────────────┐
      │                                       │
      ▼                                       ▼
✅ Connected                         Show error details
      │                              Troubleshooting tips
      ▼                                   Exit
Bootstrap database
      │
      ▼
Create tables (if not exist)
      │
      ▼
Insert seed data (if empty)
      │
      ▼
✅ Ready to serve requests
```

## 🔐 Security Best Practices

### ✅ DO:
- Keep DATABASE_URL in .env file
- Add .env to .gitignore
- Use SSL/TLS (sslmode=require)
- Rotate passwords regularly
- Use connection pooling
- Set connection timeouts

### ❌ DON'T:
- Commit DATABASE_URL to git
- Share connection strings publicly
- Disable SSL
- Use weak passwords
- Leave connections open indefinitely
- Hardcode credentials in code

## 📞 Getting Help

### Check These First:
1. Run `node test-database-connection.js`
2. Check server logs for errors
3. Verify .env file configuration
4. Test health endpoint

### Still Having Issues?
1. Check Neon dashboard: https://console.neon.tech/
2. Verify database is active
3. Check connection limits
4. Review firewall settings
5. Try regenerating database password

## 🎉 Success Indicators

You'll know your database is connected when:

1. ✅ Test script shows "DATABASE CONNECTION TEST PASSED!"
2. ✅ Server starts without database errors
3. ✅ Health endpoint returns `{"status":"ok"}`
4. ✅ Can view data with `node view-database.js`
5. ✅ Application functions normally (signup, login, trades)

---

**Quick Test:**
```bash
node test-database-connection.js
```

**Expected Result:**
```
✅ DATABASE CONNECTION TEST PASSED!
```

**If you see this, your database is connected and working!** 🎉
