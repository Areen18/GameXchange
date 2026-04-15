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
