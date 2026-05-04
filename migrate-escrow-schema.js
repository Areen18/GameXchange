import "dotenv/config";
import { pool, query } from "./server/db.js";

async function migrateEscrowSchema() {
  console.log('🔄 Starting escrow schema migration...');

  try {
    // Add new columns to trades table
    await query(`
      ALTER TABLE trades 
      ADD COLUMN IF NOT EXISTS riot_id TEXT,
      ADD COLUMN IF NOT EXISTS riot_password_encrypted TEXT,
      ADD COLUMN IF NOT EXISTS credentials_submitted_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS credentials_locked BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS buyer_confirmed_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS seller_notified_at TIMESTAMPTZ;
    `);

    console.log('✅ Successfully added new columns to trades table');

    // Update existing trades with pending_payment status to awaiting_credentials if payment is completed
    const result = await query(`
      UPDATE trades 
      SET status = 'awaiting_credentials'
      WHERE status = 'verify_access' 
      AND payment_status = 'completed'
      AND account_email IS NOT NULL
      RETURNING id;
    `);

    if (result.rowCount > 0) {
      console.log(`✅ Updated ${result.rowCount} existing trades to new status flow`);
    }

    console.log('✅ Escrow schema migration completed successfully!');
    console.log('');
    console.log('📝 Migration Summary:');
    console.log('   - Added riot_id column for Riot account username');
    console.log('   - Added riot_password_encrypted column for encrypted passwords');
    console.log('   - Added credentials_submitted_at timestamp');
    console.log('   - Added credentials_locked boolean flag');
    console.log('   - Added buyer_confirmed_at timestamp');
    console.log('   - Added seller_notified_at timestamp');
    console.log('');
    console.log('⚠️  Important: Set ENCRYPTION_KEY environment variable for production!');
    console.log('   Generate a secure key: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrateEscrowSchema().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
