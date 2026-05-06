#!/usr/bin/env node
/**
 * Database Connection Test Script
 * 
 * This script tests your Neon PostgreSQL database connection.
 * Run: node test-database-connection.js
 */

import dotenv from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Load environment variables
dotenv.config();

// Configure Neon to use WebSocket
neonConfig.webSocketConstructor = ws;

console.log('\n🔍 Testing Database Connection...\n');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env file!');
  console.error('\n📝 Please add DATABASE_URL to your .env file:');
  console.error('   DATABASE_URL=postgresql://user:password@host/database');
  console.error('\n📖 See: docs/DATABASE_CONNECTION_GUIDE.md\n');
  process.exit(1);
}

// Display connection info (hide password)
const dbUrl = new URL(process.env.DATABASE_URL);
console.log('📋 Database Configuration:');
console.log(`   Host: ${dbUrl.hostname}`);
console.log(`   Port: ${dbUrl.port || '5432'}`);
console.log(`   Database: ${dbUrl.pathname.slice(1)}`);
console.log(`   User: ${dbUrl.username}`);
console.log(`   Password: ${'*'.repeat(10)} (hidden)`);
console.log(`   SSL Mode: ${dbUrl.searchParams.get('sslmode') || 'prefer'}`);
console.log('');

// Create connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

async function testConnection() {
  let client;
  
  try {
    console.log('🔌 Attempting to connect to database...');
    
    // Get a client from the pool
    client = await pool.connect();
    console.log('✅ Database connection successful!\n');
    
    // Test 1: Check PostgreSQL version
    console.log('📊 Running diagnostic tests...\n');
    console.log('Test 1: PostgreSQL Version');
    const versionResult = await client.query('SELECT version()');
    const version = versionResult.rows[0].version;
    console.log(`   ✅ ${version.split(',')[0]}\n`);
    
    // Test 2: Check current timestamp
    console.log('Test 2: Server Time');
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log(`   ✅ Server time: ${timeResult.rows[0].current_time}\n`);
    
    // Test 3: Check database name
    console.log('Test 3: Current Database');
    const dbResult = await client.query('SELECT current_database()');
    console.log(`   ✅ Connected to: ${dbResult.rows[0].current_database}\n`);
    
    // Test 4: Check if tables exist
    console.log('Test 4: Table Structure');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  No tables found (database is empty)');
      console.log('   💡 Tables will be created when you start the server\n');
    } else {
      console.log(`   ✅ Found ${tablesResult.rows.length} tables:`);
      tablesResult.rows.forEach(row => {
        console.log(`      - ${row.table_name}`);
      });
      console.log('');
    }
    
    // Test 5: Check users table (if exists)
    try {
      const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
      console.log('Test 5: Users Table');
      console.log(`   ✅ Users table exists`);
      console.log(`   📊 Total users: ${usersResult.rows[0].count}\n`);
    } catch (error) {
      console.log('Test 5: Users Table');
      console.log('   ⚠️  Users table not found (will be created on first run)\n');
    }
    
    // Test 6: Check accounts table (if exists)
    try {
      const accountsResult = await client.query('SELECT COUNT(*) as count FROM accounts');
      console.log('Test 6: Accounts Table');
      console.log(`   ✅ Accounts table exists`);
      console.log(`   📊 Total accounts: ${accountsResult.rows[0].count}\n`);
    } catch (error) {
      console.log('Test 6: Accounts Table');
      console.log('   ⚠️  Accounts table not found (will be created on first run)\n');
    }
    
    // Test 7: Check trades table (if exists)
    try {
      const tradesResult = await client.query('SELECT COUNT(*) as count FROM trades');
      console.log('Test 7: Trades Table');
      console.log(`   ✅ Trades table exists`);
      console.log(`   📊 Total trades: ${tradesResult.rows[0].count}\n`);
    } catch (error) {
      console.log('Test 7: Trades Table');
      console.log('   ⚠️  Trades table not found (will be created on first run)\n');
    }
    
    // Test 8: Test write permissions
    console.log('Test 8: Write Permissions');
    try {
      await client.query('CREATE TEMP TABLE test_write (id INT)');
      await client.query('DROP TABLE test_write');
      console.log('   ✅ Write permissions verified\n');
    } catch (error) {
      console.log('   ❌ Write permissions failed');
      console.log(`   Error: ${error.message}\n`);
    }
    
    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ DATABASE CONNECTION TEST PASSED!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('Your database is properly configured and ready to use.');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Start your server: npm run dev');
    console.log('  2. Tables will be created automatically');
    console.log('  3. Seed data will be inserted');
    console.log('');
    
  } catch (error) {
    console.error('\n❌ DATABASE CONNECTION FAILED!');
    console.error('═══════════════════════════════════════════════════════\n');
    console.error('Error:', error.message);
    console.error('');
    
    // Provide specific troubleshooting based on error
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🔧 Troubleshooting: DNS/Host Resolution Error');
      console.error('   - Check your internet connection');
      console.error('   - Verify the database host is correct');
      console.error('   - Check if your firewall is blocking the connection');
      console.error('');
    } else if (error.message.includes('password authentication failed')) {
      console.error('🔧 Troubleshooting: Authentication Error');
      console.error('   - Check your database username');
      console.error('   - Verify your database password');
      console.error('   - Ensure DATABASE_URL is correct in .env');
      console.error('');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
      console.error('🔧 Troubleshooting: Connection Timeout');
      console.error('   - Check your internet connection');
      console.error('   - Verify firewall settings');
      console.error('   - Check if Neon database is active');
      console.error('   - Try again in a moment');
      console.error('');
    } else if (error.message.includes('SSL') || error.message.includes('certificate')) {
      console.error('🔧 Troubleshooting: SSL Certificate Error');
      console.error('   - Ensure sslmode=require is in DATABASE_URL');
      console.error('   - Check if your system trusts SSL certificates');
      console.error('');
    } else if (error.message.includes('does not exist')) {
      console.error('🔧 Troubleshooting: Database Does Not Exist');
      console.error('   - Verify the database name in DATABASE_URL');
      console.error('   - Check Neon dashboard for correct database name');
      console.error('');
    } else {
      console.error('🔧 Troubleshooting: General Error');
      console.error('   - Check DATABASE_URL format');
      console.error('   - Verify all connection parameters');
      console.error('   - See: docs/DATABASE_CONNECTION_GUIDE.md');
      console.error('');
    }
    
    console.error('📖 Full guide: docs/DATABASE_CONNECTION_GUIDE.md\n');
    process.exit(1);
    
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
    // Close the pool
    await pool.end();
  }
}

// Run the test
testConnection();
