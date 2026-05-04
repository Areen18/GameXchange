import bcrypt from "bcryptjs";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

export const pool = new Pool({ connectionString });

export async function query(text, params = []) {
  const client = await pool.connect();

  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function bootstrapDatabase() {
  await query(`
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
  `);

  // Upgrade older databases created before email verification fields were added.
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT;`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMPTZ;`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);

  await query(`
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
      delivery_email TEXT,
      delivery_password TEXT,
      delivery_code TEXT,
      payment_qr_code TEXT,
      payment_upi_id TEXT,
      payment_instructions TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Add payment fields to existing accounts table
  await query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS payment_qr_code TEXT;`);
  await query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS payment_upi_id TEXT;`);
  await query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS payment_instructions TEXT;`);
  
  // Make delivery fields nullable for existing tables
  await query(`ALTER TABLE accounts ALTER COLUMN delivery_email DROP NOT NULL;`);
  await query(`ALTER TABLE accounts ALTER COLUMN delivery_password DROP NOT NULL;`);
  await query(`ALTER TABLE accounts ALTER COLUMN delivery_code DROP NOT NULL;`);

  await query(`
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
  `);

  // Upgrade older trade schema - add manual payment columns if they don't exist
  await query(`ALTER TABLE trades ADD COLUMN IF NOT EXISTS payment_qr_code TEXT;`);
  await query(`ALTER TABLE trades ADD COLUMN IF NOT EXISTS payment_upi_id TEXT;`);
  await query(`ALTER TABLE trades ADD COLUMN IF NOT EXISTS payment_instructions TEXT;`);
  await query(`ALTER TABLE trades ADD COLUMN IF NOT EXISTS payment_reported_at TIMESTAMPTZ;`);
  await query(`ALTER TABLE trades ADD COLUMN IF NOT EXISTS payment_reported_by TEXT;`);
  await query(`ALTER TABLE trades ADD COLUMN IF NOT EXISTS riot_id TEXT;`);
  await query(`ALTER TABLE trades ADD COLUMN IF NOT EXISTS riot_password TEXT;`);
  await query(`ALTER TABLE trades ADD COLUMN IF NOT EXISTS credentials_submitted_at TIMESTAMPTZ;`);
  await query(`ALTER TABLE trades ADD COLUMN IF NOT EXISTS seller_notified_at TIMESTAMPTZ;`);
  await query(`ALTER TABLE trades ADD COLUMN IF NOT EXISTS buyer_confirmed_at TIMESTAMPTZ;`);

  const seededUsers = [
    {
      id: "seed-user-raven",
      email: "seller.raven@gamexchange.dev",
      fullName: "Raven Prime",
      password: "SeedAccount123!",
    },
    {
      id: "seed-user-cypher",
      email: "seller.cypher@gamexchange.dev",
      fullName: "Cypher Edge",
      password: "SeedAccount123!",
    },
  ];

  for (const user of seededUsers) {
    const existing = await query("SELECT id FROM users WHERE email = $1", [user.email]);

    if (existing.rowCount === 0) {
      const passwordHash = await bcrypt.hash(user.password, 10);

      await query(
        `
          INSERT INTO users (id, email, password_hash, full_name, email_verified)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [user.id, user.email, passwordHash, user.fullName, true],
      );
    } else {
      await query(
        `UPDATE users
         SET email_verified = TRUE,
             updated_at = NOW()
         WHERE email = $1`,
        [user.email],
      );
    }
  }

  const accountCount = await query("SELECT COUNT(*)::int AS count FROM accounts");

  if (accountCount.rows[0].count > 0) {
    return;
  }

  const seededAccounts = [
    {
      id: "seed-account-1",
      sellerId: "seed-user-raven",
      region: "NA",
      level: 156,
      rank: "IMMORTAL 2",
      skins: 47,
      agents: "All Agents",
      emailChangeable: true,
      price: 12500,
      negotiable: false,
      description: "Stacked ranked-ready account with premium skins and clean ownership history.",
      deliveryEmail: "immortal2.transfer@gamexchange.dev",
      deliveryPassword: "PrimeVault#156",
      deliveryCode: "RVN-156-NA",
    },
    {
      id: "seed-account-2",
      sellerId: "seed-user-cypher",
      region: "EU",
      level: 98,
      rank: "DIAMOND 3",
      skins: 23,
      agents: "Most Agents",
      emailChangeable: true,
      price: 8750,
      negotiable: true,
      description: "Competitive-ready account with premium finishers and smooth MMR history.",
      deliveryEmail: "diamond3.transfer@gamexchange.dev",
      deliveryPassword: "CypherSecure#98",
      deliveryCode: "CYP-098-EU",
    },
    {
      id: "seed-account-3",
      sellerId: "seed-user-raven",
      region: "APAC",
      level: 289,
      rank: "RADIANT",
      skins: 112,
      agents: "All Agents",
      emailChangeable: true,
      price: 35000,
      negotiable: false,
      description: "High-end Radiant account with deep inventory and premium account progression.",
      deliveryEmail: "radiant.transfer@gamexchange.dev",
      deliveryPassword: "RadiantVault#289",
      deliveryCode: "RAD-289-AP",
    },
    {
      id: "seed-account-4",
      sellerId: "seed-user-cypher",
      region: "LATAM",
      level: 67,
      rank: "PLATINUM 1",
      skins: 15,
      agents: "Core Agents",
      emailChangeable: false,
      price: 5500,
      negotiable: true,
      description: "Affordable entry into mid-rank ranked play with a strong starting skin set.",
      deliveryEmail: "plat.transfer@gamexchange.dev",
      deliveryPassword: "PlatReady#67",
      deliveryCode: "PLT-067-LA",
    },
  ];

  for (const account of seededAccounts) {
    await query(
      `
        INSERT INTO accounts (
          id, seller_id, region, level, rank, skins, agents, email_changeable, price,
          negotiable, description, delivery_email, delivery_password, delivery_code
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14
        )
      `,
      [
        account.id,
        account.sellerId,
        account.region,
        account.level,
        account.rank,
        account.skins,
        account.agents,
        account.emailChangeable,
        account.price,
        account.negotiable,
        account.description,
        account.deliveryEmail,
        account.deliveryPassword,
        account.deliveryCode,
      ],
    );
  }
}
