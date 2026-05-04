CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_token TEXT,
  verification_token_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game TEXT NOT NULL DEFAULT 'Valorant',
  region TEXT NOT NULL,
  level INTEGER NOT NULL,
  rank TEXT NOT NULL,
  skins INTEGER NOT NULL DEFAULT 0,
  agents TEXT NOT NULL DEFAULT '',
  email_changeable BOOLEAN NOT NULL DEFAULT FALSE,
  price INTEGER NOT NULL,
  negotiable BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  delivery_email TEXT NOT NULL,
  delivery_password TEXT NOT NULL,
  delivery_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trades (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  buyer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  
  -- Manual Payment Fields
  payment_qr_code TEXT,
  payment_upi_id TEXT,
  payment_instructions TEXT,
  payment_reported_at TIMESTAMPTZ,
  payment_reported_by TEXT,
  
  -- Riot Credentials (Plain text for manual system)
  riot_id TEXT,
  riot_password TEXT,
  credentials_submitted_at TIMESTAMPTZ,
  
  -- Tracking
  seller_notified_at TIMESTAMPTZ,
  buyer_confirmed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
