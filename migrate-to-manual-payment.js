import "dotenv/config";
import { pool, query } from "./server/db.js";

async function migrateToManualPayment() {
  console.log('🔄 Starting migration to manual payment system...');

  try {
    // Drop old columns
    await query(`
      ALTER TABLE trades 
      DROP COLUMN IF EXISTS payment_status,
      DROP COLUMN IF EXISTS payment_method,
      DROP COLUMN IF EXISTS payment_id,
      DROP COLUMN IF EXISTS payment_order_id,
      DROP COLUMN IF EXISTS payment_signature,
      DROP COLUMN IF EXISTS riot_password_encrypted,
      DROP COLUMN IF EXISTS credentials_locked,
      DROP COLUMN IF EXISTS account_email,
      DROP COLUMN IF EXISTS account_password,
      DROP COLUMN IF EXISTS security_code;
    `);

    console.log('✅ Removed old escrow/Razorpay columns');

    // Add new columns
    await query(`
      ALTER TABLE trades 
      ADD COLUMN IF NOT EXISTS payment_qr_code TEXT,
      ADD COLUMN IF NOT EXISTS payment_upi_id TEXT,
      ADD COLUMN IF NOT EXISTS payment_instructions TEXT,
      ADD COLUMN IF NOT EXISTS payment_reported_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS payment_reported_by TEXT,
      ADD COLUMN IF NOT EXISTS riot_id TEXT,
      ADD COLUMN IF NOT EXISTS riot_password TEXT,
      ADD COLUMN IF NOT EXISTS credentials_submitted_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS seller_notified_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS buyer_confirmed_at TIMESTAMPTZ;
    `);

    console.log('✅ Added new manual payment columns');

    // Update existing trades to new status flow
    await query(`
      UPDATE trades 
      SET status = 'pending_payment'
      WHERE status IN ('awaiting_credentials', 'credentials_locked', 'verify_access', 'pending_payment');
    `);

    console.log('✅ Updated existing trade statuses');

    console.log('');
    console.log('✅ Migration to manual payment system completed successfully!');
    console.log('');
    console.log('📝 Migration Summary:');
    console.log('   - Removed Razorpay payment columns');
    console.log('   - Removed encryption columns');
    console.log('   - Added manual payment fields (QR code, UPI ID)');
    console.log('   - Added payment reporting fields');
    console.log('   - Updated trade statuses to new flow');
    console.log('');
    console.log('🎯 New Trade Flow:');
    console.log('   1. pending_payment → Seller provides payment details');
    console.log('   2. payment_reported → Buyer reports payment completion');
    console.log('   3. credentials_shared → Seller shares Riot credentials');
    console.log('   4. completed → Buyer confirms receipt');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrateToManualPayment().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
