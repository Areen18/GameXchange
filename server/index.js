import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { bootstrapDatabase, pool, query } from "./db.js";
import { isEmailEnabled, sendVerificationEmail, sendWelcomeEmail } from "./email.js";
import { createPaymentOrder, verifyPaymentSignature, getPaymentDetails, initiateRefund, getRazorpayKey } from "./payment.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

// Rate limiting store (in-memory, use Redis in production)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Allow multiple origins for development
const allowedOrigins = [
  clientOrigin,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

function createToken(user, expiresIn = "7d") {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      full_name: user.full_name,
      iat: Math.floor(Date.now() / 1000),
    },
    jwtSecret,
    { expiresIn },
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      type: "refresh",
    },
    jwtSecret,
    { expiresIn: "30d" },
  );
}

function sanitizeUser(row) {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    created_at: row.created_at,
  };
}

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, jwtSecret);
    
    // Check if it's a refresh token (not allowed for regular endpoints)
    if (payload.type === "refresh") {
      return res.status(401).json({ error: "Invalid token type" });
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      full_name: payload.full_name,
    };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

function checkLoginAttempts(identifier) {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier) || { count: 0, firstAttempt: now };
  
  // Reset if window has passed
  if (now - attempts.firstAttempt > LOGIN_ATTEMPT_WINDOW) {
    loginAttempts.delete(identifier);
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS };
  }
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeLeft = Math.ceil((LOGIN_ATTEMPT_WINDOW - (now - attempts.firstAttempt)) / 60000);
    return { allowed: false, timeLeft };
  }
  
  return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - attempts.count };
}

function recordLoginAttempt(identifier, success = false) {
  if (success) {
    loginAttempts.delete(identifier);
    return;
  }
  
  const now = Date.now();
  const attempts = loginAttempts.get(identifier) || { count: 0, firstAttempt: now };
  
  loginAttempts.set(identifier, {
    count: attempts.count + 1,
    firstAttempt: attempts.firstAttempt,
  });
}

function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return errors;
}

function mapAccount(row) {
  return {
    id: row.id,
    game: row.game,
    region: row.region,
    level: row.level,
    rank: row.rank,
    skins: row.skins,
    agents: row.agents,
    email_changeable: row.email_changeable,
    price: row.price,
    negotiable: row.negotiable,
    description: row.description,
    image_url: row.image_url,
    seller_name: row.seller_name,
    created_at: row.created_at,
  };
}

function mapTrade(row, currentUserId) {
  return {
    id: row.id,
    account_id: row.account_id,
    account_rank: row.account_rank,
    account_level: row.account_level,
    account_skins: row.account_skins,
    region: row.region,
    price: row.price,
    platform_fee: row.platform_fee,
    total_amount: row.total_amount,
    status: row.status,
    created_at: row.created_at,
    type: row.buyer_id === currentUserId ? "buy" : "sell",
    account_email: row.account_email,
    account_password: row.account_password,
    security_code: row.security_code,
    buyer_name: row.buyer_name,
    seller_name: row.seller_name,
  };
}

app.get("/api/health", async (_req, res) => {
  const result = await query("SELECT NOW() AS now");
  res.json({ status: "ok", now: result.rows[0].now });
});

app.post("/api/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body ?? {};

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: "Full name, email, and password are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate password strength
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ 
      error: "Password does not meet requirements", 
      details: passwordErrors 
    });
  }

  // Validate full name
  if (fullName.trim().length < 2) {
    return res.status(400).json({ error: "Full name must be at least 2 characters" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  
  // Check rate limiting
  const attemptCheck = checkLoginAttempts(normalizedEmail);
  if (!attemptCheck.allowed) {
    return res.status(429).json({ 
      error: `Too many signup attempts. Please try again in ${attemptCheck.timeLeft} minutes` 
    });
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);

  if (existing.rowCount > 0) {
    recordLoginAttempt(normalizedEmail, false);
    return res.status(409).json({ error: "This email is already registered" });
  }

  // Generate verification token
  const verificationToken = crypto.randomUUID();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const emailVerificationRequired = isEmailEnabled();

  const user = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    full_name: String(fullName).trim(),
    password_hash: await bcrypt.hash(String(password), 12),
    email_verified: !emailVerificationRequired,
    verification_token: emailVerificationRequired ? verificationToken : null,
    verification_token_expires: emailVerificationRequired ? verificationExpires : null,
  };

  const inserted = await query(
    `
      INSERT INTO users (id, email, full_name, password_hash, email_verified, verification_token, verification_token_expires)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, full_name, email_verified, created_at
    `,
    [user.id, user.email, user.full_name, user.password_hash, user.email_verified, user.verification_token, user.verification_token_expires],
  );

  if (emailVerificationRequired) {
    try {
      await sendVerificationEmail(user.email, user.full_name, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with signup even if email fails
    }
  }

  const safeUser = sanitizeUser(inserted.rows[0]);
  
  recordLoginAttempt(normalizedEmail, true);
  
  res.status(201).json({ 
    user: safeUser,
    message: emailVerificationRequired
      ? "Account created successfully. Please check your email to verify your account."
      : "Account created successfully. You can now log in.",
    requiresVerification: emailVerificationRequired
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  
  // Check rate limiting
  const attemptCheck = checkLoginAttempts(normalizedEmail);
  if (!attemptCheck.allowed) {
    return res.status(429).json({ 
      error: `Too many login attempts. Please try again in ${attemptCheck.timeLeft} minutes` 
    });
  }

  const result = await query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);

  if (result.rowCount === 0) {
    recordLoginAttempt(normalizedEmail, false);
    // Use same error message to prevent email enumeration
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(String(password), user.password_hash);

  if (!isValid) {
    recordLoginAttempt(normalizedEmail, false);
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (!user.email_verified) {
    if (!isEmailEnabled()) {
      await query(
        `UPDATE users
         SET email_verified = TRUE,
             verification_token = NULL,
             verification_token_expires = NULL,
             updated_at = NOW()
         WHERE id = $1`,
        [user.id],
      );
      user.email_verified = true;
    } else {
      return res.status(403).json({ 
        error: "Please verify your email before logging in",
        code: "EMAIL_NOT_VERIFIED",
        email: user.email
      });
    }
  }

  const safeUser = sanitizeUser(user);
  const accessToken = createToken(safeUser);
  const refreshToken = createRefreshToken(safeUser);
  
  recordLoginAttempt(normalizedEmail, true);
  
  res.json({ 
    token: accessToken,
    refreshToken,
    user: safeUser 
  });
});

app.get("/api/auth/me", authRequired, async (req, res) => {
  const result = await query(
    "SELECT id, email, full_name, created_at FROM users WHERE id = $1",
    [req.user.id],
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ user: sanitizeUser(result.rows[0]) });
});

app.post("/api/auth/refresh", async (req, res) => {
  const { refreshToken } = req.body ?? {};

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const payload = jwt.verify(refreshToken, jwtSecret);
    
    if (payload.type !== "refresh") {
      return res.status(401).json({ error: "Invalid token type" });
    }

    // Verify user still exists
    const result = await query(
      "SELECT id, email, full_name, created_at FROM users WHERE id = $1",
      [payload.sub],
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = sanitizeUser(result.rows[0]);
    const newAccessToken = createToken(user);
    const newRefreshToken = createRefreshToken(user);

    res.json({ 
      token: newAccessToken,
      refreshToken: newRefreshToken,
      user 
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Refresh token expired. Please login again" });
    }
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

app.post("/api/auth/change-password", authRequired, async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required" });
  }

  // Validate new password strength
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ 
      error: "New password does not meet requirements", 
      details: passwordErrors 
    });
  }

  // Get current user with password hash
  const result = await query("SELECT * FROM users WHERE id = $1", [req.user.id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(String(currentPassword), user.password_hash);

  if (!isValid) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(String(newPassword), 12);

  // Update password
  await query(
    "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
    [newPasswordHash, req.user.id],
  );

  res.json({ success: true, message: "Password changed successfully" });
});

app.post("/api/auth/logout", authRequired, async (req, res) => {
  // In a production app, you'd invalidate the token in a blacklist/database
  // For now, we'll just return success and let the client clear the token
  res.json({ success: true, message: "Logged out successfully" });
});

app.post("/api/auth/verify-email", async (req, res) => {
  const { token } = req.body ?? {};

  if (!token) {
    return res.status(400).json({ error: "Verification token is required" });
  }

  const result = await query(
    `SELECT * FROM users 
     WHERE verification_token = $1 
     AND verification_token_expires > NOW()
     AND email_verified = FALSE`,
    [token]
  );

  if (result.rowCount === 0) {
    return res.status(400).json({ 
      error: "Invalid or expired verification token",
      code: "INVALID_TOKEN"
    });
  }

  const user = result.rows[0];

  // Update user as verified
  await query(
    `UPDATE users 
     SET email_verified = TRUE, 
         verification_token = NULL, 
         verification_token_expires = NULL,
         updated_at = NOW()
     WHERE id = $1`,
    [user.id]
  );

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.full_name);
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
  }

  const safeUser = sanitizeUser({ ...user, email_verified: true });
  const accessToken = createToken(safeUser);
  const refreshToken = createRefreshToken(safeUser);

  res.json({ 
    success: true,
    message: "Email verified successfully! You can now log in.",
    token: accessToken,
    refreshToken,
    user: safeUser
  });
});

app.post("/api/auth/resend-verification", async (req, res) => {
  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  const result = await query(
    "SELECT * FROM users WHERE email = $1",
    [normalizedEmail]
  );

  if (result.rowCount === 0) {
    // Don't reveal if email exists
    return res.json({ 
      success: true,
      message: "If an account exists with this email, a verification link has been sent."
    });
  }

  const user = result.rows[0];

  if (user.email_verified) {
    return res.status(400).json({ 
      error: "This email is already verified",
      code: "ALREADY_VERIFIED"
    });
  }

  // Generate new verification token
  const verificationToken = crypto.randomUUID();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await query(
    `UPDATE users 
     SET verification_token = $1, 
         verification_token_expires = $2,
         updated_at = NOW()
     WHERE id = $3`,
    [verificationToken, verificationExpires, user.id]
  );

  // Send verification email
  try {
    await sendVerificationEmail(user.email, user.full_name, verificationToken);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    return res.status(500).json({ error: "Failed to send verification email" });
  }

  res.json({ 
    success: true,
    message: "Verification email sent. Please check your inbox."
  });
});

app.get("/api/accounts", async (req, res) => {
  const { search = "", rank = "", region = "", minSkins = "" } = req.query;
  const conditions = ["a.status = 'active'"];
  const values = [];

  if (search) {
    values.push(`%${String(search)}%`);
    conditions.push(
      `(a.rank ILIKE $${values.length} OR a.description ILIKE $${values.length} OR u.full_name ILIKE $${values.length})`,
    );
  }

  if (rank && rank !== "All Ranks") {
    values.push(`%${String(rank)}%`);
    conditions.push(`a.rank ILIKE $${values.length}`);
  }

  if (region && region !== "All Regions") {
    values.push(String(region));
    conditions.push(`a.region = $${values.length}`);
  }

  if (minSkins) {
    values.push(Number(minSkins) || 0);
    conditions.push(`a.skins >= $${values.length}`);
  }

  const result = await query(
    `
      SELECT
        a.*,
        u.full_name AS seller_name
      FROM accounts a
      JOIN users u ON u.id = a.seller_id
      WHERE ${conditions.join(" AND ")}
      ORDER BY a.created_at DESC
    `,
    values,
  );

  res.json({ accounts: result.rows.map(mapAccount) });
});

app.post("/api/accounts", authRequired, async (req, res) => {
  const {
    region,
    level,
    rank,
    skins,
    agents,
    emailChangeable,
    price,
    negotiable,
    description,
    deliveryEmail,
    deliveryPassword,
    deliveryCode,
  } = req.body ?? {};

  if (!region || !level || !rank || !price || !deliveryEmail || !deliveryPassword) {
    return res.status(400).json({
      error: "Region, level, rank, price, transfer email, and transfer password are required",
    });
  }

  const inserted = await query(
    `
      INSERT INTO accounts (
        id, seller_id, region, level, rank, skins, agents, email_changeable, price,
        negotiable, description, delivery_email, delivery_password, delivery_code, image_url
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15
      )
      RETURNING *
    `,
    [
      crypto.randomUUID(),
      req.user.id,
      String(region),
      Number(level),
      String(rank),
      Number(skins || 0),
      String(agents || ""),
      Boolean(emailChangeable),
      Number(price),
      Boolean(negotiable),
      String(description || ""),
      String(deliveryEmail),
      String(deliveryPassword),
      String(deliveryCode || `GCX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`),
      null,
    ],
  );

  const account = inserted.rows[0];
  res.status(201).json({
    account: {
      ...mapAccount({ ...account, seller_name: req.user.full_name }),
    },
  });
});

app.get("/api/trades", authRequired, async (req, res) => {
  const result = await query(
    `
      SELECT
        t.*,
        a.rank AS account_rank,
        a.level AS account_level,
        a.skins AS account_skins,
        a.region,
        buyer.full_name AS buyer_name,
        seller.full_name AS seller_name
      FROM trades t
      JOIN accounts a ON a.id = t.account_id
      JOIN users buyer ON buyer.id = t.buyer_id
      JOIN users seller ON seller.id = t.seller_id
      WHERE t.buyer_id = $1 OR t.seller_id = $1
      ORDER BY t.created_at DESC
    `,
    [req.user.id],
  );

  res.json({ trades: result.rows.map((row) => mapTrade(row, req.user.id)) });
});

app.get("/api/payment/config", authRequired, async (req, res) => {
  res.json({
    key: getRazorpayKey(),
    currency: 'INR',
  });
});

app.post("/api/trades", authRequired, async (req, res) => {
  const { accountId } = req.body ?? {};

  if (!accountId) {
    return res.status(400).json({ error: "Account id is required" });
  }

  const accountResult = await query("SELECT * FROM accounts WHERE id = $1", [String(accountId)]);

  if (accountResult.rowCount === 0) {
    return res.status(404).json({ error: "Account not found" });
  }

  const account = accountResult.rows[0];

  if (account.status !== "active") {
    return res.status(400).json({ error: "This account is no longer available" });
  }

  if (account.seller_id === req.user.id) {
    return res.status(400).json({ error: "You cannot buy your own listing" });
  }

  const existingTrade = await query(
    `SELECT id FROM trades 
     WHERE account_id = $1 
     AND buyer_id = $2 
     AND payment_status != 'failed'
     AND status NOT IN ('completed', 'cancelled')`,
    [account.id, req.user.id],
  );

  if (existingTrade.rowCount > 0) {
    return res.status(409).json({ error: "You already have an active trade for this listing" });
  }

  const platformFee = Math.round(Number(account.price) * 0.05);
  const totalAmount = Number(account.price) + platformFee;

  // Create Razorpay order
  let paymentOrder;
  try {
    paymentOrder = await createPaymentOrder(
      totalAmount,
      'INR',
      `trade_${crypto.randomUUID()}`,
      {
        account_id: account.id,
        buyer_id: req.user.id,
        seller_id: account.seller_id,
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Failed to create payment order" });
  }

  const inserted = await query(
    `INSERT INTO trades (
      id, account_id, buyer_id, seller_id, price, platform_fee, total_amount,
      status, payment_status, payment_order_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending_payment', 'pending', $8)
    RETURNING *`,
    [
      crypto.randomUUID(),
      account.id,
      req.user.id,
      account.seller_id,
      account.price,
      platformFee,
      totalAmount,
      paymentOrder.id,
    ],
  );

  const seller = await query("SELECT full_name FROM users WHERE id = $1", [account.seller_id]);
  const trade = inserted.rows[0];

  res.status(201).json({
    trade: mapTrade(
      {
        ...trade,
        account_rank: account.rank,
        account_level: account.level,
        account_skins: account.skins,
        region: account.region,
        buyer_name: req.user.full_name,
        seller_name: seller.rows[0]?.full_name ?? "Seller",
      },
      req.user.id,
    ),
    paymentOrder: {
      id: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
    },
  });
});

app.post("/api/trades/:id/verify-payment", authRequired, async (req, res) => {
  const tradeId = req.params.id;
  const { paymentId, orderId, signature } = req.body ?? {};

  if (!paymentId || !orderId || !signature) {
    return res.status(400).json({ error: "Payment details are required" });
  }

  const tradeResult = await query("SELECT * FROM trades WHERE id = $1", [tradeId]);

  if (tradeResult.rowCount === 0) {
    return res.status(404).json({ error: "Trade not found" });
  }

  const trade = tradeResult.rows[0];

  if (trade.buyer_id !== req.user.id) {
    return res.status(403).json({ error: "Only the buyer can verify payment" });
  }

  if (trade.payment_status === 'completed') {
    return res.status(400).json({ error: "Payment already verified" });
  }

  // Verify payment signature
  const isValid = verifyPaymentSignature(orderId, paymentId, signature);

  if (!isValid) {
    await query(
      `UPDATE trades 
       SET payment_status = 'failed', 
           updated_at = NOW() 
       WHERE id = $1`,
      [tradeId]
    );
    return res.status(400).json({ error: "Invalid payment signature" });
  }

  // Get payment details
  let paymentDetails;
  try {
    paymentDetails = await getPaymentDetails(paymentId);
  } catch (error) {
    return res.status(500).json({ error: "Failed to verify payment" });
  }

  // Get account details to attach credentials
  const accountResult = await query("SELECT * FROM accounts WHERE id = $1", [trade.account_id]);
  const account = accountResult.rows[0];

  // Update trade with payment details and account credentials
  await query(
    `UPDATE trades 
     SET payment_status = 'completed',
         payment_id = $1,
         payment_method = $2,
         payment_signature = $3,
         status = 'verify_access',
         account_email = $4,
         account_password = $5,
         security_code = $6,
         updated_at = NOW()
     WHERE id = $7`,
    [
      paymentId,
      paymentDetails.method || 'unknown',
      signature,
      account.delivery_email,
      account.delivery_password,
      account.delivery_code,
      tradeId
    ]
  );

  res.json({ 
    success: true,
    message: "Payment verified successfully",
    trade: {
      id: tradeId,
      status: 'verify_access',
      payment_status: 'completed',
    }
  });
});

app.patch("/api/trades/:id/confirm", authRequired, async (req, res) => {
  const tradeId = req.params.id;

  const tradeResult = await query("SELECT * FROM trades WHERE id = $1", [tradeId]);

  if (tradeResult.rowCount === 0) {
    return res.status(404).json({ error: "Trade not found" });
  }

  const trade = tradeResult.rows[0];

  if (trade.buyer_id !== req.user.id) {
    return res.status(403).json({ error: "Only the buyer can confirm receipt" });
  }

  await query("UPDATE trades SET status = 'completed', updated_at = NOW() WHERE id = $1", [tradeId]);
  await query("UPDATE accounts SET status = 'sold', updated_at = NOW() WHERE id = $1", [trade.account_id]);

  res.json({ success: true });
});

app.patch("/api/trades/:id/cancel", authRequired, async (req, res) => {
  const tradeId = req.params.id;

  const tradeResult = await query("SELECT * FROM trades WHERE id = $1", [tradeId]);

  if (tradeResult.rowCount === 0) {
    return res.status(404).json({ error: "Trade not found" });
  }

  const trade = tradeResult.rows[0];

  if (trade.buyer_id !== req.user.id && trade.seller_id !== req.user.id) {
    return res.status(403).json({ error: "You do not have access to this trade" });
  }

  if (trade.status === "completed" || trade.status === "cancelled") {
    return res.status(400).json({ error: "This trade can no longer be removed" });
  }

  if (trade.payment_status === "completed" || trade.status !== "pending_payment") {
    return res.status(400).json({ error: "Only unpaid pending trades can be removed" });
  }

  await query(
    `UPDATE trades
     SET status = 'cancelled',
         payment_status = 'failed',
         updated_at = NOW()
     WHERE id = $1`,
    [tradeId],
  );

  res.json({ success: true, message: "Trade removed successfully" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

await bootstrapDatabase();

const server = app.listen(port, () => {
  console.log(`GameXchange API running on http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down cleanly...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
