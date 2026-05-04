# Database Schema - Escrow System Explained

## 📊 Current Database Structure

### Tables Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    users     │         │   accounts   │         │    trades    │
│──────────────│         │──────────────│         │──────────────│
│ id (PK)      │◄────────│ seller_id    │◄────────│ account_id   │
│ email        │         │ id (PK)      │         │ id (PK)      │
│ password_hash│         │ game         │         │ buyer_id     │
│ full_name    │         │ region       │         │ seller_id    │
│ email_verified│        │ level        │         │ price        │
│ created_at   │         │ rank         │         │ status       │
└──────────────┘         │ price        │         │ payment_id   │
                         │ status       │         │ riot_id      │
                         │ delivery_*   │         │ riot_pass... │
                         └──────────────┘         │ credentials..│
                                                  └──────────────┘
```

## 🆕 New Fields in `trades` Table

### Before Escrow Implementation:
```sql
CREATE TABLE trades (
  id TEXT PRIMARY KEY,
  account_id TEXT,
  buyer_id TEXT,
  seller_id TEXT,
  price INTEGER,
  platform_fee INTEGER,
  total_amount INTEGER,
  status TEXT DEFAULT 'pending_payment',
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  account_email TEXT,
  account_password TEXT,
  security_code TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### After Escrow Implementation:
```sql
CREATE TABLE trades (
  -- Existing fields (unchanged)
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  buyer_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  price INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_id TEXT,
  payment_order_id TEXT,
  payment_signature TEXT,
  
  -- 🆕 NEW: Riot Account Credentials (Encrypted)
  riot_id TEXT,                          -- Riot username (Name#Tag)
  riot_password_encrypted TEXT,          -- AES-256-GCM encrypted password
  
  -- 🆕 NEW: Escrow Workflow Tracking
  credentials_submitted_at TIMESTAMPTZ,  -- When seller submitted
  credentials_locked BOOLEAN DEFAULT FALSE, -- Lock status
  buyer_confirmed_at TIMESTAMPTZ,        -- When buyer confirmed
  seller_notified_at TIMESTAMPTZ,        -- When seller was notified
  
  -- Existing: Account Delivery Info (from listing)
  account_email TEXT,                    -- Account email
  account_password TEXT,                 -- Account password
  security_code TEXT,                    -- Security code
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 📝 Field Descriptions

### 🔐 Encrypted Credential Fields

#### `riot_id` (TEXT)
- **Purpose**: Stores the Riot account username
- **Format**: `PlayerName#1234` (Name#Tag)
- **Visibility**: Seller can see their submitted ID
- **Example**: `"ProGamer#NA1"`

#### `riot_password_encrypted` (TEXT)
- **Purpose**: Stores encrypted Riot account password
- **Format**: `iv:authTag:encryptedData` (hex encoded)
- **Encryption**: AES-256-GCM
- **Example**: `"a1b2c3d4e5f6....:f7e8d9c0b1a2....:9f8e7d6c5b4a...."`
- **Visibility**: Never shown in plaintext, decrypted only for buyer

### 📅 Timestamp Fields

#### `credentials_submitted_at` (TIMESTAMPTZ)
- **Purpose**: Records when seller submitted credentials
- **Set by**: Server when seller submits form
- **Example**: `2026-04-19 14:30:00+00`
- **Used for**: Audit trail, SLA tracking

#### `seller_notified_at` (TIMESTAMPTZ)
- **Purpose**: Records when seller was notified of payment
- **Set by**: Server after payment verification
- **Example**: `2026-04-19 14:15:00+00`
- **Used for**: Notification tracking, debugging

#### `buyer_confirmed_at` (TIMESTAMPTZ)
- **Purpose**: Records when buyer confirmed receipt
- **Set by**: Server when buyer clicks confirm
- **Example**: `2026-04-19 15:00:00+00`
- **Used for**: Payment release trigger, audit trail

### 🔒 Status Fields

#### `credentials_locked` (BOOLEAN)
- **Purpose**: Indicates if credentials are in locked state
- **Default**: `FALSE`
- **Set to TRUE**: When seller submits credentials
- **Set to FALSE**: Never (remains locked until trade completes)
- **Used for**: Access control, security checks

## 🔄 Data Flow Through Database

### Stage 1: Trade Creation
```sql
INSERT INTO trades (
  id, account_id, buyer_id, seller_id,
  price, platform_fee, total_amount,
  status, payment_status, payment_order_id
) VALUES (
  'trade-uuid-123',
  'account-uuid-456',
  'buyer-uuid-789',
  'seller-uuid-012',
  5000,  -- ₹5000
  250,   -- 5% fee
  5250,  -- Total
  'pending_payment',
  'pending',
  'order_razorpay_xyz'
);
```

**Database State:**
```
┌─────────────────────────────────────────────────────────────┐
│ Trade Record Created                                         │
├─────────────────────────────────────────────────────────────┤
│ id: trade-uuid-123                                          │
│ status: pending_payment                                     │
│ payment_status: pending                                     │
│ riot_id: NULL                                               │
│ riot_password_encrypted: NULL                               │
│ credentials_locked: FALSE                                   │
│ credentials_submitted_at: NULL                              │
│ seller_notified_at: NULL                                    │
│ buyer_confirmed_at: NULL                                    │
└─────────────────────────────────────────────────────────────┘
```

### Stage 2: Payment Verified
```sql
UPDATE trades 
SET 
  payment_status = 'completed',
  payment_id = 'pay_razorpay_abc',
  payment_method = 'upi',
  payment_signature = 'signature_xyz',
  status = 'awaiting_credentials',
  seller_notified_at = NOW(),
  updated_at = NOW()
WHERE id = 'trade-uuid-123';
```

**Database State:**
```
┌─────────────────────────────────────────────────────────────┐
│ Payment Secured in Escrow                                   │
├─────────────────────────────────────────────────────────────┤
│ id: trade-uuid-123                                          │
│ status: awaiting_credentials ⬅️ CHANGED                     │
│ payment_status: completed ⬅️ CHANGED                        │
│ payment_id: pay_razorpay_abc ⬅️ NEW                         │
│ seller_notified_at: 2026-04-19 14:15:00 ⬅️ NEW             │
│ riot_id: NULL                                               │
│ riot_password_encrypted: NULL                               │
│ credentials_locked: FALSE                                   │
└─────────────────────────────────────────────────────────────┘
```

### Stage 3: Seller Submits Credentials
```sql
-- Encryption happens in application layer
-- Input: riotPassword = "MySecurePass123!"
-- Output: encrypted = "a1b2c3....:f7e8d9....:9f8e7d...."

UPDATE trades 
SET 
  riot_id = 'ProGamer#NA1',
  riot_password_encrypted = 'a1b2c3d4e5f6....:f7e8d9c0b1a2....:9f8e7d6c5b4a....',
  credentials_submitted_at = NOW(),
  credentials_locked = TRUE,
  status = 'credentials_locked',
  account_email = 'account@email.com',      -- From accounts table
  account_password = 'accountpass123',      -- From accounts table
  security_code = 'GCX-ABC123',             -- From accounts table
  updated_at = NOW()
WHERE id = 'trade-uuid-123';
```

**Database State:**
```
┌─────────────────────────────────────────────────────────────┐
│ Credentials Encrypted & Locked                              │
├─────────────────────────────────────────────────────────────┤
│ id: trade-uuid-123                                          │
│ status: credentials_locked ⬅️ CHANGED                       │
│ riot_id: ProGamer#NA1 ⬅️ NEW                                │
│ riot_password_encrypted: a1b2c3d4e5f6.... ⬅️ NEW (ENCRYPTED)│
│ credentials_submitted_at: 2026-04-19 14:30:00 ⬅️ NEW       │
│ credentials_locked: TRUE ⬅️ CHANGED                         │
│ account_email: account@email.com ⬅️ NEW                     │
│ account_password: accountpass123 ⬅️ NEW                     │
│ security_code: GCX-ABC123 ⬅️ NEW                            │
└─────────────────────────────────────────────────────────────┘
```

### Stage 4: Credentials Unlocked for Buyer
```sql
UPDATE trades 
SET 
  status = 'verify_access',
  updated_at = NOW()
WHERE id = 'trade-uuid-123';
```

**Database State:**
```
┌─────────────────────────────────────────────────────────────┐
│ Credentials Available for Buyer                             │
├─────────────────────────────────────────────────────────────┤
│ id: trade-uuid-123                                          │
│ status: verify_access ⬅️ CHANGED                            │
│ riot_id: ProGamer#NA1                                       │
│ riot_password_encrypted: a1b2c3d4e5f6.... (ENCRYPTED)      │
│ credentials_locked: TRUE (still locked, but viewable)      │
│ account_email: account@email.com                            │
│ account_password: accountpass123                            │
│ security_code: GCX-ABC123                                   │
│                                                             │
│ 🔓 Buyer can now view decrypted credentials                │
└─────────────────────────────────────────────────────────────┘
```

### Stage 5: Buyer Confirms Receipt
```sql
UPDATE trades 
SET 
  status = 'completed',
  buyer_confirmed_at = NOW(),
  updated_at = NOW()
WHERE id = 'trade-uuid-123';

-- Also update the account
UPDATE accounts 
SET 
  status = 'sold',
  updated_at = NOW()
WHERE id = 'account-uuid-456';
```

**Database State:**
```
┌─────────────────────────────────────────────────────────────┐
│ Trade Completed - Payment Released                          │
├─────────────────────────────────────────────────────────────┤
│ id: trade-uuid-123                                          │
│ status: completed ⬅️ CHANGED                                │
│ buyer_confirmed_at: 2026-04-19 15:00:00 ⬅️ NEW             │
│ riot_id: ProGamer#NA1                                       │
│ riot_password_encrypted: a1b2c3d4e5f6.... (ENCRYPTED)      │
│ credentials_locked: TRUE                                    │
│ credentials_submitted_at: 2026-04-19 14:30:00              │
│ seller_notified_at: 2026-04-19 14:15:00                    │
│                                                             │
│ ✅ Trade complete, payment released to seller              │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Query Examples

### Check Trade Status
```sql
SELECT 
  id,
  status,
  payment_status,
  credentials_locked,
  credentials_submitted_at,
  seller_notified_at,
  buyer_confirmed_at
FROM trades
WHERE id = 'trade-uuid-123';
```

**Result:**
```
┌─────────────────┬─────────────────────┬────────────────┬────────────────────┐
│ id              │ status              │ payment_status │ credentials_locked │
├─────────────────┼─────────────────────┼────────────────┼────────────────────┤
│ trade-uuid-123  │ credentials_locked  │ completed      │ TRUE               │
└─────────────────┴─────────────────────┴────────────────┴────────────────────┘
```

### Get Seller's Pending Actions
```sql
SELECT 
  t.id,
  t.status,
  a.rank,
  a.level,
  t.price,
  t.seller_notified_at
FROM trades t
JOIN accounts a ON a.id = t.account_id
WHERE t.seller_id = 'seller-uuid-012'
  AND t.status = 'awaiting_credentials'
ORDER BY t.seller_notified_at DESC;
```

**Result:**
```
┌─────────────────┬─────────────────────┬──────────────┬───────┬─────────┐
│ id              │ status              │ rank         │ level │ price   │
├─────────────────┼─────────────────────┼──────────────┼───────┼─────────┤
│ trade-uuid-123  │ awaiting_credentials│ Immortal 3   │ 150   │ 5000    │
└─────────────────┴─────────────────────┴──────────────┴───────┴─────────┘
```

### Get Buyer's Available Credentials
```sql
SELECT 
  t.id,
  t.status,
  t.riot_id,
  t.account_email,
  t.account_password,
  t.security_code,
  a.rank
FROM trades t
JOIN accounts a ON a.id = t.account_id
WHERE t.buyer_id = 'buyer-uuid-789'
  AND t.status = 'verify_access';
```

**Result:**
```
┌─────────────────┬──────────────┬─────────────────┬────────────────────┐
│ id              │ status       │ riot_id         │ account_email      │
├─────────────────┼──────────────┼─────────────────┼────────────────────┤
│ trade-uuid-123  │ verify_access│ ProGamer#NA1    │ account@email.com  │
└─────────────────┴──────────────┴─────────────────┴────────────────────┘
```

## 🔐 Encryption in Database

### How Encrypted Data Looks

**Plaintext Password:**
```
MySecurePass123!
```

**Stored in Database:**
```
a1b2c3d4e5f67890:f7e8d9c0b1a23456:9f8e7d6c5b4a3210abcdef1234567890
│                 │                 │
│                 │                 └─ Encrypted password (hex)
│                 └─ Authentication tag (16 bytes hex)
└─ Initialization vector (16 bytes hex)
```

### Encryption Process
```
1. Generate random IV (16 bytes)
   IV = crypto.randomBytes(16)
   
2. Create cipher with AES-256-GCM
   cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
   
3. Encrypt password
   encrypted = cipher.update('MySecurePass123!', 'utf8', 'hex')
   encrypted += cipher.final('hex')
   
4. Get authentication tag
   authTag = cipher.getAuthTag()
   
5. Combine and store
   stored = iv.toString('hex') + ':' + 
            authTag.toString('hex') + ':' + 
            encrypted
```

### Decryption Process (Only for Authorized Buyer)
```
1. Parse stored value
   [iv, authTag, encrypted] = stored.split(':')
   
2. Create decipher
   decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
   
3. Set authentication tag
   decipher.setAuthTag(authTag)
   
4. Decrypt
   decrypted = decipher.update(encrypted, 'hex', 'utf8')
   decrypted += decipher.final('utf8')
   
5. Return plaintext
   return 'MySecurePass123!'
```

## 📊 Database Indexes (Recommended)

```sql
-- Speed up trade lookups by status
CREATE INDEX idx_trades_status ON trades(status);

-- Speed up seller's pending actions
CREATE INDEX idx_trades_seller_status ON trades(seller_id, status);

-- Speed up buyer's active trades
CREATE INDEX idx_trades_buyer_status ON trades(buyer_id, status);

-- Speed up payment lookups
CREATE INDEX idx_trades_payment_id ON trades(payment_id);
```

## 🔍 Monitoring Queries

### Count Trades by Status
```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(total_amount) as total_value
FROM trades
GROUP BY status
ORDER BY count DESC;
```

### Average Time to Submit Credentials
```sql
SELECT 
  AVG(EXTRACT(EPOCH FROM (credentials_submitted_at - seller_notified_at))/60) 
    as avg_minutes
FROM trades
WHERE credentials_submitted_at IS NOT NULL
  AND seller_notified_at IS NOT NULL;
```

### Trades Awaiting Action
```sql
SELECT 
  status,
  COUNT(*) as pending_count,
  MIN(created_at) as oldest_trade
FROM trades
WHERE status IN ('awaiting_credentials', 'verify_access')
GROUP BY status;
```

## 🚨 Important Notes

1. **Never query `riot_password_encrypted` directly** - Always decrypt through application layer
2. **Credentials are immutable** - Once submitted, they cannot be changed
3. **Timestamps are in UTC** - Convert to local timezone in application
4. **Status transitions are one-way** - Cannot go backwards in workflow
5. **Encryption key must remain constant** - Changing key breaks all encrypted data

## 🔒 Security Considerations

- ✅ Encrypted passwords never appear in logs
- ✅ Database backups contain encrypted data
- ✅ Only authorized API endpoints can decrypt
- ✅ Audit trail tracks all credential access
- ✅ Failed decryption attempts should be logged
- ✅ Regular key rotation recommended (with re-encryption)

---

**Database**: PostgreSQL (Neon)
**Encryption**: AES-256-GCM
**Status**: Production Ready
