# Quick Setup Guide: Escrow System

## Prerequisites
- Node.js installed
- PostgreSQL database configured
- Existing GameXchange installation

## Step-by-Step Setup

### 1. Update Database Schema

Run the migration script to add new escrow fields:

```bash
cd GameXchange_2.0
node migrate-escrow-schema.js
```

Expected output:
```
🔄 Starting escrow schema migration...
✅ Successfully added new columns to trades table
✅ Escrow schema migration completed successfully!
```

### 2. Generate Encryption Key

Generate a secure encryption key for credential storage:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (64-character hex string).

### 3. Update Environment Variables

Add to your `.env` file:

```bash
# REQUIRED: Encryption key for credential storage
ENCRYPTION_KEY=paste-your-generated-key-here

# RECOMMENDED: Email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=GameXchange <noreply@gamexchange.com>
```

### 4. Install Dependencies (if needed)

The encryption module uses built-in Node.js crypto, but ensure all dependencies are installed:

```bash
npm install
```

### 5. Restart the Server

```bash
npm run dev
```

### 6. Verify Installation

Check the server logs for:
```
✅ Razorpay payment gateway initialized (or dev mode message)
✅ Email service configured (or dev mode message)
⚠️  [SECURITY WARNING] ENCRYPTION_KEY not set (if you forgot step 3)
```

## Testing the Escrow Flow

### Quick Test Scenario

1. **Create a seller account**
   - Sign up as "Seller User"
   - List a Valorant account for sale

2. **Create a buyer account**
   - Sign up as "Buyer User"
   - Purchase the listed account
   - Complete payment (use Razorpay test mode)

3. **Seller receives notification**
   - Check seller's email (if SMTP configured)
   - Or check server logs for dev mode notification
   - Seller logs in and sees "Awaiting Credentials" status

4. **Seller submits credentials**
   - Click on the trade
   - Submit Riot ID (format: Name#1234)
   - Submit account password
   - Credentials are encrypted and locked

5. **Buyer receives notification**
   - Check buyer's email
   - Buyer logs in and sees "Verify Access" status
   - Buyer can view and copy credentials

6. **Buyer confirms**
   - Buyer verifies account access
   - Clicks "Confirm Account Received"
   - Trade completes, payment released

## Troubleshooting

### Migration Fails
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT NOW();"

# Verify trades table exists
psql $DATABASE_URL -c "\d trades"
```

### Encryption Errors
```
Error: Invalid encrypted data format
```
**Solution**: Ensure ENCRYPTION_KEY is set and hasn't changed

### Email Not Sending
```
[DEV MODE] Seller payment notification for user@example.com
```
**This is normal**: Without SMTP configured, emails are logged to console

### Payment Not Updating Trade
- Check Razorpay configuration
- Verify payment webhook (if using production)
- Check server logs for errors

## Development vs Production

### Development Mode
- ENCRYPTION_KEY: Optional (uses temporary key with warning)
- SMTP: Optional (logs to console)
- Razorpay: Optional (uses mock orders)

### Production Mode
- ENCRYPTION_KEY: **REQUIRED** (security critical)
- SMTP: **REQUIRED** (for notifications)
- Razorpay: **REQUIRED** (for real payments)

## Security Checklist

- [ ] ENCRYPTION_KEY is set and secure (64 hex characters)
- [ ] ENCRYPTION_KEY is not committed to git
- [ ] SMTP credentials are configured
- [ ] Razorpay keys are production keys (not test)
- [ ] DATABASE_URL uses SSL mode
- [ ] JWT_SECRET is changed from default
- [ ] CLIENT_ORIGIN is set to production domain
- [ ] HTTPS is enabled on production server

## Next Steps

1. Test the complete flow in development
2. Configure production environment variables
3. Deploy to production
4. Monitor first few transactions
5. Set up error alerting

## Support

For issues or questions:
- Check ESCROW_SYSTEM_GUIDE.md for detailed documentation
- Review server logs for error messages
- Contact development team

## Rollback (if needed)

If you need to rollback the changes:

```sql
-- Remove new columns (data will be lost!)
ALTER TABLE trades 
DROP COLUMN IF EXISTS riot_id,
DROP COLUMN IF EXISTS riot_password_encrypted,
DROP COLUMN IF EXISTS credentials_submitted_at,
DROP COLUMN IF EXISTS credentials_locked,
DROP COLUMN IF EXISTS buyer_confirmed_at,
DROP COLUMN IF EXISTS seller_notified_at;
```

**Warning**: This will delete all encrypted credentials. Only use in emergency.
