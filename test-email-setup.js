#!/usr/bin/env node
/**
 * Email Configuration Test Script
 * 
 * This script tests your SMTP configuration to ensure emails can be sent.
 * Run: node test-email-setup.js
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('\n🔍 Testing Email Configuration...\n');

// Check if SMTP variables are set
const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n📝 Please update your .env file with SMTP credentials.');
  console.error('📖 See: docs/GMAIL_SMTP_SETUP_GUIDE.md\n');
  process.exit(1);
}

// Check for placeholder values
if (process.env.SMTP_USER === 'your-email@gmail.com' || 
    process.env.SMTP_PASS === 'your-app-password' ||
    process.env.SMTP_PASS === 'your-16-character-app-password') {
  console.error('❌ SMTP credentials are still using placeholder values!');
  console.error('\n📝 Please update your .env file with real credentials:');
  console.error('   1. Go to https://myaccount.google.com/apppasswords');
  console.error('   2. Generate an App Password');
  console.error('   3. Update SMTP_USER and SMTP_PASS in .env');
  console.error('\n📖 See: docs/GMAIL_SMTP_SETUP_GUIDE.md\n');
  process.exit(1);
}

// Display current configuration
console.log('📋 Current Configuration:');
console.log(`   SMTP_HOST: ${process.env.SMTP_HOST}`);
console.log(`   SMTP_PORT: ${process.env.SMTP_PORT}`);
console.log(`   SMTP_SECURE: ${process.env.SMTP_SECURE}`);
console.log(`   SMTP_USER: ${process.env.SMTP_USER}`);
console.log(`   SMTP_PASS: ${'*'.repeat(process.env.SMTP_PASS.length)} (hidden)`);
console.log(`   SMTP_FROM: ${process.env.SMTP_FROM || process.env.SMTP_USER}`);
console.log('');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: false, // Set to true for detailed logs
  logger: false, // Set to true for console logs
});

// Test connection
console.log('🔌 Testing SMTP connection...');

transporter.verify(function(error, success) {
  if (error) {
    console.error('\n❌ SMTP Connection Failed!');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    
    if (error.message.includes('Invalid login')) {
      console.error('   - Check your Gmail address (SMTP_USER)');
      console.error('   - Verify your App Password (SMTP_PASS)');
      console.error('   - Ensure 2-Step Verification is enabled');
      console.error('   - Generate a new App Password if needed');
    } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.error('   - Check your firewall settings');
      console.error('   - Try port 465 with SMTP_SECURE=true');
      console.error('   - Check your internet connection');
    } else if (error.message.includes('certificate')) {
      console.error('   - SSL certificate issue');
      console.error('   - Try adding tls: { rejectUnauthorized: false }');
    } else {
      console.error('   - Review the error message above');
      console.error('   - Check docs/GMAIL_SMTP_SETUP_GUIDE.md');
    }
    
    console.error('\n📖 Full guide: docs/GMAIL_SMTP_SETUP_GUIDE.md\n');
    process.exit(1);
  } else {
    console.log('✅ SMTP connection successful!\n');
    
    // Ask if user wants to send a test email
    console.log('📧 Ready to send a test email!');
    console.log('   Edit this script and replace "your-test-email@example.com"');
    console.log('   with your actual email address, then run again.\n');
    
    // Send test email
    sendTestEmail();
  }
});

async function sendTestEmail() {
  // Replace this with your actual email to test
  const testEmailAddress = 'your-test-email@example.com';
  
  if (testEmailAddress === 'your-test-email@example.com') {
    console.log('⏭️  Skipping test email (placeholder address detected)');
    console.log('   To send a test email:');
    console.log('   1. Open test-email-setup.js');
    console.log('   2. Replace "your-test-email@example.com" with your email');
    console.log('   3. Run: node test-email-setup.js\n');
    console.log('✅ Email configuration is ready to use!\n');
    return;
  }
  
  console.log(`📤 Sending test email to: ${testEmailAddress}...`);
  
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: testEmailAddress,
      subject: '✅ GameXchange Email Test - Success!',
      text: 'Congratulations! Your SMTP configuration is working correctly. You can now send emails from GameXchange.',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
                        ✅ Email Test Successful!
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 22px;">
                        Congratulations! 🎉
                      </h2>
                      <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                        Your SMTP configuration is working correctly. GameXchange can now send:
                      </p>
                      <ul style="margin: 0 0 20px; padding-left: 20px; color: #666666; font-size: 15px; line-height: 1.8;">
                        <li>Email verification messages</li>
                        <li>Welcome emails</li>
                        <li>Trade notifications</li>
                        <li>Payment alerts</li>
                      </ul>
                      <div style="background-color: #f0fdf4; border-left: 4px solid #10B981; border-radius: 4px; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #065f46; font-size: 14px;">
                          <strong>✅ Configuration Verified:</strong><br>
                          SMTP Host: ${process.env.SMTP_HOST}<br>
                          SMTP Port: ${process.env.SMTP_PORT}<br>
                          From: ${process.env.SMTP_FROM || process.env.SMTP_USER}
                        </p>
                      </div>
                      <p style="margin: 20px 0 0; color: #666666; font-size: 14px;">
                        You're all set! Your GameXchange application is ready to send emails.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        GameXchange Email Test • ${new Date().toLocaleString()}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log('\n✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Check your inbox: ${testEmailAddress}`);
    console.log('\n🎉 Your email configuration is working perfectly!\n');
  } catch (error) {
    console.error('\n❌ Failed to send test email:');
    console.error('   Error:', error.message);
    console.error('\n🔧 The SMTP connection works, but sending failed.');
    console.error('   This might be a temporary issue. Try again in a moment.\n');
  }
}
