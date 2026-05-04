# Vercel Deployment Guide for GameXchange 2.0

## Important Note

This application has a **full-stack architecture** with:
- Frontend: React + Vite
- Backend: Express.js server with PostgreSQL database

Vercel is optimized for **frontend deployments** and **serverless functions**. Your current Express server needs to be either:

1. **Deployed separately** (Recommended)
2. **Converted to serverless functions** (Requires significant refactoring)

## Recommended Deployment Strategy

### Option 1: Split Deployment (Recommended)

Deploy frontend and backend separately:

**Frontend on Vercel:**
- Deploy the React app to Vercel
- Fast, optimized static hosting

**Backend on Railway/Render/Heroku:**
- Deploy Express server to a platform that supports long-running Node.js processes
- Better suited for WebSocket connections, database pooling, and stateful operations

### Option 2: Frontend-Only Vercel Deployment

If you want to deploy just the frontend to Vercel:

1. **Deploy Backend Elsewhere First**
   - Deploy your Express server to Railway, Render, or Heroku
   - Get the backend URL (e.g., `https://your-app.railway.app`)

2. **Update Environment Variables**
   - Set `VITE_API_URL` to your backend URL
   - Configure CORS on backend to allow Vercel domain

3. **Deploy to Vercel**
   ```bash
   cd GameXchange_2.0
   vercel
   ```

## Quick Vercel Frontend Deployment

### Prerequisites
- Vercel CLI installed: `npm i -g vercel`
- Backend deployed and accessible

### Steps

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd GameXchange_2.0
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add environment variable:
     - `VITE_API_URL`: Your backend API URL

5. **Redeploy**
   ```bash
   vercel --prod
   ```

## Alternative: Full-Stack on Railway

For easier full-stack deployment, consider Railway:

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd GameXchange_2.0
   railway init
   ```

4. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

5. **Deploy**
   ```bash
   railway up
   ```

Railway automatically:
- Detects your Node.js app
- Provisions PostgreSQL database
- Sets up environment variables
- Handles both frontend build and backend server

## Environment Variables Needed

For production deployment, set these variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secure-random-secret
CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
VITE_API_URL=https://your-backend-domain.railway.app/api

# Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=GameXchange <noreply@gamexchange.com>

RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_secret
```

## Next Steps

Choose your deployment strategy and I can help you:
1. Deploy frontend to Vercel + backend to Railway
2. Deploy everything to Railway
3. Convert backend to Vercel serverless functions (complex)

Which option would you prefer?
