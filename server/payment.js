import Razorpay from 'razorpay';
import crypto from 'crypto';

const paymentEnabled = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

let razorpay = null;

if (paymentEnabled) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay payment gateway initialized');
} else {
  console.warn('[DEV MODE] Payment gateway not configured. Checkout uses mock Razorpay orders until RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.');
}

/**
 * Create a Razorpay order for payment
 */
export async function createPaymentOrder(amount, currency = 'INR', receipt, notes = {}) {
  if (!paymentEnabled) {
    // Development mode - simulate order creation
    return {
      id: `order_dev_${crypto.randomUUID()}`,
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      status: 'created',
      devMode: true,
    };
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
      currency,
      receipt,
      notes,
    });

    return order;
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature(orderId, paymentId, signature) {
  if (!paymentEnabled) {
    // Development mode - always return true
    console.log('📝 [DEV MODE] Payment verification skipped');
    return true;
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

/**
 * Fetch payment details from Razorpay
 */
export async function getPaymentDetails(paymentId) {
  if (!paymentEnabled) {
    // Development mode - return mock data
    return {
      id: paymentId,
      amount: 100000, // 1000 INR in paise
      currency: 'INR',
      status: 'captured',
      method: 'upi',
      devMode: true,
    };
  }

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Failed to fetch payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
}

/**
 * Initiate refund for a payment
 */
export async function initiateRefund(paymentId, amount, notes = {}) {
  if (!paymentEnabled) {
    // Development mode - simulate refund
    return {
      id: `rfnd_dev_${crypto.randomUUID()}`,
      payment_id: paymentId,
      amount: amount * 100,
      status: 'processed',
      devMode: true,
    };
  }

  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Amount in paise
      notes,
    });

    return refund;
  } catch (error) {
    console.error('Failed to initiate refund:', error);
    throw new Error('Failed to initiate refund');
  }
}

/**
 * Check if payment gateway is enabled
 */
export function isPaymentEnabled() {
  return paymentEnabled;
}

/**
 * Get Razorpay key for frontend
 */
export function getRazorpayKey() {
  return process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_key';
}
