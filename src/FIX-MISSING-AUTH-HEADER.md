# 🔧 FIX: Missing Authorization Header (401 Error)

## ❌ Problem Identified:
```json
{
  "code": 401,
  "message": "Missing authorization header"
}
```

**Root Cause:** The `SUPABASE_SERVICE_ROLE_KEY` environment variable is **NOT configured** in your Supabase Edge Functions.

---

## ✅ Solution: Add Service Role Key to Edge Functions

### **Step 1: Get Your Service Role Key**

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `kbhvaqufqmxymtachcxy`
3. Click **Project Settings** (gear icon in bottom left)
4. Click **API** tab
5. Scroll to **Project API keys**
6. Find **`service_role` key** (starts with `eyJ...`)
7. Click **Copy** button

⚠️ **IMPORTANT:** Copy the `service_role` key, NOT the `anon` key!

---

### **Step 2: Add to Edge Functions Secrets**

#### **Option A: Via Supabase Dashboard (Recommended)**

1. In Supabase Dashboard, go to **Edge Functions**
2. Click **Settings** or **Configuration**
3. Find **Environment Variables** or **Secrets** section
4. Add new secret:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** `[paste your service_role key here]`
5. Click **Save** or **Add Secret**

#### **Option B: Via Supabase CLI**

If you have Supabase CLI installed:

```bash
# Set the secret
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Verify it's set
supabase secrets list
```

---

### **Step 3: Verify Environment Variables Are Set**

After adding the secret, check these are configured:

| Variable | Status | Where to Find |
|----------|--------|---------------|
| `SUPABASE_URL` | ✅ Should be auto-set | Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | ✅ Should be auto-set | Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ **YOU NEED TO ADD THIS** | Project Settings → API → service_role key |

---

### **Step 4: Redeploy Edge Functions**

After setting the secret, you need to redeploy:

#### **If using Supabase Dashboard:**
1. Go to **Edge Functions**
2. Find your function: `make-server-423c8049`
3. Click **Redeploy** or **Deploy**

#### **If using CLI:**
```bash
supabase functions deploy server
```

---

### **Step 5: Test the Fix**

1. Wait 1-2 minutes for deployment to complete
2. Open your app
3. Try signing up again:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123`
   - Confirm Password: `test123`
4. Click **Sign Up**

**Expected Result:** Account created successfully! ✅

---

## 🔍 Verify Backend Has Keys:

Check if backend can see the environment variables:

### **View Edge Function Logs:**

1. Supabase Dashboard → Edge Functions → Logs
2. Look for startup message:
   ```
   🔧 === SERVER STARTUP VALIDATION ===
   🔧 SUPABASE_URL: ✅ Configured
   🔧 SUPABASE_SERVICE_ROLE_KEY: ✅ Configured
   ```

If you see:
```
🔧 SUPABASE_SERVICE_ROLE_KEY: ❌ MISSING
```

Then the secret wasn't set correctly - repeat Step 2.

---

## 📋 Complete Setup Checklist:

- [ ] Copied `service_role` key from Supabase Dashboard
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` secret to Edge Functions
- [ ] Verified the key is correct (starts with `eyJ`)
- [ ] Redeployed Edge Functions
- [ ] Waited 1-2 minutes for deployment
- [ ] Checked Edge Function logs show "✅ Configured"
- [ ] Tested signup - works! ✅

---

## 🎯 Visual Guide:

### **Where to Find Service Role Key:**

```
Supabase Dashboard
  └─ Your Project (kbhvaqufqmxymtachcxy)
      └─ Settings (gear icon) ⚙️
          └─ API
              └─ Project API keys
                  └─ service_role
                      └─ [Copy this key] 📋
```

### **Where to Add Secret:**

```
Supabase Dashboard
  └─ Your Project
      └─ Edge Functions
          └─ Settings / Configuration
              └─ Environment Variables / Secrets
                  └─ Add New Secret
                      Name: SUPABASE_SERVICE_ROLE_KEY
                      Value: [paste key]
```

---

## ⚠️ Common Mistakes:

### ❌ **Mistake #1: Used wrong key**
- **Wrong:** Copied `anon` key (public key)
- **Right:** Use `service_role` key (secret key)

### ❌ **Mistake #2: Didn't redeploy**
- After adding secret, you MUST redeploy Edge Functions
- Changes don't apply until redeployed

### ❌ **Mistake #3: Extra spaces**
- When pasting key, ensure no extra spaces
- Key should start with `eyJ` and be one long string

### ❌ **Mistake #4: Wrong variable name**
- Must be exactly: `SUPABASE_SERVICE_ROLE_KEY`
- Not: `SERVICE_ROLE_KEY` or `SUPABASE_KEY`

---

## 🆘 Still Not Working?

### **Check Edge Function Logs:**

1. Supabase Dashboard → Edge Functions → Logs
2. Look for errors when you try signup
3. Share the logs with me

### **Verify with Health Check:**

Open this URL:
```
https://kbhvaqufqmxymtachcxy.supabase.co/functions/v1/make-server-423c8049/health
```

**Should see:** `{"status":"ok"}`

If you get 404 or error, Edge Functions aren't deployed.

---

## 🎉 After Fix:

Once `SUPABASE_SERVICE_ROLE_KEY` is configured correctly, you should see:

### **In Edge Function Logs:**
```
🔧 === SERVER STARTUP VALIDATION ===
🔧 SUPABASE_URL: ✅ Configured
🔧 SUPABASE_SERVICE_ROLE_KEY: ✅ Configured
```

### **In Browser Console (on signup):**
```
🔵 Sending signup request to backend...
📡 Signup response status: 200
✅ Account created successfully
```

### **In App:**
```
✅ Verification email sent! Please check your inbox.
```

---

## 🔐 Security Note:

**The `service_role` key is a SECRET KEY that bypasses Row Level Security.**

- ✅ **DO** store it in Supabase Secrets/Environment Variables
- ✅ **DO** use it only in backend/server code
- ❌ **DON'T** expose it in frontend code
- ❌ **DON'T** commit it to Git
- ❌ **DON'T** share it publicly

---

## 📞 Next Steps:

**Do this now:**

1. ✅ Copy `service_role` key from Supabase Dashboard
2. ✅ Add to Edge Functions as `SUPABASE_SERVICE_ROLE_KEY`
3. ✅ Redeploy Edge Functions
4. ✅ Wait 1-2 minutes
5. ✅ Try signup again

**It will work immediately after these steps!** 🚀

---

**This is the #1 most common issue - once you add the service role key, everything will work perfectly!**
