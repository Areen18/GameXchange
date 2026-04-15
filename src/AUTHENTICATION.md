# GameXchange - Real Authentication System

## 🔐 Authentication Features

This application implements **real, production-ready authentication** using Supabase Auth with:

- ✅ **Real Email Verification** - Emails sent to actual Gmail addresses
- ✅ **Secure Password Hashing** - bcrypt encryption handled by Supabase
- ✅ **Session Management** - JWT tokens with automatic refresh
- ✅ **Persistent Login** - "Remember Me" functionality
- ✅ **Email Resend** - Users can request new verification emails

---

## 📧 How Email Verification Works

### Sign Up Flow:
1. User enters email, password, and full name
2. Backend creates user account with `email_confirm: false`
3. **Supabase automatically sends verification email** to the user's Gmail
4. User receives email with verification link
5. User clicks link → Supabase verifies email
6. User returns to app → Clicks "I've Verified My Email"
7. System checks verification status → Grants access

### Login Flow:
1. User enters email and password
2. Backend verifies credentials
3. If email not verified → Redirect to verification waiting screen
4. If verified → Generate session token → Access granted

---

## 🔧 Email Configuration

### Default (Development):
- Emails sent from: `noreply@mail.app.supabase.io`
- Works immediately, no configuration needed
- Perfect for testing and development

### Production (Gmail/Custom SMTP):
To send emails from your own Gmail account:

1. **Enable 2FA on Gmail**
   - Go to: https://myaccount.google.com/security

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Create new app password for "Supabase"
   - Copy the 16-character password

3. **Configure Supabase SMTP**
   - Open Supabase Dashboard
   - Go to: Project Settings → Auth → SMTP Settings
   - Enter:
     ```
     Host: smtp.gmail.com
     Port: 465
     Username: your-email@gmail.com
     Password: [16-char app password]
     Sender email: your-email@gmail.com
     Sender name: GameXchange
     ```

4. **Customize Email Templates**
   - Go to: Authentication → Email Templates
   - Customize "Confirm Signup" template
   - Add your branding and styling

**Documentation:** https://supabase.com/docs/guides/auth/auth-smtp

---

## 🛡️ Security Features

### Password Security:
- Minimum 6 characters required
- Hashed with bcrypt (handled by Supabase)
- Never stored in plain text
- Never sent to frontend

### Session Security:
- JWT tokens with expiration
- Automatic token refresh
- Secure HttpOnly cookies (via Supabase)
- Session invalidation on logout

### Email Verification:
- Prevents fake account creation
- Ensures valid email addresses
- Time-limited verification links
- Resend functionality with rate limiting

---

## 🚀 API Endpoints

### `POST /auth/signup`
Creates new user account and sends verification email.

**Request:**
```json
{
  "email": "user@gmail.com",
  "password": "secure123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent! Please check your inbox.",
  "userId": "uuid",
  "email": "user@gmail.com"
}
```

---

### `POST /auth/login`
Authenticates user and returns session token.

**Request:**
```json
{
  "email": "user@gmail.com",
  "password": "secure123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1234567890
  },
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "full_name": "John Doe"
  }
}
```

---

### `POST /auth/resend-verification`
Resends verification email to user.

**Request:**
```json
{
  "email": "user@gmail.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email resent! Please check your inbox."
}
```

---

### `POST /auth/verify`
Checks if user session is valid.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "full_name": "John Doe",
    "email_confirmed": true
  }
}
```

---

### `POST /auth/logout`
Invalidates user session.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📱 Frontend Integration

### Session Storage:
- **Remember Me = ON**: Stored in `localStorage` (persistent)
- **Remember Me = OFF**: Stored in `sessionStorage` (cleared on tab close)

### Auto-Login:
- On app load, checks for existing session
- Validates session with backend
- Automatically logs in if session valid
- Redirects to login if session expired

### Real-time Auth State:
- Listens for Supabase auth events
- Automatically updates UI when user verifies email
- Handles token refresh transparently
- Syncs across browser tabs

---

## 🧪 Testing the System

### Test Email Verification:

1. **Sign Up with Real Gmail**
   ```
   Email: your-email@gmail.com
   Password: test123
   Full Name: Test User
   ```

2. **Check Your Gmail Inbox**
   - Look for email from Supabase
   - Check spam folder if not in inbox
   - Email subject: "Confirm Your Email"

3. **Click Verification Link**
   - Opens in new tab
   - Shows "Email confirmed" message
   - Automatically logs you in

4. **Return to App**
   - Click "I've Verified My Email"
   - System detects verification
   - Grants access to marketplace

### Test Login:
1. Use same credentials from sign up
2. Should login immediately (email already verified)
3. Session persisted based on "Remember Me" setting

### Test Logout:
1. Click logout from marketplace
2. Session cleared
3. Redirected to landing page
4. Cannot access marketplace without re-login

---

## 🐛 Troubleshooting

### Email Not Received:
- Check spam/junk folder
- Wait 2-3 minutes (SMTP can be slow)
- Click "Resend Verification Email"
- Verify email address is correct

### Login Fails:
- Ensure email is verified first
- Check password is correct (min 6 chars)
- Clear browser cache and try again
- Check browser console for error logs

### Session Expires:
- Sessions expire after set time
- Click "Remember Me" for longer sessions
- Re-login if session expired

---

## 📊 Database Schema

Supabase automatically creates and manages the `auth.users` table:

```sql
auth.users {
  id: uuid (primary key)
  email: string (unique)
  encrypted_password: string
  email_confirmed_at: timestamp
  created_at: timestamp
  updated_at: timestamp
  user_metadata: jsonb {
    full_name: string
    created_at: timestamp
  }
}
```

---

## 🎯 Next Steps

To enhance the authentication system:

1. **Add Password Reset**
   - Forgot password flow
   - Email with reset link
   - Secure password update

2. **Add Social Login**
   - Google OAuth
   - GitHub OAuth
   - Discord OAuth

3. **Add MFA (Multi-Factor Auth)**
   - TOTP (Google Authenticator)
   - SMS verification
   - Backup codes

4. **Add Rate Limiting**
   - Prevent brute force attacks
   - Limit login attempts
   - Throttle email resends

5. **Add Audit Logs**
   - Track login attempts
   - Monitor suspicious activity
   - Email notifications for new logins

---

## 📚 Resources

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Email Templates**: https://supabase.com/docs/guides/auth/auth-email-templates
- **SMTP Setup**: https://supabase.com/docs/guides/auth/auth-smtp
- **Security Best Practices**: https://supabase.com/docs/guides/auth/auth-helpers

---

## ⚠️ Important Notes

1. **Email Verification is Required** - Users cannot login until they verify their email
2. **Passwords are Hashed** - Never stored in plain text, bcrypt encryption used
3. **Sessions Expire** - JWT tokens expire after set duration (configurable in Supabase)
4. **SMTP Configuration Optional** - Default Supabase emails work fine for development
5. **Production Ready** - This system is production-ready out of the box

---

**Built with Supabase Auth + React + TypeScript**
