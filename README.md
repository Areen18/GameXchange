# GameXchange 2.0

GameXchange is now set up as a Vite React frontend with a local Node API backed by Neon PostgreSQL.

## Required Environment

Create a `.env` file in the project root with:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
JWT_SECRET=replace-this-with-a-long-random-secret
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
VITE_API_URL=http://localhost:4000/api
```

Use your Neon connection string for `DATABASE_URL`.

## Running Locally

```bash
npm install
npm run dev
```

This starts:

- Vite on `http://localhost:3000`
- The API on `http://localhost:4000`

## What Persists

- User accounts and JWT auth
- Marketplace listings
- Trades and purchase confirmations

The SQL schema lives in [server/schema.sql](/Users/sahilpatil/Downloads/GameXchange_2.0/server/schema.sql), and the API bootstraps those tables automatically on startup.
