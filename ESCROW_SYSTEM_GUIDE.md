# GameXchange Escrow-Based Trade System

## Overview

The GameXchange platform now implements a comprehensive escrow-based trade workflow that ensures secure transactions between buyers and sellers. This system protects both parties by holding payments in escrow until all conditions are met and credentials are verified.

## Key Features

### 🔒 Secure Credential Storage
- Riot account credentials are encrypted using AES-256-GCM encryption
- Credentials are locked in an encrypted state until buyer verification
- Only authorized parties can access credentials at appropriate stages

### 💰 Payment Protection
- Buyer payments are held in escrow through Razorpay
- Payments are only released after buyer confirms successful account access
- Automatic refund support for disputed transactions

### 📧 Automated Notifications
- Sellers receive email notifications when payment is received
- Buyers receive notifications when credentials are ready
- Real-time dashboard updates for both parties

### 🔄 Multi-Stage Workflow
The trade progresses through clearly defined stages with transparency for both parties

## Trade Workflow

### Stage 1: Buyer Initiates Purchase
1. Buyer selects an account listing
2. Buyer proceeds to checkout
3. System creates a trade record with status `pending_payment`

### Stage 2: Payment Secured
1. Buyer completes payment through Razorpay
2. Payment is verified and held in escrow
3. Trade status updates to `awaiting_credentials`
4. **Seller receives email notification** with trade details
5. Seller dashboard shows action required

### Stage 3: Seller Submits Credentials
1. Seller logs into dashboard
2. Seller clicks on the trade requiring credentials
3. Seller submits:
   - Riot ID (Name#Tag format)
   - Account password
4. System encrypts credentials using AES-256-GCM
5. Trade status updates to `credentials_locked`
6. **Buyer receives email notification** that credentials are ready

### Stage 4: Credentials Released to Buyer
1. System automatically unlocks credentials for buyer viewing
2. Trade status updates to `verify_access`
3. Buyer can view:
   - Email address
   - Account password
   - Security code
4. Buyer logs into the account to verify

### Stage 5: Buyer Confirms Access
1. Buyer verifies account matches listing
2. Buyer clicks "Confirm Account Received"
3. Trade status updates to `completed`
4. Account marked as `sold`
5. **Payment released to seller**

## Security Features

### Encryption
- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Management**: Environment variable `ENCRYPTION_KEY`
- **IV**: Randomly generated 16-byte initialization vector per encryption
- **Authentication**: 16-byte authentication tag for integrity verification

### Access Control
- Credentials only visible to authorized party at correct stage
- Buyers cannot see credentials until seller submits them
- Sellers cannot see buyer payment details
- Encrypted credentials cannot be decrypted without proper key

### Fraud Prevention
- Payment held in escrow prevents seller fraud
- Locked credentials prevent premature access
- Buyer confirmation required before payment release
- Dispute resolution system for problematic trades

## Database Schema

### New Trade Fields

```sql
-- Riot account credentials
riot_id TEXT                      -- Riot ID in Name#Tag format
riot_password_encrypted TEXT      -- AES-256-GCM encrypted password

-- Escrow workflow tracking
credentials_submitted_at TIMESTAMPTZ  -- When seller submitted credentials
credentials_locked BOOLEAN            -- Whether credentials are locked
buyer_confirmed_at TIMESTAMPTZ        -- When buyer confirmed receipt
seller_notified_at TIMESTAMPTZ        -- When seller was notified of payment

-- Existing fields for account delivery
account_email TEXT                -- Account email (from listing)
account_password TEXT             -- Account password (from listing)
security_code TEXT                -- Security/verification code
```

## API Endpoints

### POST /api/trades/:id/submit-credentials
**Seller submits Riot account credentials**

Request:
```json
{
  "riotId": "PlayerName#1234",
  "riotPassword": "securePassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Credentials submitted and locked successfully. Buyer has been notified.",
  "trade": {
    "id": "trade-uuid",
    "status": "credentials_locked",
    "credentials_locked": true
  }
}
```

### POST /api/trades/:id/unlock-credentials
**System unlocks credentials for buyer viewing**

Response:
```json
{
  "success": true,
  "message": "Credentials unlocked. Buyer can now access them.",
  "trade": {
    "id": "trade-uuid",
    "status": "verify_access"
  }
}
```

### POST /api/trades/:id/verify-payment
**Updated to notify seller after payment**

Now includes:
- Seller email notification
- Trade status set to `awaiting_credentials`
- Seller notified timestamp recorded

## Email Notifications

### Seller Payment Notification
**Sent when**: Buyer completes payment
**Contains**:
- Trade details (account rank, level, price)
- Payment amount
- Link to dashboard
- Instructions to submit credentials

### Buyer Credentials Ready Notification
**Sent when**: Seller submits credentials
**Contains**:
- Account details
- Link to view credentials
- Instructions to verify access
- Reminder about escrow protection

## Environment Variables

### Required for Production

```bash
# Encryption key for credential storage (CRITICAL)
ENCRYPTION_KEY=your-64-character-hex-key

# Email configuration (for notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@gamexchange.com

# Payment gateway
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Application
CLIENT_ORIGIN=https://your-domain.com
JWT_SECRET=your-jwt-secret
```

### Generating Encryption Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Setup Instructions

### 1. Run Database Migration

```bash
cd GameXchange_2.0
node migrate-escrow-schema.js
```

This adds the new columns to the trades table.

### 2. Set Environment Variables

Add to your `.env` file:

```bash
ENCRYPTION_KEY=your-generated-key-here
```

### 3. Restart Server

```bash
npm run dev
```

## Trade Status Flow

```
pending_payment
    ↓ (buyer pays)
awaiting_credentials
    ↓ (seller submits)
credentials_locked
    ↓ (system unlocks)
verify_access
    ↓ (buyer confirms)
completed
```

## UI Components

### SellerCredentialsModal
- Form for submitting Riot ID and password
- Password visibility toggle
- Validation for Riot ID format (Name#Tag)
- Confirmation dialog before submission
- Security warnings and escrow information

### TradeDetailModal (Updated)
- Shows different views for buyers vs sellers
- Displays escrow progress stages
- Credential viewing for buyers
- Action buttons based on trade status
- Copy-to-clipboard for credentials

### ActiveTrades (Updated)
- New status badges for escrow stages
- Color-coded status indicators
- Automatic modal routing based on trade type and status

## Testing the Escrow Flow

### As a Seller:
1. List an account for sale
2. Wait for buyer to purchase
3. Check email for payment notification
4. Go to dashboard → Active Trades
5. Click on trade awaiting credentials
6. Submit Riot ID and password
7. Verify credentials are locked
8. Wait for buyer confirmation
9. Receive payment when buyer confirms

### As a Buyer:
1. Browse marketplace
2. Select and purchase an account
3. Complete Razorpay payment
4. Wait for seller to submit credentials
5. Check email for credentials ready notification
6. Go to dashboard → Active Trades
7. View and copy credentials
8. Log into Riot account to verify
9. Confirm receipt to complete trade

## Security Best Practices

### For Deployment:
1. ✅ Always use HTTPS in production
2. ✅ Set strong ENCRYPTION_KEY (64 hex characters)
3. ✅ Rotate encryption keys periodically
4. ✅ Enable email notifications
5. ✅ Monitor failed decryption attempts
6. ✅ Implement rate limiting on credential endpoints
7. ✅ Log all credential access attempts
8. ✅ Use secure session management

### For Users:
1. ✅ Change account passwords after purchase
2. ✅ Enable 2FA on purchased accounts
3. ✅ Verify account details before confirming
4. ✅ Report suspicious activity immediately
5. ✅ Never share credentials outside platform

## Troubleshooting

### Credentials Won't Decrypt
- Check ENCRYPTION_KEY is set correctly
- Verify key hasn't changed since encryption
- Check database for corrupted encrypted data

### Email Notifications Not Sending
- Verify SMTP settings in .env
- Check email service logs
- Ensure SMTP_FROM is authorized sender

### Payment Not Updating Status
- Check Razorpay webhook configuration
- Verify payment signature validation
- Check server logs for errors

## Support and Disputes

If issues arise during a trade:
1. Contact support immediately
2. Provide trade ID
3. Describe the issue in detail
4. Support team can review trade status
5. Refunds can be initiated if necessary

## Future Enhancements

- [ ] Automated dispute resolution system
- [ ] Multi-signature escrow for high-value trades
- [ ] Reputation system for buyers and sellers
- [ ] Automated account verification
- [ ] Support for multiple games
- [ ] Escrow time limits with automatic actions
- [ ] Partial refunds for disputed items

## Conclusion

The escrow-based trade system provides a secure, transparent, and automated workflow for buying and selling gaming accounts. By holding payments in escrow and encrypting credentials, both buyers and sellers are protected throughout the transaction process.

For questions or issues, please contact support@gamexchange.com
