import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, CreditCard, Smartphone, Wallet, ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';
import type { AccountListing } from '../types/marketplace';
import { getPaymentConfig, verifyPayment } from '../utils/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutModalProps {
  darkMode: boolean;
  account: AccountListing | null;
  onClose: () => void;
  onBack: () => void;
  onPaymentComplete: () => Promise<void>;
  open: boolean;
  tradeId?: string;
  paymentOrder?: {
    id: string;
    amount: number;
    currency: string;
  };
}

export function CheckoutModal({ darkMode, account, onClose, onBack, onPaymentComplete, open, tradeId, paymentOrder }: CheckoutModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'wallet' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Get Razorpay key
    getPaymentConfig().then(config => {
      setRazorpayKey(config.key);
    }).catch(err => {
      console.error('Failed to load payment config:', err);
    });

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!account || !tradeId || !paymentOrder) {
    return null;
  }

  const platformFee = Math.round(account.price * 0.05);
  const totalAmount = account.price + platformFee;

  const handlePayment = async () => {
    if (!selectedPayment) {
      setError('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const options = {
        key: razorpayKey,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'GameXchange',
        description: `${account.rank} - Level ${account.level}`,
        order_id: paymentOrder.id,
        prefill: {
          method: selectedPayment,
        },
        theme: {
          color: '#FF4655',
        },
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            await verifyPayment(tradeId, {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            // Payment successful
            await onPaymentComplete();
          } catch (error) {
            setError('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-xl border shadow-2xl ${
              darkMode ? 'bg-[#0d0d0d]/95 border-white/10' : 'bg-white/95 border-gray-300/30'
            }`}
          >
            <div className={`sticky top-0 z-10 p-6 border-b backdrop-blur-xl ${
              darkMode ? 'border-white/10 bg-[#0d0d0d]/95' : 'border-gray-300/30 bg-white/95'
            }`}>
              <div className="flex items-center gap-3">
                <button onClick={onBack} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                  <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Secure Checkout</h2>
                  <p className="text-sm text-gray-400">Persisted order and trade records are created after payment.</p>
                </div>
                <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Valorant Account - {account.rank}</div>
                      <div className="text-sm text-gray-400">Level {account.level} • {account.skins} Skins • {account.region}</div>
                    </div>
                    <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{account.price.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Account Price</span>
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>₹{account.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Platform Fee (5%)</span>
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>₹{platformFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>Total Payable</span>
                      <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${darkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-blue-50 border-blue-300'}`}>
                <div className="flex gap-3">
                  <Shield className="text-cyan-400 flex-shrink-0" size={24} />
                  <div>
                    <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Secure Payment via Razorpay</h4>
                    <p className="text-sm text-gray-400">
                      Your payment is processed securely through Razorpay. Account credentials will be released only after successful payment verification.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
                <div className="flex gap-3">
                  <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
                  <div>
                    <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Payment is Protected</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      After checkout, the buyer trade record and account handoff details are saved. You can review them later under Active Trades.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Select Payment Method</h3>
                <div className="space-y-3">
                  <PaymentOption darkMode={darkMode} selected={selectedPayment === 'upi'} title="UPI Payment" subtitle="Google Pay, PhonePe, Paytm" onClick={() => setSelectedPayment('upi')} icon={<Smartphone className="text-white" size={24} />} />
                  <PaymentOption darkMode={darkMode} selected={selectedPayment === 'card'} title="Credit / Debit Card" subtitle="Visa, Mastercard, RuPay" onClick={() => setSelectedPayment('card')} icon={<CreditCard className="text-white" size={24} />} />
                  <PaymentOption darkMode={darkMode} selected={selectedPayment === 'wallet'} title="GameXchange Wallet" subtitle="Balance simulated for this demo flow" onClick={() => setSelectedPayment('wallet')} icon={<Wallet className="text-white" size={24} />} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: selectedPayment ? 1.02 : 1 }}
                  whileTap={{ scale: selectedPayment ? 0.98 : 1 }}
                  onClick={() => void handlePayment()}
                  disabled={!selectedPayment || isProcessing}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    selectedPayment && !isProcessing
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Complete Secure Payment
                    </>
                  )}
                </motion.button>
              </div>

              <div className="text-center text-xs text-gray-400">
                <Lock className="inline mr-1" size={12} />
                Session-backed checkout with Neon persistence.
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function PaymentOption({
  darkMode,
  selected,
  title,
  subtitle,
  onClick,
  icon,
}: {
  darkMode: boolean;
  selected: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected
          ? darkMode
            ? 'border-cyan-500 bg-cyan-500/10'
            : 'border-blue-500 bg-blue-50'
          : darkMode
            ? 'border-white/10 hover:border-white/20'
            : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selected ? 'bg-cyan-500' : darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</div>
          <div className="text-sm text-gray-400">{subtitle}</div>
        </div>
        {selected && (
          <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
