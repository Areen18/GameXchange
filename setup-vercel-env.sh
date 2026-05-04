#!/bin/bash
# Script to set up Vercel environment variables

echo "Setting up Vercel environment variables..."

# Set DATABASE_URL
echo "Setting DATABASE_URL..."
echo "postgresql://neondb_owner:npg_PL45KmqyxAsX@ep-empty-base-aj7ieu78-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" | vercel env add DATABASE_URL production

# Set JWT_SECRET
echo "Setting JWT_SECRET..."
echo "9ZZE4aNO0izuKt5Gu66wwVjHu6mYoekIJr0B2w0AGvI=" | vercel env add JWT_SECRET production

# Set CLIENT_ORIGIN (update with your Vercel URL)
echo "Setting CLIENT_ORIGIN..."
echo "https://gamexchange-739va64fu-areenshinde1807-4712s-projects.vercel.app" | vercel env add CLIENT_ORIGIN production

echo "Environment variables set! Now redeploying..."
vercel --prod
