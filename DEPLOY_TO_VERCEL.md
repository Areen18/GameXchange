# Deploy GameXchange to Vercel - Complete Guide

## ✅ Files Fixed

The following files have been updated for production deployment:
- ✅ `api/server.js` - Updated to match current manual payment system
- ✅ `api/index.js` - Serverless entry point (already correct)
- ✅ `vercel.json` - Deployment configuration (already correct)

## 🚀 Deployment Steps

### Step 1: Set Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: **gamexchange**
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_PL45KmqyxAsX@ep-empty-base-aj7ieu78-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=9ZZE4aNO0izuKt5Gu66wwVjHu6mYoekIJr0B2w0AGvI=

CLIENT_ORIGIN=https://game-xchange.shop

VITE_API_URL=https://game-xchange.shop/api
```

**Important**: Make sure to add these for **Production**, **Preview**, and **Development** environments.

### Step 2: Push Changes to Git

```bash
cd GameXchange_2.0

# Add all changes
git add .

# Commit with a message
git commit -m "fix: update API for production deployment with manual payment system"

# Push to your repository
git push origin main
```

### Step 3: Vercel Will Auto-Deploy

Vercel will automatically detect the push and start deploying. You can monitor the deployment at:
https://vercel.com/dashboard

### Step 4: Test the Deployment

Once deployed, test these endpoints:

**1. Health Check:**
```
https://game-xchange.shop/api/health
```
Expected response:
```json
{
  "status": "ok",
  "now": "2026-..."
}
```

**2. Test Signup:**
```bash
curl -X POST https://game-xchange.shop/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "fullName": "Test User"
  }'
```

**3. Test Login:**
```bash
curl -X POST https://game-xchange.shop/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller.raven@gamexchange.dev",
    "password": "SeedAccount123!"
  }'
```

**4. Visit the Website:**
```
https://game-xchange.shop/
```

## 🔧 Troubleshooting

### Issue: Still Getting Internal Server Error

**Solution 1**: Clear Vercel Cache
```bash
# In Vercel dashboard:
# Deployments → Latest Deployment → ... → Redeploy → Clear cache and redeploy
```

**Solution 2**: Check Vercel Logs
1. Go to Vercel Dashboard
2. Click on your deployment
3. Click "Functions" tab
4. Click on `/api` function
5. View the logs to see the exact error

### Issue: CORS Error

**Fix**: Ensure `CLIENT_ORIGIN` is set to `https://game-xchange.shop` (without trailing slash)

### Issue: Database Connection Error

**Fix**: Verify `DATABASE_URL` is correctly set in Vercel environment variables

### Issue: Frontend Can't Connect to API

**Fix**: Check that `VITE_API_URL` is set to `https://game-xchange.shop/api`

## 📋 Checklist

Before deploying, ensure:

- [ ] All environment variables are set in Vercel
- [ ] `api/server.js` is updated (done ✅)
- [ ] `vercel.json` is configured (done ✅)
- [ ] Changes are committed to git
- [ ] Changes are pushed to repository
- [ ] Vercel deployment is successful
- [ ] Health endpoint returns 200 OK
- [ ] Website loads without errors
- [ ] Login/Signup works
- [ ] Trades can be created
- [ ] Manual payment flow works

## 🎯 What Was Fixed

### Before (Broken):
- ❌ API used old Razorpay payment system
- ❌ Database schema mismatch
- ❌ Missing manual payment endpoints
- ❌ Server tried to call `app.listen()` in serverless

### After (Fixed):
- ✅ API uses current manual payment system
- ✅ Correct database schema (manual payments)
- ✅ All endpoints match current system
- ✅ Proper serverless export

## 📞 Support

If you still face issues after following this guide:

1. Check Vercel function logs
2. Verify all environment variables
3. Try redeploying with cache cleared
4. Check that your domain DNS is pointing to Vercel

## 🎉 Success!

Once deployed successfully, your GameXchange marketplace will be live at:
**https://game-xchange.shop/**

With all features working:
- ✅ User authentication
- ✅ Account listings
- ✅ Manual payment system
- ✅ QR code payments
- ✅ Credential sharing
- ✅ Trade management
- ✅ Dark mode
- ✅ Responsive design
