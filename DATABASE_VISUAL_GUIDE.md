# 📊 Database Visual Guide - What's Happening

## 🗄️ Complete Database Schema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GAMEXCHANGE DATABASE                             │
│                         (PostgreSQL on Neon)                             │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ TABLE: users                                                              │
├──────────────────────────────────────────────────────────────────────────┤
│ id                          TEXT PRIMARY KEY                              │
│ email                       TEXT UNIQUE NOT NULL                          │
│ password_hash               TEXT NOT NULL                                 │
│ full_name                   TEXT NOT NULL                                 │
│ email_verified              BOOLEAN DEFAULT FALSE                         │
│ verification_token          TEXT                                          │
│ verification_token_expires  TIMESTAMPTZ                                   │
│ created_at                  TIMESTAMPTZ DEFAULT NOW()                     │
│ updated_at                  TIMESTAMPTZ DEFAULT NOW()                     │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ seller_id (FK)
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ TABLE: accounts                                                           │
├──────────────────────────────────────────────────────────────────────────┤
│ id                    TEXT PRIMARY KEY                                    │
│ seller_id             TEXT → users(id) ON DELETE CASCADE                  │
│ game                  TEXT DEFAULT 'Valorant'                             │
│ region                TEXT NOT NULL                                       │
│ level                 INTEGER NOT NULL                                    │
│ rank                  TEXT NOT NULL                                       │
│ skins                 INTEGER DEFAULT 0                                   │
│ agents                TEXT DEFAULT ''                                     │
│ email_changeable      BOOLEAN DEFAULT FALSE                               │
│ price                 INTEGER NOT NULL                                    │
│ negotiable            BOOLEAN DEFAULT FALSE                               │
│ description           TEXT DEFAULT ''                                     │
│ image_url             TEXT                                                │
│ delivery_email        TEXT NOT NULL  ← Used for account transfer         │
│ delivery_password     TEXT NOT NULL  ← Used for account transfer         │
│ delivery_code         TEXT NOT NULL  ← Security code                     │
│ status                TEXT DEFAULT 'active'                               │
│ created_at            TIMESTAMPTZ DEFAULT NOW()                           │
│ updated_at            TIMESTAMPTZ DEFAULT NOW()                           │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ account_id (FK)
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ TABLE: trades (ESCROW SYSTEM) 🔐                                         │
├──────────────────────────────────────────────────────────────────────────┤
│ ═══════════════════════════════════════════════════════════════════════ │
│ CORE FIELDS                                                               │
│ ═══════════════════════════════════════════════════════════════════════ │
│ id                    TEXT PRIMARY KEY                                    │
│ account_id            TEXT → accounts(id) ON DELETE CASCADE               │
│ buyer_id              TEXT → users(id) ON DELETE CASCADE                  │
│ seller_id             TEXT → users(id) ON DELETE CASCADE                  │
│ price                 INTEGER NOT NULL                                    │
│ platform_fee          INTEGER NOT NULL                                    │
│ total_amount          INTEGER NOT NULL                                    │
│                                                                           │
│ ═══════════════════════════════════════════════════════════════════════ │
│ STATUS TRACKING                                                           │
│ ═══════════════════════════════════════════════════════════════════════ │
│ status                TEXT DEFAULT 'pending_payment'                      │
│                       Values: pending_payment                             │
│                              awaiting_credentials                         │
│                              credentials_locked                           │
│                              verify_access                                │
│                              completed                                    │
│                              cancelled                                    │
│                              disputed                                     │
│                                                                           │
│ payment_status        TEXT DEFAULT 'pending'                              │
│                       Values: pending, completed, failed                  │
│                                                                           │
│ ═══════════════════════════════════════════════════════════════════════ │
│ PAYMENT INFORMATION                                                       │
│ ═══════════════════════════════════════════════════════════════════════ │
│ payment_method        TEXT          (upi, card, wallet)                   │
│ payment_id            TEXT          (Razorpay payment ID)                 │
│ payment_order_id      TEXT          (Razorpay order ID)                   │
│ payment_signature     TEXT          (Razorpay signature)                  │
│                                                                           │
│ ═══════════════════════════════════════════════════════════════════════ │
│ 🆕 RIOT CREDENTIALS (ENCRYPTED) 🔐                                       │
│ ═══════════════════════════════════════════════════════════════════════ │
│ riot_id               TEXT          Riot username (Name#Tag)              │
│                       Example: "ProGamer#NA1"                             │
│                       Submitted by: SELLER                                │
│                       Visible to: SELLER (own), BUYER (after unlock)     │
│                                                                           │
│ riot_password_encrypted TEXT        AES-256-GCM encrypted password        │
│                       Format: "iv:authTag:encrypted" (hex)                │
│                       Example: "a1b2c3...:f7e8d9...:9f8e7d..."            │
│                       Submitted by: SELLER                                │
│                       Decrypted for: BUYER ONLY (after unlock)           │
│                       Never stored in plaintext!                          │
│                                                                           │
│ ═══════════════════════════════════════════════════════════════════════ │
│ 🆕 ESCROW WORKFLOW TIMESTAMPS ⏰                                         │
│ ═══════════════════════════════════════════════════════════════════════ │
│ credentials_submitted_at TIMESTAMPTZ  When seller submitted credentials  │
│                       Set by: Server on credential submission             │
│                       Used for: Audit trail, SLA tracking                 │
│                                                                           │
│ credentials_locked    BOOLEAN DEFAULT FALSE                               │
│                       Set to TRUE: When credentials submitted             │
│                       Purpose: Prevent unauthorized access                │
│                                                                           │
│ buyer_confirmed_at    TIMESTAMPTZ  When buyer confirmed receipt           │
│                       Set by: Server on buyer confirmation                │
│                       Triggers: Payment release to seller                 │
│                                                                           │
│ seller_notified_at    TIMESTAMPTZ  When seller was notified               │
│                       Set by: Server after payment verification           │
│                       Used for: Notification tracking                     │
│                                                                           │
│ ═══════════════════════════════════════════════════════════════════════ │
│ ACCOUNT DELIVERY INFO (from accounts table)                               │
│ ═══════════════════════════════════════════════════════════════════════ │
│ account_email         TEXT          Account email for login               │
│ account_password      TEXT          Account password                      │
│ security_code         TEXT          Security/verification code            │
│                       Copied from: accounts.delivery_* fields             │
│                       Visible to: BUYER (after credentials submitted)    │
│                                                                           │
│ ═══════════════════════════════════════════════════════════════════════ │
│ TIMESTAMPS                                                                │
│ ═══════════════════════════════════════════════════════════════════════ │
│ created_at            TIMESTAMPTZ DEFAULT NOW()                           │
│ updated_at            TIMESTAMPTZ DEFAULT NOW()                           │
└──────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Example - Real Trade

### Initial State (Trade Created)
```sql
-- Buyer clicks "Buy Now" on a ₹5000 Immortal 3 account
INSERT INTO trades VALUES (
  'trade-abc123',           -- id
  'account-xyz789',         -- account_id
  'buyer-user-001',         -- buyer_id
  'seller-user-002',        -- seller_id
  5000,                     -- price (₹5000)
  250,                      -- platform_fee (5%)
  5250,                     -- total_amount
  'pending_payment',        -- status
  'pending',                -- payment_status
  NULL,                     -- payment_method
  NULL,                     -- payment_id
  'order_razorpay_xyz',     -- payment_order_id
  NULL,                     -- payment_signature
  NULL,                     -- riot_id (not yet submitted)
  NULL,                     -- riot_password_encrypted (not yet submitted)
  NULL,                     -- credentials_submitted_at
  FALSE,                    -- credentials_locked
  NULL,                     -- buyer_confirmed_at
  NULL,                     -- seller_notified_at
  NULL,                     -- account_email (not yet copied)
  NULL,                     -- account_password (not yet copied)
  NULL,                     -- security_code (not yet copied)
  NOW(),                    -- created_at
  NOW()                     -- updated_at
);
```

**Visual State:**
```
┌─────────────────────────────────────────────────────────────┐
│ Trade: trade-abc123                                          │
│ Status: pending_payment                                      │
├─────────────────────────────────────────────────────────────┤
│ 💰 Payment: ₹5250 (pending)                                 │
│ 🔐 Riot Credentials: ❌ Not submitted                       │
│ 📧 Account Info: ❌ Not available                           │
│ ⏰ Timestamps: All NULL                                     │
└─────────────────────────────────────────────────────────────┘
```

### After Payment (Escrow Secured)
```sql
UPDATE trades SET
  payment_status = 'completed',
  payment_id = 'pay_razorpay_abc123',
  payment_method = 'upi',
  payment_signature = 'sig_xyz789abc',
  status = 'awaiting_credentials',
  seller_notified_at = '2026-04-19 14:15:00+00',
  updated_at = NOW()
WHERE id = 'trade-abc123';

-- Email sent to seller: "Payment received! Submit credentials"
```

**Visual State:**
```
┌─────────────────────────────────────────────────────────────┐
│ Trade: trade-abc123                                          │
│ Status: awaiting_credentials ⬅️ CHANGED                     │
├─────────────────────────────────────────────────────────────┤
│ 💰 Payment: ₹5250 ✅ SECURED IN ESCROW                      │
│    payment_id: pay_razorpay_abc123                          │
│    payment_method: upi                                      │
│                                                             │
│ 📧 Seller Notified: 2026-04-19 14:15:00 ⬅️ NEW             │
│    Email sent to: seller@example.com                        │
│                                                             │
│ 🔐 Riot Credentials: ❌ Awaiting seller submission          │
│ 📧 Account Info: ❌ Not yet available                       │
└─────────────────────────────────────────────────────────────┘
```

### After Seller Submits Credentials
```sql
-- Seller submits: riot_id = "ProGamer#NA1", password = "MySecurePass123!"
-- Server encrypts password:
--   IV = random 16 bytes
--   Encrypted = AES-256-GCM(password, key, IV)
--   AuthTag = generated during encryption
--   Stored = "a1b2c3d4e5f6:f7e8d9c0b1a2:9f8e7d6c5b4a"

UPDATE trades SET
  riot_id = 'ProGamer#NA1',
  riot_password_encrypted = 'a1b2c3d4e5f67890:f7e8d9c0b1a23456:9f8e7d6c5b4a3210abcdef',
  credentials_submitted_at = '2026-04-19 14:30:00+00',
  credentials_locked = TRUE,
  status = 'credentials_locked',
  account_email = 'valorant.acc@email.com',      -- Copied from accounts table
  account_password = 'accountpass123',            -- Copied from accounts table
  security_code = 'GCX-ABC123',                   -- Copied from accounts table
  updated_at = NOW()
WHERE id = 'trade-abc123';

-- Email sent to buyer: "Credentials ready! Verify access"
```

**Visual State:**
```
┌─────────────────────────────────────────────────────────────┐
│ Trade: trade-abc123                                          │
│ Status: credentials_locked ⬅️ CHANGED                       │
├─────────────────────────────────────────────────────────────┤
│ 💰 Payment: ₹5250 ✅ SECURED IN ESCROW                      │
│                                                             │
│ 🔐 Riot Credentials: ✅ SUBMITTED & ENCRYPTED               │
│    riot_id: ProGamer#NA1                                    │
│    riot_password_encrypted: a1b2c3d4e5f6:f7e8d9:9f8e7d     │
│    credentials_submitted_at: 2026-04-19 14:30:00           │
│    credentials_locked: TRUE ⬅️ LOCKED                       │
│                                                             │
│ 📧 Account Delivery Info: ✅ AVAILABLE                      │
│    account_email: valorant.acc@email.com                    │
│    account_password: accountpass123                         │
│    security_code: GCX-ABC123                                │
│                                                             │
│ 📧 Buyer Notified: Email sent                               │
└─────────────────────────────────────────────────────────────┘
```

### After Credentials Unlocked for Buyer
```sql
UPDATE trades SET
  status = 'verify_access',
  updated_at = NOW()
WHERE id = 'trade-abc123';

-- Buyer can now view credentials in dashboard
```

**Visual State:**
```
┌─────────────────────────────────────────────────────────────┐
│ Trade: trade-abc123                                          │
│ Status: verify_access ⬅️ CHANGED                            │
├─────────────────────────────────────────────────────────────┤
│ 💰 Payment: ₹5250 ✅ SECURED IN ESCROW                      │
│                                                             │
│ 🔓 Credentials UNLOCKED for Buyer:                          │
│                                                             │
│    Riot Account:                                            │
│    • Riot ID: ProGamer#NA1                                  │
│    • Password: MySecurePass123! ⬅️ DECRYPTED FOR BUYER     │
│                                                             │
│    Account Login:                                           │
│    • Email: valorant.acc@email.com                          │
│    • Password: accountpass123                               │
│    • Security Code: GCX-ABC123                              │
│                                                             │
│ 🔐 Still Locked: credentials_locked = TRUE                  │
│    (Locked state preserved for audit)                       │
│                                                             │
│ ⏰ Waiting for: Buyer confirmation                          │
└─────────────────────────────────────────────────────────────┘
```

### After Buyer Confirms
```sql
UPDATE trades SET
  status = 'completed',
  buyer_confirmed_at = '2026-04-19 15:00:00+00',
  updated_at = NOW()
WHERE id = 'trade-abc123';

UPDATE accounts SET
  status = 'sold',
  updated_at = NOW()
WHERE id = 'account-xyz789';

-- Payment released to seller
-- Trade complete!
```

**Final State:**
```
┌─────────────────────────────────────────────────────────────┐
│ Trade: trade-abc123                                          │
│ Status: completed ✅                                         │
├─────────────────────────────────────────────────────────────┤
│ 💰 Payment: ₹5250 ✅ RELEASED TO SELLER                     │
│                                                             │
│ 🔐 Credentials: Permanently stored (encrypted)              │
│    riot_id: ProGamer#NA1                                    │
│    riot_password_encrypted: a1b2c3d4e5f6:f7e8d9:9f8e7d     │
│                                                             │
│ ⏰ Complete Timeline:                                        │
│    created_at: 2026-04-19 14:00:00                         │
│    seller_notified_at: 2026-04-19 14:15:00 (15 min)       │
│    credentials_submitted_at: 2026-04-19 14:30:00 (30 min) │
│    buyer_confirmed_at: 2026-04-19 15:00:00 (1 hour)       │
│                                                             │
│ 📊 Trade Duration: 1 hour                                   │
│ 🎉 Status: COMPLETED                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 What You Can See in Database

### Query All Trades
```sql
SELECT 
  id,
  status,
  payment_status,
  riot_id,
  credentials_locked,
  CASE 
    WHEN riot_password_encrypted IS NOT NULL 
    THEN '🔐 ENCRYPTED' 
    ELSE '❌ NOT SET' 
  END as password_status
FROM trades
ORDER BY created_at DESC;
```

**Example Output:**
```
┌─────────────────┬─────────────────────┬────────────────┬──────────────┬────────────────────┬─────────────────┐
│ id              │ status              │ payment_status │ riot_id      │ credentials_locked │ password_status │
├─────────────────┼─────────────────────┼────────────────┼──────────────┼────────────────────┼─────────────────┤
│ trade-abc123    │ completed           │ completed      │ ProGamer#NA1 │ TRUE               │ 🔐 ENCRYPTED    │
│ trade-def456    │ verify_access       │ completed      │ Player2#EU   │ TRUE               │ 🔐 ENCRYPTED    │
│ trade-ghi789    │ awaiting_credentials│ completed      │ NULL         │ FALSE              │ ❌ NOT SET      │
│ trade-jkl012    │ pending_payment     │ pending        │ NULL         │ FALSE              │ ❌ NOT SET      │
└─────────────────┴─────────────────────┴────────────────┴──────────────┴────────────────────┴─────────────────┘
```

### Check Encrypted Password
```sql
SELECT 
  id,
  riot_id,
  LEFT(riot_password_encrypted, 20) || '...' as encrypted_preview,
  LENGTH(riot_password_encrypted) as encrypted_length
FROM trades
WHERE riot_password_encrypted IS NOT NULL;
```

**Example Output:**
```
┌─────────────────┬──────────────┬──────────────────────────┬──────────────────┐
│ id              │ riot_id      │ encrypted_preview        │ encrypted_length │
├─────────────────┼──────────────┼──────────────────────────┼──────────────────┤
│ trade-abc123    │ ProGamer#NA1 │ a1b2c3d4e5f67890f7e8... │ 128              │
│ trade-def456    │ Player2#EU   │ b2c3d4e5f6789012e8d9... │ 128              │
└─────────────────┴──────────────┴──────────────────────────┴──────────────────┘
```

## 🔐 Security in Database

### What's Encrypted
```
❌ NOT Encrypted (Visible in DB):
- riot_id (username is not sensitive)
- account_email
- account_password (from listing, already shared)
- security_code

✅ ENCRYPTED (AES-256-GCM):
- riot_password_encrypted (Riot account password)
```

### Encryption Format
```
Database stores: "a1b2c3d4e5f67890:f7e8d9c0b1a23456:9f8e7d6c5b4a3210abcdef"
                  │                 │                 │
                  │                 │                 └─ Encrypted password
                  │                 └─ Authentication tag (integrity check)
                  └─ Initialization vector (randomness)
```

### Who Can Decrypt
```
✅ CAN decrypt:
- Server API (with ENCRYPTION_KEY)
- Only for authorized buyer
- Only when status = 'verify_access' or 'completed'

❌ CANNOT decrypt:
- Database admin (without ENCRYPTION_KEY)
- Seller (after submission)
- Unauthorized users
- Anyone without the encryption key
```

## 📊 Database Size Impact

### Storage Estimates
```
Per Trade Record:
- Base fields: ~500 bytes
- Encrypted password: ~128 bytes
- Timestamps: ~40 bytes
- Total: ~670 bytes per trade

For 10,000 trades:
- Total size: ~6.7 MB
- Negligible impact on database
```

---

**Database**: PostgreSQL 15+ (Neon)
**Encryption**: AES-256-GCM
**Key Storage**: Environment Variable
**Status**: Production Ready ✅
