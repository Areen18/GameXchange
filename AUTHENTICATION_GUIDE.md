# GameXchange Authentication System

## Overview
GameXchange uses a secure JWT-based authentication system with refresh tokens, rate limiting, and strong password requirements.

## Security Features

### 1. Password Requirements
All passwords must meet these criteria:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

### 2. Rate Limiting
- Maximum 5 failed login/signup attempts per email
- 15-minute lockout period after exceeding limit
- Automatic reset after successful authentication

### 3. Token Management
- **Access Token**: 7-day expiration, used for API requests
- **Refresh Token**: 30-day expiration, used to get new access tokens
- Automatic token refresh on expiration
- Secure storage (localStorage for "remember me", sessionStorage otherwise)

### 4. Password Hashing
- bcrypt with cost factor of 12
- Salted hashes stored in database
- Never store plain text passwords

### 5. Email Normalization
- All emails converted to lowercase
- Trimmed whitespace
- Prevents duplicate accounts with case variations

## API Endpoints

### POST /api/auth/signup
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Errors:**
- 400: Validation errors (weak password, invalid email, etc.)
- 409: Email already registered
- 429: Too many signup attempts

### POST /api/auth/login
Authenticate existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Errors:**
- 400: Missing credentials
- 401: Invalid email or password
- 429: Too many login attempts

### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Errors:**
- 401: Invalid or expired token
- 404: User not found

### POST /api/auth/refresh
Get new access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

**Errors:**
- 400: Missing refresh token
- 401: Invalid or expired refresh token

### POST /api/auth/change-password
Change user password (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Errors:**
- 400: Missing passwords or weak new password
- 401: Incorrect current password
- 404: User not found

### POST /api/auth/logout
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Frontend Usage

### Login
```typescript
import { login, storeToken } from './utils/api';

const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
  try {
    const response = await login({ email, password });
    storeToken(response.token, response.refreshToken, rememberMe);
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};
```

### Signup
```typescript
import { signup, storeToken } from './utils/api';

const handleSignup = async (email: string, password: string, fullName: string) => {
  try {
    const response = await signup({ email, password, fullName });
    storeToken(response.token, response.refreshToken, true);
    // Handle successful signup
  } catch (error) {
    // Handle error
  }
};
```

### Automatic Token Refresh
The API client automatically handles token refresh when an access token expires. No manual intervention needed.

### Logout
```typescript
import { logout } from './utils/api';

const handleLogout = async () => {
  try {
    await logout();
    // Redirect to login page
  } catch (error) {
    // Handle error
  }
};
```

### Change Password
```typescript
import { changePassword } from './utils/api';

const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
  try {
    await changePassword({ currentPassword, newPassword });
    // Show success message
  } catch (error) {
    // Handle error
  }
};
```

## Security Best Practices

### For Developers

1. **Never log tokens** - Don't console.log or store tokens in plain text files
2. **Use HTTPS** - Always use HTTPS in production
3. **Validate on both sides** - Client-side validation for UX, server-side for security
4. **Rate limit aggressively** - Prevent brute force attacks
5. **Monitor failed attempts** - Log and alert on suspicious activity
6. **Rotate secrets** - Change JWT_SECRET regularly in production
7. **Use environment variables** - Never commit secrets to version control

### For Users

1. **Use strong passwords** - Follow the password requirements
2. **Enable "Remember Me" carefully** - Only on trusted devices
3. **Logout when done** - Especially on shared computers
4. **Change password regularly** - Update every 90 days
5. **Don't share credentials** - Each user should have their own account

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secret-key-here

# Server
PORT=4000
CLIENT_ORIGIN=http://localhost:3000

# Client
VITE_API_URL=http://localhost:4000/api
```

## Production Considerations

### Additional Security Measures for Production

1. **Token Blacklist** - Implement Redis-based token blacklist for logout
2. **2FA/MFA** - Add two-factor authentication
3. **Email Verification** - Verify email addresses before activation
4. **Password Reset** - Implement secure password reset flow
5. **Session Management** - Track active sessions per user
6. **IP Whitelisting** - Optional IP-based access control
7. **Audit Logging** - Log all authentication events
8. **CAPTCHA** - Add CAPTCHA after failed attempts
9. **Device Fingerprinting** - Track and alert on new devices
10. **Security Headers** - Implement helmet.js for Express

### Monitoring

Monitor these metrics:
- Failed login attempts per IP/email
- Token refresh frequency
- Password change frequency
- Active sessions per user
- API response times for auth endpoints

## Troubleshooting

### "Token expired" error
- Automatic refresh should handle this
- If persists, clear storage and login again

### "Too many attempts" error
- Wait 15 minutes before trying again
- Check for typos in email/password

### "Invalid email or password" error
- Verify credentials are correct
- Email is case-insensitive
- Password is case-sensitive

### Session not persisting
- Check if "Remember Me" is enabled
- Verify localStorage/sessionStorage is not disabled
- Check browser privacy settings

## Testing

### Test Accounts
Development environment includes seeded accounts:

```
Email: seller.raven@gamexchange.dev
Password: SeedAccount123!

Email: seller.cypher@gamexchange.dev
Password: SeedAccount123!
```

### Manual Testing Checklist

- [ ] Signup with valid credentials
- [ ] Signup with weak password (should fail)
- [ ] Signup with existing email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Login after 5 failed attempts (should be rate limited)
- [ ] Access protected endpoint with valid token
- [ ] Access protected endpoint with expired token (should auto-refresh)
- [ ] Change password with correct current password
- [ ] Change password with wrong current password (should fail)
- [ ] Logout and verify token is cleared
- [ ] "Remember Me" persists across browser restart
- [ ] Session-only login clears on browser close

## Future Enhancements

Planned features:
- [ ] Email verification
- [ ] Password reset via email
- [ ] Two-factor authentication (TOTP)
- [ ] OAuth integration (Google, Discord, etc.)
- [ ] Session management dashboard
- [ ] Login history and device tracking
- [ ] Suspicious activity alerts
- [ ] Account recovery options
- [ ] Biometric authentication support
- [ ] WebAuthn/FIDO2 support
