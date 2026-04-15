# 🐛 Authentication Troubleshooting Guide

## "Failed to create account" Error

### Problem:
When trying to sign up, you get "Failed to create account" error.

### Solutions:

#### 1. **Check Browser Console**
Open browser DevTools (F12) → Console tab to see detailed error messages.

Look for:
- Network errors (CORS, 500, 404)
- Supabase errors (database, auth configuration)
- JavaScript errors

#### 2. **Verify Supabase Configuration**

The backend needs these environment variables:
```
SUPABASE_URL=https://kbhvaqufqmxymtachcxy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your service role key]
```

**How to check:**
- Go to Supabase Dashboard → Project Settings → API
- Copy the `service_role` key (NOT the anon key)
- Ensure it's properly set in the Figma Make environment

#### 3. **Test Backend Health**

Open this URL in your browser:
```
https://kbhvaqufqmxymtachcxy.supabase.co/functions/v1/make-server-423c8049/health
```

**Expected response:**
```json
{"status":"ok"}
```

If you get an error, the backend isn't running.

#### 4. **Common Errors & Fixes**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "This email is already registered" | Email already exists | Login instead or use different email |
| "Password does not meet requirements" | Password too short | Use minimum 6 characters |
| "Invalid email format" | Malformed email | Check email format (must have @) |
| "Network error" | Backend not responding | Check internet connection, verify backend is running |
| "Failed to create account - no user data" | Supabase auth disabled | Enable auth in Supabase dashboard |

#### 5. **Development Mode (Current)**

The system is currently in **development mode** with:
- ✅ **Auto-confirmed emails** (no verification needed)
- ✅ **Instant account creation**
- ✅ **Auto-login after signup**

This means:
- You don't need to verify email
- Account is immediately active
- You're logged in automatically after signup

#### 6. **Check Supabase Auth Settings**

1. Go to Supabase Dashboard
2. Navigate to Authentication → Settings
3. Ensure:
   - ✅ Enable email provider
   - ✅ Enable email signups
   - ✅ Disable email confirmations (for development)
   - ✅ Allow public user signups

#### 7. **Test with cURL**

Test the backend directly:

```bash
curl -X POST https://kbhvaqufqmxymtachcxy.supabase.co/functions/v1/make-server-423c8049/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "fullName": "Test User"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Account created successfully! You can now login.",
  "userId": "...",
  "email": "test@example.com",
  "autoConfirmed": true
}
```

#### 8. **Database Issues**

If Supabase says "Database not found":
1. Go to Supabase Dashboard
2. Check if your project is paused
3. Click "Resume" if needed
4. Wait 1-2 minutes for it to start

#### 9. **Rate Limiting**

Supabase has rate limits on free tier:
- Max 100 users per hour
- Max 50,000 monthly active users

If you hit the limit, wait or upgrade plan.

#### 10. **Clear Cache & Try Again**

Sometimes cached data causes issues:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard reload page (Ctrl+Shift+R)
3. Try incognito/private browsing mode
4. Try different browser

---

## Still Not Working?

### Check These Files:

1. **/utils/supabase/info.tsx** - Should have correct project ID
2. **/supabase/functions/server/index.tsx** - Backend code with auth endpoints
3. Browser Console - Check for JavaScript errors
4. Network Tab - Check API call responses

### Enable Debug Mode:

Add this to your browser console:
```javascript
localStorage.setItem('debug', 'true');
```

Then refresh and check console for detailed logs.

---

## Success Indicators:

When working properly, you should see:

### Console Logs:
```
📝 Signup attempt for email: test@example.com
✅ Validation passed, creating user...
✅ User created successfully: test@example.com (ID: ...)
✅ Account created successfully: ...
✅ Login successful: ...
```

### Visual Feedback:
- ✅ Green success message: "Account created successfully!"
- ✅ Automatic redirect to marketplace
- ✅ Loading animation (3 seconds)
- ✅ User profile shows your name/email in navbar

---

## Quick Test:

1. Open app
2. Click "Get Started" on landing page
3. Click "Create an account"
4. Fill in:
   - Full Name: Test User
   - Email: yourreal@gmail.com
   - Password: test123
   - Confirm Password: test123
5. Click "Sign Up"
6. Should see: "Account created successfully! Logging you in..."
7. Should redirect to marketplace in 3 seconds
8. Click profile icon → Should show your name and email

---

## Production Mode (For Real Email):

To enable real email verification:

1. **Configure SMTP** in Supabase Dashboard
2. **Change backend code:**
   ```typescript
   email_confirm: false, // Change true to false
   ```
3. Users will need to click verification link in email

---

## Need Help?

1. Check browser console for errors
2. Check Supabase Dashboard → Logs
3. Verify backend is running (health check)
4. Try with different email
5. Clear cache and try incognito mode

---

**Last Updated:** April 2026
**Current Mode:** Development (auto-confirmed emails)
