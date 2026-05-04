import nodemailer from 'nodemailer';

const emailEnabled = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export function isEmailEnabled() {
  return emailEnabled;
}

// Create transporter
let transporter = null;

if (emailEnabled) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.warn('[DEV MODE] Email service not configured. Real verification emails stay disabled until SMTP_* variables are set.');
}

export async function sendVerificationEmail(email, fullName, verificationToken) {
  if (!emailEnabled) {
    console.log(`📧 [DEV MODE] Verification email for ${email}`);
    console.log(`🔗 Verification link: ${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/verify-email?token=${verificationToken}`);
    return { success: true, devMode: true };
  }

  const verificationUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"GameXchange" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your GameXchange Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #FF4655 0%, #F43F5E 100%); padding: 40px 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);">
                      GameXchange
                    </h1>
                    <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                      Secure Gaming Account Marketplace
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; font-weight: 600;">
                      Welcome, ${fullName}! 🎮
                    </h2>
                    
                    <p style="margin: 0 0 20px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                      Thank you for signing up for GameXchange! We're excited to have you join our community of gamers.
                    </p>
                    
                    <p style="margin: 0 0 30px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                      To complete your registration and start buying or selling gaming accounts, please verify your email address by clicking the button below:
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #FF4655 0%, #F43F5E 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 20px rgba(255, 70, 85, 0.4); transition: all 0.3s;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 20px; color: #a0a0a0; font-size: 14px; line-height: 1.6;">
                      Or copy and paste this link into your browser:
                    </p>
                    
                    <div style="background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 15px; word-break: break-all;">
                      <a href="${verificationUrl}" style="color: #FF4655; text-decoration: none; font-size: 13px;">
                        ${verificationUrl}
                      </a>
                    </div>
                    
                    <p style="margin: 30px 0 0; color: #666666; font-size: 13px; line-height: 1.6;">
                      This verification link will expire in 24 hours. If you didn't create an account with GameXchange, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #0d0d0d; padding: 30px 40px; border-top: 1px solid #2a2a2a;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align: center;">
                          <p style="margin: 0 0 10px; color: #666666; font-size: 12px;">
                            © ${new Date().getFullYear()} GameXchange. All rights reserved.
                          </p>
                          <p style="margin: 0; color: #666666; font-size: 12px;">
                            Secure marketplace powered by Neon PostgreSQL
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Welcome to GameXchange, ${fullName}!

Thank you for signing up! To complete your registration, please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account with GameXchange, you can safely ignore this email.

© ${new Date().getFullYear()} GameXchange. All rights reserved.
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendWelcomeEmail(email, fullName) {
  if (!emailEnabled) {
    console.log(`📧 [DEV MODE] Welcome email for ${email}`);
    return { success: true, devMode: true };
  }

  const mailOptions = {
    from: `"GameXchange" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome to GameXchange! 🎮',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to GameXchange</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                <tr>
                  <td style="background: linear-gradient(135deg, #FF4655 0%, #F43F5E 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                      🎉 Welcome to GameXchange!
                    </h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">
                      Hi ${fullName},
                    </h2>
                    
                    <p style="margin: 0 0 20px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                      Your email has been verified successfully! You're now ready to explore the marketplace.
                    </p>
                    
                    <p style="margin: 0 0 30px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                      Here's what you can do:
                    </p>
                    
                    <ul style="margin: 0 0 30px; padding-left: 20px; color: #a0a0a0; font-size: 15px; line-height: 1.8;">
                      <li>Browse premium gaming accounts</li>
                      <li>List your own accounts for sale</li>
                      <li>Secure transactions with escrow protection</li>
                      <li>Track all your trades in one place</li>
                    </ul>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #FF4655 0%, #F43F5E 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 20px rgba(255, 70, 85, 0.4);">
                            Start Trading
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td style="background-color: #0d0d0d; padding: 30px 40px; border-top: 1px solid #2a2a2a; text-align: center;">
                    <p style="margin: 0; color: #666666; font-size: 12px;">
                      © ${new Date().getFullYear()} GameXchange. All rights reserved.
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
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw error for welcome email - it's not critical
    return { success: false };
  }
}

export async function sendSellerPaymentNotification(email, fullName, tradeDetails) {
  if (!emailEnabled) {
    console.log(`📧 [DEV MODE] Seller payment notification for ${email}`);
    console.log(`🔗 Trade ID: ${tradeDetails.tradeId}`);
    return { success: true, devMode: true };
  }

  const mailOptions = {
    from: `"GameXchange" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: '💰 Payment Received - Submit Account Credentials',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                <tr>
                  <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                      💰 Payment Received!
                    </h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">
                      Hi ${fullName},
                    </h2>
                    
                    <p style="margin: 0 0 20px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                      Great news! A buyer has completed payment for your ${tradeDetails.accountRank} account.
                    </p>
                    
                    <div style="background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin: 20px 0;">
                      <h3 style="margin: 0 0 15px; color: #10B981; font-size: 18px;">Trade Details</h3>
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #666666; font-size: 14px;">Account:</td>
                          <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: 600;">${tradeDetails.accountRank} - Level ${tradeDetails.accountLevel}</td>
                        </tr>
                        <tr>
                          <td style="color: #666666; font-size: 14px;">Sale Price:</td>
                          <td style="color: #10B981; font-size: 14px; text-align: right; font-weight: 600;">₹${tradeDetails.price.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <td style="color: #666666; font-size: 14px;">Trade ID:</td>
                          <td style="color: #ffffff; font-size: 12px; text-align: right; font-family: monospace;">${tradeDetails.tradeId}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="background-color: #10B981; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 12px; padding: 20px; margin: 30px 0;">
                      <h3 style="margin: 0 0 10px; color: #ffffff; font-size: 18px;">🔒 Next Step: Submit Credentials</h3>
                      <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.6;">
                        The payment is now secured in escrow. Please log in to your dashboard and submit the Riot account credentials (Riot ID and password) to complete the trade.
                      </p>
                    </div>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #FF4655 0%, #F43F5E 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 20px rgba(255, 70, 85, 0.4);">
                            Go to Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <div style="background-color: #1a1a1a; border-left: 4px solid #10B981; border-radius: 8px; padding: 15px; margin: 20px 0;">
                      <p style="margin: 0; color: #a0a0a0; font-size: 13px; line-height: 1.6;">
                        <strong style="color: #10B981;">Escrow Protection:</strong> Your payment will be released only after the buyer confirms successful account access. This ensures a secure transaction for both parties.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td style="background-color: #0d0d0d; padding: 30px 40px; border-top: 1px solid #2a2a2a; text-align: center;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 12px;">
                      © ${new Date().getFullYear()} GameXchange. All rights reserved.
                    </p>
                    <p style="margin: 0; color: #666666; font-size: 12px;">
                      Secure marketplace powered by Neon PostgreSQL
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
    text: `
Hi ${fullName},

Great news! A buyer has completed payment for your ${tradeDetails.accountRank} account.

Trade Details:
- Account: ${tradeDetails.accountRank} - Level ${tradeDetails.accountLevel}
- Sale Price: ₹${tradeDetails.price.toLocaleString('en-IN')}
- Trade ID: ${tradeDetails.tradeId}

Next Step: Submit Credentials
The payment is now secured in escrow. Please log in to your dashboard and submit the Riot account credentials (Riot ID and password) to complete the trade.

Go to Dashboard: ${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/dashboard

Escrow Protection: Your payment will be released only after the buyer confirms successful account access.

© ${new Date().getFullYear()} GameXchange. All rights reserved.
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send seller notification email:', error);
    throw new Error('Failed to send seller notification email');
  }
}

export async function sendBuyerCredentialsReadyNotification(email, fullName, tradeDetails) {
  if (!emailEnabled) {
    console.log(`📧 [DEV MODE] Buyer credentials ready notification for ${email}`);
    return { success: true, devMode: true };
  }

  const mailOptions = {
    from: `"GameXchange" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: '🎮 Account Credentials Ready - Verify Access',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Credentials Ready</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                <tr>
                  <td style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                      🎮 Credentials Ready!
                    </h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">
                      Hi ${fullName},
                    </h2>
                    
                    <p style="margin: 0 0 20px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                      The seller has submitted the account credentials for your ${tradeDetails.accountRank} purchase. You can now access them in your dashboard.
                    </p>
                    
                    <div style="background-color: #8B5CF6; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); border-radius: 12px; padding: 20px; margin: 30px 0;">
                      <h3 style="margin: 0 0 10px; color: #ffffff; font-size: 18px;">🔐 Important: Verify Access</h3>
                      <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.6;">
                        Please log in with the provided credentials, verify the account matches the listing, and confirm receipt to complete the trade.
                      </p>
                    </div>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #FF4655 0%, #F43F5E 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 20px rgba(255, 70, 85, 0.4);">
                            View Credentials
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <div style="background-color: #1a1a1a; border-left: 4px solid #8B5CF6; border-radius: 8px; padding: 15px; margin: 20px 0;">
                      <p style="margin: 0; color: #a0a0a0; font-size: 13px; line-height: 1.6;">
                        <strong style="color: #8B5CF6;">Escrow Protection:</strong> The payment will be released to the seller only after you confirm successful access. If there are any issues, please contact support immediately.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td style="background-color: #0d0d0d; padding: 30px 40px; border-top: 1px solid #2a2a2a; text-align: center;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 12px;">
                      © ${new Date().getFullYear()} GameXchange. All rights reserved.
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
    text: `
Hi ${fullName},

The seller has submitted the account credentials for your ${tradeDetails.accountRank} purchase.

Important: Verify Access
Please log in with the provided credentials, verify the account matches the listing, and confirm receipt to complete the trade.

View Credentials: ${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/dashboard

Escrow Protection: The payment will be released to the seller only after you confirm successful access.

© ${new Date().getFullYear()} GameXchange. All rights reserved.
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send buyer notification email:', error);
    throw new Error('Failed to send buyer notification email');
  }
}
