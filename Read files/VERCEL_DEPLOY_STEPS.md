# Vercel Deployment Steps

## Prerequisites
- Vercel account (sign up at vercel.com)
- Neon PostgreSQL database (you already have this)
- Vercel CLI installed: `npm i -g vercel`

## Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

## Step 2: Login to Vercel
```bash
vercel login
```

## Step 3: Deploy from Project Directory
```bash
cd GameXchange_2.0
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **gamexchange** (or your preferred name)
- In which directory is your code located? **./** (press Enter)

## Step 4: Set Environment Variables

After initial deployment, go to your Vercel dashboard or use CLI:

```bash
vercel env add DATABASE_URL
```

Paste your Neon PostgreSQL connection string when prompted.

Add all required environment variables:

```bash
vercel env add JWT_SECRET
vercel env add CLIENT_ORIGIN
```

### Required Environment Variables:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `JWT_SECRET` - A secure random string (generate with: `openssl rand -base64 32`)
- `CLIENT_ORIGIN` - Your Vercel deployment URL (e.g., https://gamexchange.vercel.app)

### Optional Environment Variables (for email):
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

### Optional Environment Variables (for payments):
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## Step 5: Deploy to Production
```bash
vercel --prod
```

## Step 6: Update CLIENT_ORIGIN

After deployment, you'll get a URL like `https://gamexchange-xyz.vercel.app`

Update the CLIENT_ORIGIN environment variable:
```bash
vercel env add CLIENT_ORIGIN production
```
Enter your deployment URL when prompted.

Redeploy:
```bash
vercel --prod
```

## Vercel Dashboard Method

Alternatively, set environment variables via dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable for Production, Preview, and Development

## Automatic Deployments

Once set up, Vercel will automatically deploy:
- **Production**: When you push to main branch
- **Preview**: For pull requests and other branches

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL is set correctly
- Neon serverless is already configured in your code

### CORS Issues
- The API is configured to accept all origins in production
- If needed, update the CORS settings in `api/server.js`

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

## Local Testing with Vercel Dev

Test the serverless functions locally:
```bash
vercel dev
```

This runs your app as it would on Vercel.

## Your Deployment is Ready!

Once deployed, your app will be available at:
- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/*`

The serverless API will automatically scale and handle requests efficiently.
