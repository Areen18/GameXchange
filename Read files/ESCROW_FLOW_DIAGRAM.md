# Escrow Trade Flow - Visual Diagram

## Complete Trade Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ESCROW TRADE WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   BUYER      │
│  Browses     │
│ Marketplace  │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Selects Account     │
│  Clicks "Buy Now"    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    STAGE 1: PAYMENT                               │
│  Status: pending_payment                                          │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Buyer completes Razorpay checkout                     │      │
│  │  Payment verified and held in escrow                   │      │
│  └────────────────────────────────────────────────────────┘      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                STAGE 2: SELLER NOTIFICATION                       │
│  Status: awaiting_credentials                                     │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  ✉️  Seller receives email notification                │      │
│  │  📧  "Payment Received - Submit Credentials"           │      │
│  │  💰  Payment amount: ₹X,XXX                            │      │
│  │  🔗  Link to dashboard                                 │      │
│  └────────────────────────────────────────────────────────┘      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│   SELLER     │
│  Logs into   │
│  Dashboard   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│              STAGE 3: CREDENTIAL SUBMISSION                       │
│  Status: awaiting_credentials → credentials_locked                │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Seller clicks on trade                                │      │
│  │  Opens SellerCredentialsModal                          │      │
│  │  Enters:                                               │      │
│  │    • Riot ID (Name#Tag)                                │      │
│  │    • Account Password                                  │      │
│  │  Confirms submission                                   │      │
│  └────────────────────────────────────────────────────────┘      │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  🔐 ENCRYPTION PROCESS                                 │      │
│  │  ─────────────────────────                             │      │
│  │  1. Generate random IV (16 bytes)                      │      │
│  │  2. Encrypt password with AES-256-GCM                  │      │
│  │  3. Generate auth tag (16 bytes)                       │      │
│  │  4. Store: iv:authTag:encrypted                        │      │
│  │  5. Lock credentials in database                       │      │
│  └────────────────────────────────────────────────────────┘      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│               STAGE 4: BUYER NOTIFICATION                         │
│  Status: credentials_locked                                       │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  ✉️  Buyer receives email notification                 │      │
│  │  📧  "Credentials Ready - Verify Access"               │      │
│  │  🎮  Account details                                   │      │
│  │  🔗  Link to view credentials                          │      │
│  └────────────────────────────────────────────────────────┘      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│   BUYER      │
│  Logs into   │
│  Dashboard   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│            STAGE 5: CREDENTIAL UNLOCK & VIEWING                   │
│  Status: credentials_locked → verify_access                       │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  System automatically unlocks credentials              │      │
│  │  Buyer clicks on trade                                 │      │
│  │  Opens TradeDetailModal                                │      │
│  │  Views credentials:                                    │      │
│  │    • Email Address                                     │      │
│  │    • Password                                          │      │
│  │    • Security Code                                     │      │
│  │  Copy to clipboard buttons available                   │      │
│  └────────────────────────────────────────────────────────┘      │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  🔓 DECRYPTION PROCESS                                 │      │
│  │  ─────────────────────────                             │      │
│  │  1. Parse iv:authTag:encrypted                         │      │
│  │  2. Verify auth tag                                    │      │
│  │  3. Decrypt with AES-256-GCM                           │      │
│  │  4. Return plaintext password                          │      │
│  │  5. Display to buyer only                              │      │
│  └────────────────────────────────────────────────────────┘      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────┐
│   BUYER              │
│  Logs into Riot      │
│  Verifies Account    │
│  Checks Rank/Skins   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│              STAGE 6: BUYER CONFIRMATION                          │
│  Status: verify_access → completed                                │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Buyer clicks "Confirm Account Received"               │      │
│  │  Confirmation dialog appears                           │      │
│  │  Buyer confirms receipt                                │      │
│  └────────────────────────────────────────────────────────┘      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                  STAGE 7: COMPLETION                              │
│  Status: completed                                                │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  ✅ Trade marked as completed                          │      │
│  │  💰 Payment released to seller                         │      │
│  │  🔒 Account marked as sold                             │      │
│  │  📊 Transaction recorded                               │      │
│  └────────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────────┘

                            🎉 TRADE COMPLETE 🎉
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────┘

Layer 1: PAYMENT ESCROW
┌──────────────────────────────────────────────────────┐
│  💰 Razorpay Payment Gateway                         │
│  • Payment held in escrow                            │
│  • Released only after buyer confirmation            │
│  • Refund support for disputes                       │
└──────────────────────────────────────────────────────┘
                        ↓
Layer 2: CREDENTIAL ENCRYPTION
┌──────────────────────────────────────────────────────┐
│  🔐 AES-256-GCM Encryption                           │
│  • 256-bit encryption key                            │
│  • Random IV per encryption                          │
│  • Authentication tag for integrity                  │
│  • Secure key storage (env variable)                 │
└──────────────────────────────────────────────────────┘
                        ↓
Layer 3: ACCESS CONTROL
┌──────────────────────────────────────────────────────┐
│  🛡️ Role-Based Access                                │
│  • Sellers see only their submitted credentials      │
│  • Buyers see credentials only after unlock          │
│  • Status-based visibility rules                     │
│  • JWT authentication required                       │
└──────────────────────────────────────────────────────┘
                        ↓
Layer 4: AUDIT TRAIL
┌──────────────────────────────────────────────────────┐
│  📝 Timestamp Tracking                               │
│  • credentials_submitted_at                          │
│  • seller_notified_at                                │
│  • buyer_confirmed_at                                │
│  • Complete transaction history                      │
└──────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      DATA FLOW DIAGRAM                       │
└─────────────────────────────────────────────────────────────┘

SELLER SIDE:
┌──────────┐    Submit      ┌──────────┐    Encrypt    ┌──────────┐
│  Seller  │ ────────────> │  Server  │ ───────────> │ Database │
│  Browser │   Riot ID +    │  API     │   AES-256    │ (Neon)   │
└──────────┘   Password     └──────────┘              └──────────┘
                                  │
                                  │ Send Email
                                  ▼
                            ┌──────────┐
                            │  SMTP    │
                            │  Server  │
                            └──────────┘
                                  │
                                  ▼
                            ┌──────────┐
                            │  Buyer   │
                            │  Email   │
                            └──────────┘

BUYER SIDE:
┌──────────┐    Request     ┌──────────┐    Decrypt    ┌──────────┐
│  Buyer   │ ────────────> │  Server  │ <───────────  │ Database │
│  Browser │   View Creds   │  API     │   AES-256    │ (Neon)   │
└──────────┘                └──────────┘              └──────────┘
     ▲                            │
     │                            │
     └────────────────────────────┘
          Display Credentials
```

## Status Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                   STATUS STATE MACHINE                       │
└─────────────────────────────────────────────────────────────┘

    [pending_payment]
           │
           │ Buyer pays
           ▼
  [awaiting_credentials] ◄─── Seller notified via email
           │
           │ Seller submits
           ▼
   [credentials_locked] ◄──── Credentials encrypted
           │
           │ System unlocks
           ▼
     [verify_access] ◄──────── Buyer notified via email
           │
           │ Buyer confirms
           ▼
      [completed] ◄─────────── Payment released

Alternative paths:
  [pending_payment] ──► [cancelled] (buyer cancels before payment)
  [verify_access] ──► [disputed] (buyer reports issue)
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                  COMPONENT ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────┘

Frontend Components:
┌────────────────────────────────────────────────────────┐
│  ValorantMarketplace (Main Container)                  │
│  ├─ ActiveTrades (Trade List)                          │
│  │  └─ Trade Cards with Status Badges                  │
│  ├─ TradeDetailModal (View Trade)                      │
│  │  ├─ Escrow Progress Display                         │
│  │  ├─ Credential Display (Buyer)                      │
│  │  └─ Confirmation Button                             │
│  └─ SellerCredentialsModal (Submit Credentials)        │
│     ├─ Riot ID Input                                   │
│     ├─ Password Input (with toggle)                    │
│     └─ Confirmation Dialog                             │
└────────────────────────────────────────────────────────┘
                        │
                        │ API Calls
                        ▼
Backend Services:
┌────────────────────────────────────────────────────────┐
│  Express Server (server/index.js)                      │
│  ├─ POST /api/trades/:id/verify-payment               │
│  ├─ POST /api/trades/:id/submit-credentials           │
│  ├─ POST /api/trades/:id/unlock-credentials           │
│  └─ PATCH /api/trades/:id/confirm                     │
└────────────────────────────────────────────────────────┘
                        │
                        ├─────────────────┬──────────────┐
                        ▼                 ▼              ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │  Encryption  │  │    Email     │  │   Database   │
            │   Service    │  │   Service    │  │   (Neon)     │
            │ (AES-256)    │  │   (SMTP)     │  │ (PostgreSQL) │
            └──────────────┘  └──────────────┘  └──────────────┘
```

## Email Notification Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  EMAIL NOTIFICATION FLOW                     │
└─────────────────────────────────────────────────────────────┘

Payment Verified:
┌──────────┐    Trigger     ┌──────────┐    Send      ┌──────────┐
│  Server  │ ────────────> │  Email   │ ──────────> │  Seller  │
│   API    │   Seller       │  Service │   Payment   │  Inbox   │
└──────────┘   Notification └──────────┘   Received   └──────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │ Email Contains:  │
                                    │ • Trade details  │
                                    │ • Payment amount │
                                    │ • Dashboard link │
                                    │ • Instructions   │
                                    └──────────────────┘

Credentials Submitted:
┌──────────┐    Trigger     ┌──────────┐    Send      ┌──────────┐
│  Server  │ ────────────> │  Email   │ ──────────> │  Buyer   │
│   API    │   Buyer        │  Service │   Creds     │  Inbox   │
└──────────┘   Notification └──────────┘   Ready      └──────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │ Email Contains:  │
                                    │ • Account info   │
                                    │ • Dashboard link │
                                    │ • Verify reminder│
                                    │ • Escrow info    │
                                    └──────────────────┘
```

---

**Legend:**
- 📧 Email notification
- 🔐 Encryption
- 🔓 Decryption
- 💰 Payment
- ✅ Completed
- 🛡️ Security
- 📝 Audit
- 🎮 Gaming account
