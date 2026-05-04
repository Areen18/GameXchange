# Deployment Fix for https://game-xchange.shop/

## Problem Identified ❌

The `api/server.js` file (used by Vercel serverless functions) is **outdated** and doesn't match your current manual payment system. It's still using:
- ❌ Old Razorpay payment system
- ❌ Old database schema (payment_status, payment_order_id)
- ❌ Missing manual payment endpoints (report-payment, submit-credentials, payment-info)

## Solution ✅

Replace `api/server.js` with the current `server/index.js` logic adapted for Vercel serverless.

## Steps to Fix

### Step 1: Update Environment Variables in Vercel

Go to your Vercel dashboard and add these environment variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_PL45KmqyxAsX@ep-empty-base-aj7ieu78-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=9ZZE4aNO0izuKt5Gu66wwVjHu6mYoekIJr0B2w0AGvI=
CLIENT_ORIGIN=https://game-xchange.shop
```

### Step 2: Update vercel.json

The current `vercel.json` is correct, but ensure it has:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api"
    }
  ],
  "functions": {
    "api/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### Step 3: Replace api/server.js

The file needs to be updated to match the current manual payment system.

### Step 4: Update Frontend API URL

Check `src/utils/api.ts` and ensure it uses the correct production URL:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://game-xchange.shop/api';
```

### Step 5: Add Environment Variable to Vercel

In Vercel dashboard → Settings → Environment Variables:
- Key: `VITE_API_URL`
- Value: `https://game-xchange.shop/api`

### Step 6: Redeploy

After making changes:
```bash
git add .
git commit -m "fix: update serverless API for manual payment system"
git push
```

Vercel will auto-deploy.

## Quick Fix Command

Run this to copy the current server logic to the API folder:
```bash
# This will be done in the next step
```

## Testing After Deployment

1. Visit: https://game-xchange.shop/api/health
   - Should return: `{"status":"ok","now":"2026-..."}`

2. Try signup/login
3. Test trade creation
4. Test manual payment flow

## Common Issues

### Issue: CORS Error
**Fix**: Ensure `CLIENT_ORIGIN` in Vercel env vars is set to `https://game-xchange.shop`

### Issue: Database Connection Error
**Fix**: Ensure `DATABASE_URL` is set correctly in Vercel

### Issue: JWT Token Invalid
**Fix**: Ensure `JWT_SECRET` matches between local and production

## Files to Update
1. ✅ `api/server.js` - Main fix needed
2. ✅ `vercel.json` - Already correct
3. ✅ Environment variables in Vercel dashboard
4. ✅ Frontend API URL configuration
