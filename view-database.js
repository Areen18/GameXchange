import 'dotenv/config';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Configure WebSocket for Neon
import { neonConfig } from '@neondatabase/serverless';
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function viewDatabase() {
  console.log('\n🗄️  GAMEXCHANGE DATABASE VIEWER\n');
  console.log('=' .repeat(80));

  try {
    // View Users
    console.log('\n👥 USERS:');
    console.log('-'.repeat(80));
    const users = await pool.query(`
      SELECT id, email, full_name, email_verified, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    console.table(users.rows);

    // View Accounts
    console.log('\n🎮 ACCOUNTS (Listings):');
    console.log('-'.repeat(80));
    const accounts = await pool.query(`
      SELECT 
        a.id,
        a.rank,
        a.level,
        a.skins,
        a.region,
        a.price,
        a.status,
        u.full_name as seller_name,
        a.created_at
      FROM accounts a
      JOIN users u ON u.id = a.seller_id
      ORDER BY a.created_at DESC
    `);
    console.table(accounts.rows);

    // View Trades
    console.log('\n💰 TRADES:');
    console.log('-'.repeat(80));
    const trades = await pool.query(`
      SELECT 
        t.id,
        t.status,
        t.total_amount,
        buyer.full_name as buyer_name,
        seller.full_name as seller_name,
        a.rank as account_rank,
        t.created_at
      FROM trades t
      JOIN users buyer ON buyer.id = t.buyer_id
      JOIN users seller ON seller.id = t.seller_id
      JOIN accounts a ON a.id = t.account_id
      ORDER BY t.created_at DESC
    `);
    console.table(trades.rows);

    // Statistics
    console.log('\n📊 STATISTICS:');
    console.log('-'.repeat(80));
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM accounts WHERE status = 'active') as active_listings,
        (SELECT COUNT(*) FROM accounts WHERE status = 'sold') as sold_listings,
        (SELECT COUNT(*) FROM trades WHERE status = 'completed') as completed_trades,
        (SELECT COUNT(*) FROM trades WHERE status = 'pending_payment') as pending_trades,
        (SELECT COALESCE(SUM(total_amount), 0) FROM trades WHERE status = 'completed') as total_revenue
    `);
    console.table(stats.rows);

    console.log('\n✅ Database view complete!\n');
  } catch (error) {
    console.error('❌ Error viewing database:', error.message);
  } finally {
    await pool.end();
  }
}

viewDatabase();
