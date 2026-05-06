# Deployment Notes - Manual Payment System

## ⚠️ Important: Vercel Deployment

### Current Status:
- ✅ **Local Development Server** (`server/index.js`) - Fully updated with manual payment system
- ⚠️ **Vercel Serverless Function** (`api/server.js`) - Still uses old Razorpay system

### For Local Development:
The local development server is fully functional with the manual payment system:
```bash
npm run dev
```

This runs `server/index.js` which has all the manual payment endpoints.

### For Vercel Deployment:
The `api/server.js` file needs to be updated to match `server/index.js` before deploying to Vercel.

#### Option 1: Copy the Updated Server
```bash
# Copy the updated server logic to api/server.js
cp server/index.js api/server.js
```

Then modify `api/server.js` to export as a serverless function:
```javascript
// At the end of api/server.js, replace:
// await bootstrapDatabase();
// const server = app.listen(port, () => { ... });

// With:
export default app;
```

#### Option 2: Update Vercel Configuration
Alternatively, you can configure Vercel to use the `server/index.js` file directly by updating `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/server"
    }
  ]
}
```

---

## 🚀 Deployment Checklist

### Pre-Deployment:
- [x] Database migration completed
- [x] Local server updated (`server/index.js`)
- [ ] Vercel serverless function updated (`api/server.js`)
- [x] Environment variables configured
- [x] Frontend built successfully
- [x] No TypeScript errors

### Environment Variables (Vercel):
Make sure these are set in your Vercel project settings:

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
JWT_SECRET=your-secret-key-here

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=GameXchange <noreply@gamexchange.com>

# Client
CLIENT_ORIGIN=https://your-domain.vercel.app
```

### Deployment Steps:

#### 1. Update Vercel Serverless Function
```bash
# Option A: Copy and modify
cp server/index.js api/server.js
# Then edit api/server.js to export as serverless function

# Option B: Use the script below
```

#### 2. Build and Test Locally
```bash
npm run build
npm start
```

#### 3. Deploy to Vercel
```bash
vercel --prod
```

#### 4. Run Migration on Production Database
```bash
# Connect to production database
DATABASE_URL=your-production-url node migrate-to-manual-payment.js
```

#### 5. Verify Deployment
- Test authentication
- Create a test trade
- Verify email notifications
- Test payment flow
- Test credentials sharing

---

## 📝 Quick Fix Script for api/server.js

Create a file `update-vercel-api.js`:

```javascript
import fs from 'fs';

// Read the updated server
const serverContent = fs.readFileSync('server/index.js', 'utf8');

// Remove the server startup code
const modifiedContent = serverContent
  .replace(/await bootstrapDatabase\(\);[\s\S]*?console\.log\(`GameXchange API running on[\s\S]*?\);/, '')
  .replace(/const port = Number\(process\.env\.PORT \|\| 4000\);/, '')
  .replace(/const server = app\.listen[\s\S]*?\);/, '')
  + '\n\nexport default app;';

// Write to api/server.js
fs.writeFileSync('api/server.js', modifiedContent);

console.log('✅ api/server.js updated for Vercel deployment');
```

Run it:
```bash
node update-vercel-api.js
```

---

## 🔍 Differences Between Local and Vercel

### Local Development (`server/index.js`):
- Runs as a persistent Node.js server
- Listens on port 4000
- Database connection pooling
- Long-running process

### Vercel Serverless (`api/server.js`):
- Runs as serverless functions
- Cold starts on each request
- Database connection per request
- Stateless execution

### Key Considerations:
1. **Database Connections**: Vercel serverless functions should use connection pooling carefully
2. **Cold Starts**: First request may be slower
3. **Timeouts**: Vercel has 10-second timeout for serverless functions
4. **Memory**: Limited to 1024MB by default

---

## 🎯 Recommended Approach

### For Now (Development):
Use the local development server:
```bash
npm run dev
```

### For Production:
1. Update `api/server.js` to match `server/index.js`
2. Test locally with `vercel dev`
3. Deploy to Vercel
4. Run production migration
5. Monitor and test

---

## 📊 Current File Status

| File | Status | Purpose |
|------|--------|---------|
| `server/index.js` | ✅ Updated | Local development server |
| `api/server.js` | ⚠️ Old | Vercel serverless function |
| `api/index.js` | ✅ OK | Vercel entry point |
| `server/db.js` | ✅ Updated | Database connection |
| `server/email.js` | ✅ Updated | Email notifications |
| `server/payment.js` | ⚠️ Old | Razorpay (not used in manual system) |

---

## 🔧 Manual Update Steps for api/server.js

If you want to manually update `api/server.js`:

### 1. Remove Razorpay Import
```javascript
// Remove this line:
import { createPaymentOrder, verifyPaymentSignature, getPaymentDetails, getRazorpayKey } from "../server/payment.js";
```

### 2. Add Email Notifications
```javascript
// Add these imports:
import { sendSellerPaymentNotification, sendBuyerCredentialsReadyNotification } from "../server/email.js";
```

### 3. Update mapTrade Function
Replace the old mapTrade with the new one from `server/index.js` that includes manual payment fields.

### 4. Update Payment Config Endpoint
```javascript
app.get("/api/payment/config", authRequired, async (req, res) => {
  res.json({
    manual_payment: true,
    currency: 'INR',
  });
});
```

### 5. Add New Endpoints
Copy these from `server/index.js`:
- `POST /api/trades/:id/payment-info`
- `POST /api/trades/:id/report-payment`
- `POST /api/trades/:id/submit-credentials`

### 6. Remove Old Endpoints
- Remove `POST /api/trades/:id/verify-payment`

### 7. Update Trade Creation
Remove Razorpay order creation and add seller notification email.

### 8. Export for Vercel
```javascript
// At the end, replace server startup with:
export default app;
```

---

## ✅ Verification Steps

After updating `api/server.js`:

### 1. Test Locally with Vercel CLI
```bash
npm i -g vercel
vercel dev
```

### 2. Check Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Get accounts
curl http://localhost:3000/api/accounts
```

### 3. Test Trade Flow
1. Create account listing
2. Create trade
3. Add payment info
4. Report payment
5. Submit credentials
6. Confirm receipt

### 4. Check Logs
```bash
vercel logs
```

---

## 🎉 Summary

### Current State:
- ✅ Local development server fully functional
- ✅ Database migrated successfully
- ✅ Frontend updated with new UI
- ⚠️ Vercel serverless function needs update

### Next Steps:
1. Update `api/server.js` for Vercel deployment
2. Test with `vercel dev`
3. Deploy to production
4. Run production migration
5. Monitor and iterate

---

**Note**: For now, you can continue development using the local server (`npm run dev`). The Vercel deployment can be updated when you're ready to deploy to production.

---

**Last Updated**: April 22, 2026  
**Status**: Local Development Ready ✅  
**Vercel Deployment**: Needs Update ⚠️
