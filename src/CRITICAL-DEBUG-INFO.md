# 🚨 CRITICAL: Service Role Key Debug Guide

## ✅ Latest Changes:

I've updated the backend to:
1. **Use Supabase REST API directly** (instead of client library)
2. **Show extensive debugging** for environment variables
3. **Display service key prefix and length** for verification
4. **Provide detailed error messages**

---

## 🔍 WHAT YOU NEED TO DO NOW:

### **Step 1: Try Signup Again**

1. Open your app
2. Open browser console (F12)
3. Fill signup form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123`
4. Click **Sign Up**

---

### **Step 2: Check Browser Console**

You should now see **detailed environment variable information**:

```
🔧 Environment Variables Check:
   SUPABASE_URL: https://kbhvaqufqmxymtachcxy.supabase.co
   SUPABASE_SERVICE_ROLE_KEY: ✅ SET (eyJhbGciOiJIUzI1NiI...)
   SUPABASE_ANON_KEY: ✅ SET (eyJhbGciOiJIUzI1NiI...)
   Service Key Length: 218
```

---

### **Step 3: Share This Information**

**Please copy and paste the entire console output** that shows:

1. The environment variables check (from Step 2 above)
2. Any error messages
3. The response status

**This will tell us EXACTLY what's wrong!**

---

## 🎯 What Each Error Means:

### **Scenario A: Service Key NOT SET**

**Console shows:**
```
🔧 SUPABASE_SERVICE_ROLE_KEY: ❌ NOT SET
Service Key Length: 0
```

**Error message:**
```
Server configuration error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set.
```

**Solution:**
The environment variable is definitely not configured. You need to:

1. Go to Supabase Dashboard
2. Find Edge Functions settings
3. Add environment variable: `SUPABASE_SERVICE_ROLE_KEY`
4. Use value from: Project Settings → API → service_role key

---

### **Scenario B: Service Key IS SET (but 401 error)**

**Console shows:**
```
🔧 SUPABASE_SERVICE_ROLE_KEY: ✅ SET (eyJhbGciOiJIUzI1NiI...)
Service Key Length: 218
```

**Error message:**
```
❌ 401 Unauthorized - Service role key may be invalid or expired
```

**Solution:**
The key is set but WRONG. Common issues:

1. **Wrong Key Type:**
   - ❌ You copied `anon` key (public)
   - ✅ Should be `service_role` key (secret)

2. **Wrong Project:**
   - Key might be from a different Supabase project
   - Verify project ID: `kbhvaqufqmxymtachcxy`

3. **Corrupted Key:**
   - Extra spaces when pasting
   - Incomplete copy
   - Should start with `eyJ`
   - Should be 200+ characters

**How to fix:**
1. Go to: https://supabase.com/dashboard/project/kbhvaqufqmxymtachcxy/settings/api
2. Find the **`service_role`** section (NOT anon)
3. Copy the ENTIRE key
4. Update environment variable
5. Redeploy Edge Function

---

### **Scenario C: SUCCESS!**

**Console shows:**
```
✅ User created successfully: test@example.com (ID: xxx)
✅ Email auto-confirmed (development mode)
🔵 === SIGNUP REQUEST SUCCESS ===
```

**Result:**
Account created! Auto-logged in! Redirected to marketplace!

---

## 📊 Debug Checklist:

After trying signup, tell me:

- [ ] **Does console show service key as SET or NOT SET?**
- [ ] **What's the service key length?** (should be 200+)
- [ ] **What's the first 20 characters?** (should start with `eyJ`)
- [ ] **What's the error message?**
- [ ] **What's the response status?** (200, 401, 500?)

---

## 🔑 How to Verify Service Role Key:

### **Find Your Service Role Key:**

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/kbhvaqufqmxymtachcxy/settings/api
   ```

2. **Scroll to "Project API keys"**

3. **You'll see TWO keys:**

   **❌ anon (public)** - DON'T USE THIS
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJl...
   Role: anon
   ```

   **✅ service_role (secret)** - USE THIS ONE
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJl...
   Role: service_role
   ```

4. **Copy the `service_role` key** (the one marked as secret)

---

## 🔧 How to Set Environment Variable:

### **Method 1: Supabase Dashboard** (Recommended)

Unfortunately, Figma Make's Supabase integration might handle this differently.

**Try this:**
1. Supabase Dashboard → Project Settings
2. Look for "Environment Variables" or "Secrets"
3. Add: `SUPABASE_SERVICE_ROLE_KEY` = [your service role key]

### **Method 2: Supabase CLI**

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref kbhvaqufqmxymtachcxy

# Set secret
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your_actual_service_role_key_here"

# Deploy
supabase functions deploy server

# Verify
supabase secrets list
```

---

## 🆘 If Environment Variable Won't Set:

If you can't set the environment variable via normal means, we have alternatives:

### **Option 1: Hardcode temporarily (NOT RECOMMENDED FOR PRODUCTION)**

I can temporarily hardcode the key in the backend for testing. This is **NOT secure** but will help us verify everything else works.

### **Option 2: Use a different auth method**

We could implement a simpler auth system using the KV store instead of Supabase Auth.

### **Option 3: Use anon key with RLS**

We could restructure to use the anon key with Row Level Security policies instead of admin functions.

---

## 📞 IMMEDIATE ACTION NEEDED:

**Please try signup now and share:**

1. **Full console output** (especially the environment variables check)
2. **Screenshot of the error** (if any)
3. **Service key info:**
   - Is it SET or NOT SET?
   - What's the length?
   - What are first 20 chars?

**With this info, I can give you the EXACT fix!** 🚀

---

## 💡 Quick Test:

**To verify your service role key is correct:**

1. Open terminal/command prompt
2. Run this command (replace YOUR_SERVICE_ROLE_KEY):

```bash
curl -X POST 'https://kbhvaqufqmxymtachcxy.supabase.co/auth/v1/admin/users' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -H 'apikey: YOUR_SERVICE_ROLE_KEY' \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "email_confirm": true
  }'
```

**Expected result if key is correct:**
```json
{"id":"...","email":"test@example.com",...}
```

**If key is wrong:**
```json
{"code":401,"message":"Missing authorization header"}
```

This will prove if the key itself is valid!
