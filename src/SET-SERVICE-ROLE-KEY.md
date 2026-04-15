# 🎯 EXACT SOLUTION: Set Service Role Key

## ✅ You've Provided the Service Role Key

Your key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiaHZhcXVmcW14eW10YWNoY3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0MDAwMywiZXhwIjoyMDkwNjE2MDAzfQ.j89plFW9eQXJYhUhJZph9z_RG0hbw1D4HHhu3ApamNY`

✅ This is correct (starts with `eyJ`, contains `service_role`, correct project)

---

## 🚨 THE PROBLEM:

The Edge Function cannot read this key because it's not set as an environment variable in the Supabase Edge Functions environment.

---

## 📝 SOLUTION: Set via Supabase CLI

### **Step 1: Install Supabase CLI**

**On macOS/Linux:**
```bash
npm install -g supabase
```

**Or with Homebrew:**
```bash
brew install supabase/tap/supabase
```

**On Windows:**
```powershell
npm install -g supabase
```

---

### **Step 2: Login to Supabase**

```bash
supabase login
```

This will open your browser to authenticate.

---

### **Step 3: Link to Your Project**

```bash
supabase link --project-ref kbhvaqufqmxymtachcxy
```

---

### **Step 4: Set the Secret**

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiaHZhcXVmcW14eW10YWNoY3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0MDAwMywiZXhwIjoyMDkwNjE2MDAzfQ.j89plFW9eQXJYhUhJZph9z_RG0hbw1D4HHhu3ApamNY"
```

---

### **Step 5: Verify the Secret Was Set**

```bash
supabase secrets list
```

You should see:
```
SUPABASE_SERVICE_ROLE_KEY
```

---

### **Step 6: Redeploy Edge Function**

```bash
cd /path/to/your/project
supabase functions deploy server
```

---

### **Step 7: Test It**

Wait 30 seconds, then try signing up in your app.

---

## 🔄 ALTERNATIVE: Set via Supabase Dashboard

If you can't use CLI, try this:

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/kbhvaqufqmxymtachcxy
   ```

2. **Navigate to Edge Functions:**
   - Click "Edge Functions" in left sidebar
   - Click on "server" function (if it exists)
   - Look for "Secrets" or "Environment Variables" tab

3. **Add Environment Variable:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiaHZhcXVmcW14eW10YWNoY3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0MDAwMywiZXhwIjoyMDkwNjE2MDAzfQ.j89plFW9eQXJYhUhJZph9z_RG0hbw1D4HHhu3ApamNY`
   - Save

4. **Redeploy:**
   - Click "Deploy" or "Redeploy" button
   - Wait 1-2 minutes

---

## ⚡ QUICK TEST:

After setting the secret, test with this URL:
```
https://kbhvaqufqmxymtachcxy.supabase.co/functions/v1/make-server-423c8049/diagnostics
```

**Expected output:**
```json
{
  "status": "diagnostic",
  "supabaseEnvironmentVariables": [
    {
      "name": "SUPABASE_SERVICE_ROLE_KEY",
      "isSet": true,
      "length": 218,
      "preview": "eyJhbGciOiJIUzI1NiI..."
    }
  ],
  "criticalCheck": {
    "SUPABASE_SERVICE_ROLE_KEY": true
  }
}
```

If you see `"isSet": true`, then try signup!

---

## 🎯 EXPECTED RESULT AFTER FIX:

1. ✅ Diagnostics shows service key is set
2. ✅ Signup form works
3. ✅ Account created successfully
4. ✅ Auto-logged in (development mode)
5. ✅ Redirected to marketplace
6. ✅ Profile shows your name and email

---

## 🆘 IF CLI DOESN'T WORK:

Tell me and I'll implement an alternative solution:
- Option A: Use Supabase client-side auth (no service role needed)
- Option B: Restructure to use RLS policies with anon key
- Option C: Implement custom auth with KV store

But CLI should work! Try it first.

---

## 📞 NEXT STEPS:

1. **Install Supabase CLI** (Step 1 above)
2. **Run the commands** (Steps 2-5 above)
3. **Test diagnostics URL**
4. **Try signup**
5. **Share results with me**

The moment the secret is set correctly, everything will work! 🚀
