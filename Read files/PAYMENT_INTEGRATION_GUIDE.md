# Payment Integration Guide - Razorpay

## Overview
This guide covers the complete payment integration using Razorpay payment gateway for GameXchange. The system supports UPI, Cards, Wallets, and other payment methods popular in India.

## Features Implemented

### 1. Payment Gateway Integration
- Razorpay payment gateway (India's leading payment solution)
- Support for multiple payment methods (UPI, Cards, Wallets, Net Banking)
- Secure payment verification with signature validation
- Development mode for testing without actual payments
- Automatic payment order creation

### 2. Payment Flow
1. User selects account to purchase
2. Trade created with payment order
3. Razorpay checkout modal opens
4. User completes payment
5. Payment verified on backend
6. Account credentials released
7. Trade status updated

### 3. Security Features
- Payment signature verification
- Secure webhook handling
- PCI DSS compliant (via Razorpay)
- Encrypted payment data
- Fraud detection (via Razorpay)

## Database Schema Updates

### Trades Table
```sql
CREATE TABLE trades (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id),
  buyer_id TEXT NOT NULL REFERENCES users(id),
  seller_id TEXT NOT NULL REFERENCES users(id),
  price INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  
  -- Payment fields
  status TEXT NOT NULL DEFAULT 'pending_payment',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_id TEXT,
  payment_order_id TEXT,
  payment_signature TEXT,
  
  -- Account credentials (released after payment)
  account_email TEXT,
  account_password TEXT,
  security_code TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**New Fields:**
- `payment_status`: pending, completed, failed
- `payment_method`: upi, card, wallet, netbanking
- `payment_id`: Razorpay payment ID
- `payment_order_id`: Razorpay order ID
- `payment_signature`: Payment verification signature

**Status Flow:**
1. `pending_payment` - Trade created, awaiting payment
2. `verify_access` - Payment completed, buyer verifying account
3. `completed` - Buyer confirmed receipt
4. `cancelled` - Trade cancelled
5. `disputed` - Under dispute resolution

## Razorpay Setup

### 1. Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up for a free account
3. Complete KYC verification (for live mode)
4. Get your API keys

### 2. Get API Keys

**Test Mode (Development):**
1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate Test Keys
4. Copy Key ID and Key Secret

**Live Mode (Production):**
1. Complete KYC verification
2. Activate your account
3. Generate Live Keys
4. Copy Key ID and Key Secret

### 3. Configure Environment Variables

Add to `.env`:

```env
# Razorpay Test Keys (Development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key

# Razorpay Live Keys (Production)
# RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
# RAZORPAY_KEY_SECRET=your_live_secret_key
```

### 4. Development Mode (No Razorpay Account)

If Razorpay keys are not configured:
- System runs in development mode
- Mock payment orders are created
- Payment verification always succeeds
- Perfect for local development
- Console logs show payment details

## API Endpoints

### GET /api/payment/config
Get Razorpay configuration for frontend.

**Response:**
```json
{
  "key": "rzp_test_xxxxxxxxxx",
  "currency": "INR"
}
```

### POST /api/trades
Create a new trade and payment order.

**Request:**
```json
{
  "accountId": "account-uuid"
}
```

**Response:**
```json
{
  "trade": {
    "id": "trade-uuid",
    "account_id": "account-uuid",
    "buyer_id": "user-uuid",
    "seller_id": "user-uuid",
    "price": 10000,
    "platform_fee": 500,
    "total_amount": 10500,
    "status": "pending_payment",
    "payment_status": "pending",
    "payment_order_id": "order_xxxxx"
  },
  "paymentOrder": {
    "id": "order_xxxxx",
    "amount": 1050000,
    "currency": "INR"
  }
}
```

### POST /api/trades/:id/verify-payment
Verify payment after Razorpay checkout.

**Request:**
```json
{
  "paymentId": "pay_xxxxx",
  "orderId": "order_xxxxx",
  "signature": "signature_hash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "trade": {
    "id": "trade-uuid",
    "status": "verify_access",
    "payment_status": "completed"
  }
}
```

## Frontend Integration

### 1. Load Razorpay Script

```typescript
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);
```

### 2. Get Payment Configuration

```typescript
const [razorpayKey, setRazorpayKey] = useState('');

useEffect(() => {
  getPaymentConfig().then(config => {
    setRazorpayKey(config.key);
  });
}, []);
```

### 3. Create Trade and Payment Order

```typescript
const handleProceedToCheckout = async () => {
  try {
    const response = await createTrade(accountId);
    setTradeId(response.trade.id);
    setPaymentOrder(response.paymentOrder);
    // Show checkout modal
  } catch (error) {
    console.error('Failed to create trade:', error);
  }
};
```

### 4. Open Razorpay Checkout

```typescript
const handlePayment = async () => {
  const options = {
    key: razorpayKey,
    amount: paymentOrder.amount, // Amount in paise
    currency: paymentOrder.currency,
    name: 'GameXchange',
    description: `${account.rank} - Level ${account.level}`,
    order_id: paymentOrder.id,
    prefill: {
      method: selectedPayment, // 'upi', 'card', 'wallet'
    },
    theme: {
      color: '#FF4655',
    },
    handler: async function (response) {
      // Payment successful
      await verifyPayment(tradeId, {
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
      });
      
      // Show success message
      onPaymentComplete();
    },
    modal: {
      ondismiss: function() {
        // User closed the modal
        setIsProcessing(false);
      }
    }
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

### 5. Verify Payment on Backend

```typescript
try {
  await verifyPayment(tradeId, {
    paymentId: response.razorpay_payment_id,
    orderId: response.razorpay_order_id,
    signature: response.razorpay_signature,
  });
  
  // Payment verified successfully
  // Account credentials are now available
  onPaymentComplete();
} catch (error) {
  // Payment verification failed
  setError('Payment verification failed');
}
```

## Payment Methods Supported

### 1. UPI
- Google Pay
- PhonePe
- Paytm
- BHIM
- Any UPI app

### 2. Cards
- Credit Cards (Visa, Mastercard, Amex, RuPay)
- Debit Cards (All major banks)
- International Cards

### 3. Wallets
- Paytm
- PhonePe
- Amazon Pay
- Mobikwik
- Freecharge

### 4. Net Banking
- All major Indian banks
- 50+ banks supported

### 5. EMI
- Credit Card EMI
- Debit Card EMI
- Cardless EMI

## Payment Flow Diagram

```
1. User Clicks "Buy Account"
   ↓
2. Account Detail Modal Opens
   ↓
3. User Clicks "Proceed to Checkout"
   ↓
4. Backend Creates Trade + Razorpay Order
   ↓
5. Checkout Modal Opens
   ↓
6. User Selects Payment Method
   ↓
7. Razorpay Checkout Opens
   ↓
8. User Completes Payment
   ↓
9. Razorpay Sends Response to Frontend
   ↓
10. Frontend Sends to Backend for Verification
    ↓
11. Backend Verifies Signature
    ↓
12. Payment Verified ✓
    ↓
13. Account Credentials Released
    ↓
14. Trade Status Updated to "verify_access"
    ↓
15. User Can Access Account Details
```

## Testing

### Test Cards (Razorpay Test Mode)

**Success:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

### Test UPI

**Success:**
- UPI ID: `success@razorpay`

**Failure:**
- UPI ID: `failure@razorpay`

### Test Wallets

All test wallets will succeed in test mode.

### Manual Testing Steps

1. **Create Trade:**
   ```bash
   POST http://localhost:4000/api/auth/login
   # Get auth token
   
   POST http://localhost:4000/api/trades
   Authorization: Bearer <token>
   {
     "accountId": "account-uuid"
   }
   ```

2. **Get Payment Order:**
   Response will include `paymentOrder.id`

3. **Complete Payment:**
   Use Razorpay checkout with test credentials

4. **Verify Payment:**
   ```bash
   POST http://localhost:4000/api/trades/:id/verify-payment
   Authorization: Bearer <token>
   {
     "paymentId": "pay_xxxxx",
     "orderId": "order_xxxxx",
     "signature": "signature_hash"
   }
   ```

## Security Best Practices

### 1. Payment Signature Verification

Always verify payment signature on backend:

```javascript
const generatedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(`${orderId}|${paymentId}`)
  .digest('hex');

if (generatedSignature !== signature) {
  throw new Error('Invalid payment signature');
}
```

### 2. Never Trust Frontend

- Always verify payments on backend
- Never release credentials without verification
- Log all payment attempts
- Monitor for suspicious activity

### 3. Secure Key Storage

- Never commit keys to version control
- Use environment variables
- Rotate keys regularly
- Use different keys for test/live

### 4. HTTPS Only

- Always use HTTPS in production
- Razorpay requires HTTPS for live mode
- Secure all API endpoints

## Webhooks (Optional)

### Setup Webhook

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`
4. Save webhook secret

### Handle Webhook

```javascript
app.post("/api/webhooks/razorpay", async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  const event = req.body.event;
  const payment = req.body.payload.payment.entity;
  
  if (event === 'payment.captured') {
    // Update trade status
    await query(
      `UPDATE trades 
       SET payment_status = 'completed' 
       WHERE payment_id = $1`,
      [payment.id]
    );
  }
  
  res.json({ status: 'ok' });
});
```

## Error Handling

### Common Errors

**1. Payment Failed**
```json
{
  "error": "Payment failed",
  "code": "PAYMENT_FAILED",
  "reason": "Insufficient funds"
}
```

**2. Invalid Signature**
```json
{
  "error": "Invalid payment signature",
  "code": "INVALID_SIGNATURE"
}
```

**3. Order Expired**
```json
{
  "error": "Payment order expired",
  "code": "ORDER_EXPIRED"
}
```

### Handle Errors

```typescript
try {
  await verifyPayment(tradeId, paymentDetails);
} catch (error) {
  if (error.message.includes('INVALID_SIGNATURE')) {
    setError('Payment verification failed. Please contact support.');
  } else if (error.message.includes('ORDER_EXPIRED')) {
    setError('Payment session expired. Please try again.');
  } else {
    setError('Payment failed. Please try again.');
  }
}
```

## Refunds

### Initiate Refund

```javascript
app.post("/api/trades/:id/refund", authRequired, async (req, res) => {
  const tradeId = req.params.id;
  
  const trade = await query("SELECT * FROM trades WHERE id = $1", [tradeId]);
  
  if (trade.payment_status !== 'completed') {
    return res.status(400).json({ error: 'No payment to refund' });
  }
  
  try {
    const refund = await initiateRefund(
      trade.payment_id,
      trade.total_amount,
      { reason: 'Customer request' }
    );
    
    await query(
      `UPDATE trades 
       SET payment_status = 'refunded',
           status = 'cancelled'
       WHERE id = $1`,
      [tradeId]
    );
    
    res.json({ success: true, refund });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process refund' });
  }
});
```

## Production Checklist

- [ ] Complete Razorpay KYC verification
- [ ] Switch to live API keys
- [ ] Enable HTTPS
- [ ] Set up webhooks
- [ ] Configure payment methods
- [ ] Test all payment flows
- [ ] Set up monitoring/alerts
- [ ] Configure refund policy
- [ ] Add payment analytics
- [ ] Test error scenarios
- [ ] Document support process
- [ ] Train support team

## Pricing

### Razorpay Fees

**Domestic Payments:**
- UPI: 0% (free)
- Cards: 2% + GST
- Wallets: 2% + GST
- Net Banking: 2% + GST

**International Payments:**
- Cards: 3% + GST

**Settlement:**
- T+2 days (2 days after transaction)
- Instant settlement available (additional fee)

## Support

### Razorpay Support
- Email: support@razorpay.com
- Phone: +91-80-6890-6890
- Dashboard: https://dashboard.razorpay.com

### Documentation
- API Docs: https://razorpay.com/docs/api
- Integration Guide: https://razorpay.com/docs/payment-gateway
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details

## Files Modified/Created

### Backend
- `server/payment.js` - Payment service (NEW)
- `server/db.js` - Updated trades table schema
- `server/index.js` - Added payment endpoints
- `package.json` - Added razorpay package

### Frontend
- `src/utils/api.ts` - Added payment functions
- `src/components/checkout-modal.tsx` - Razorpay integration
- `src/components/valorant-marketplace.tsx` - Payment flow

### Configuration
- `.env` - Added Razorpay keys

## Troubleshooting

### Issue: Razorpay Checkout Not Opening

**Solution:**
1. Check if script is loaded: `window.Razorpay`
2. Verify Razorpay key is correct
3. Check browser console for errors
4. Ensure HTTPS in production

### Issue: Payment Verification Failed

**Solution:**
1. Check signature calculation
2. Verify Razorpay secret key
3. Ensure order ID matches
4. Check server logs for errors

### Issue: Development Mode Not Working

**Solution:**
1. Remove Razorpay keys from `.env`
2. Restart server
3. Check console for dev mode message
4. Verify mock data is returned

## Future Enhancements

- [ ] Subscription payments
- [ ] Recurring payments
- [ ] Payment links
- [ ] QR code payments
- [ ] International payments
- [ ] Cryptocurrency support
- [ ] Payment analytics dashboard
- [ ] Automated refunds
- [ ] Dispute management
- [ ] Payment reminders
