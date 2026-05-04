import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Shield, CheckCircle, Clock, Copy, AlertTriangle, ArrowLeft, 
  QrCode, CreditCard, Eye, EyeOff, Upload, ArrowRight, Info,
  Bell, Package, Zap, Lock, TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import type { Trade } from '../types/marketplace';

interface ManualTradeDetailModalProps {
  darkMode: boolean;
  trade: Trade | null;
  onClose: () => void;
  onConfirmReceived: (tradeId: string) => Promise<void>;
  onAddPaymentInfo: (tradeId: string, qrCode: string, upiId: string, instructions: string) => Promise<void>;
  onReportPayment: (tradeId: string) => Promise<void>;
  onSubmitCredentials: (tradeId: string, riotId: string, riotPassword: string) => Promise<void>;
  open: boolean;
}

export function ManualTradeDetailModal({ 
  darkMode, 
  trade, 
  onClose, 
  onConfirmReceived,
  onAddPaymentInfo,
  onReportPayment,
  onSubmitCredentials,
  open 
}: ManualTradeDetailModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showCredentialsForm, setShowCredentialsForm] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Payment form state
  const [qrCode, setQrCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Credentials form state
  const [riotId, setRiotId] = useState('');
  const [riotPassword, setRiotPassword] = useState('');

  if (!trade) {
    return null;
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Enhanced Status Badge Component
  const StatusBadge = ({ status }: { status: Trade['status'] }) => {
    const statusConfig = {
      pending_payment: {
        label: 'Pending Payment',
        bgClass: darkMode ? 'bg-yellow-500/20 border-yellow-500/40' : 'bg-yellow-100 border-yellow-300',
        textClass: darkMode ? 'text-yellow-400' : 'text-yellow-700',
        icon: Clock
      },
      payment_reported: {
        label: 'Payment Reported',
        bgClass: darkMode ? 'bg-blue-500/20 border-blue-500/40' : 'bg-blue-100 border-blue-300',
        textClass: darkMode ? 'text-blue-400' : 'text-blue-700',
        icon: Bell
      },
      credentials_shared: {
        label: 'Credentials Shared',
        bgClass: darkMode ? 'bg-purple-500/20 border-purple-500/40' : 'bg-purple-100 border-purple-300',
        textClass: darkMode ? 'text-purple-400' : 'text-purple-700',
        icon: Shield
      },
      completed: {
        label: 'Completed',
        bgClass: darkMode ? 'bg-green-500/20 border-green-500/40' : 'bg-green-100 border-green-300',
        textClass: darkMode ? 'text-green-400' : 'text-green-700',
        icon: CheckCircle
      },
      cancelled: {
        label: 'Cancelled',
        bgClass: darkMode ? 'bg-gray-500/20 border-gray-500/40' : 'bg-gray-100 border-gray-300',
        textClass: darkMode ? 'text-gray-400' : 'text-gray-700',
        icon: X
      }
    };

    const config = statusConfig[status] || statusConfig.pending_payment;
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm ${config.bgClass} ${config.textClass}`}>
        <Icon size={16} />
        {config.label}
      </div>
    );
  };

  // Progress Tracker Component
  const ProgressTracker = () => {
    const steps = [
      { 
        key: 'requested', 
        label: 'Trade Requested', 
        description: 'Buyer initiated purchase',
        status: 'completed'
      },
      { 
        key: 'pending_payment', 
        label: 'Payment Pending', 
        description: trade.type === 'buy' ? 'Complete payment to seller' : 'Waiting for buyer payment',
        status: trade.status === 'pending_payment' ? 'active' : 'completed'
      },
      { 
        key: 'payment_reported', 
        label: 'Payment Confirmed', 
        description: trade.type === 'buy' ? 'Payment reported, awaiting credentials' : 'Verify payment and share credentials',
        status: trade.status === 'payment_reported' ? 'active' : 
                trade.status === 'credentials_shared' || trade.status === 'completed' ? 'completed' : 'pending'
      },
      { 
        key: 'credentials_shared', 
        label: 'Credentials Shared', 
        description: trade.type === 'buy' ? 'Access account and verify' : 'Credentials delivered to buyer',
        status: trade.status === 'credentials_shared' ? 'active' : 
                trade.status === 'completed' ? 'completed' : 'pending'
      },
      { 
        key: 'completed', 
        label: 'Completed', 
        description: 'Trade finalized successfully',
        status: trade.status === 'completed' ? 'completed' : 'pending'
      }
    ];

    return (
      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className={darkMode ? 'text-cyan-400' : 'text-blue-600'} size={20} />
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Trade Progress Tracker
          </h3>
        </div>
        
        <div className="relative">
          {steps.map((step, index) => {
            const isActive = step.status === 'active';
            const isCompleted = step.status === 'completed';

            return (
              <div key={step.key} className="flex gap-4 relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`absolute left-5 top-12 w-0.5 h-16 ${
                    isCompleted ? 'bg-gradient-to-b from-green-500 to-green-400' : 
                    darkMode ? 'bg-white/10' : 'bg-gray-300'
                  }`} />
                )}
                
                {/* Step Icon */}
                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50' 
                      : isActive 
                        ? 'bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/50 animate-pulse' 
                        : darkMode ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={20} className="text-white" />
                    ) : isActive ? (
                      <Zap size={20} className="text-white" />
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-16">
                  <div className={`font-bold mb-1 ${
                    isActive ? darkMode ? 'text-cyan-400' : 'text-blue-600' : 
                    isCompleted ? darkMode ? 'text-green-400' : 'text-green-600' : 
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </div>
                  {isActive && (
                    <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${
                      darkMode ? 'text-cyan-400' : 'text-blue-600'
                    }`}>
                      <ArrowRight size={14} />
                      Action Required
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Trust Indicators Component
  const TrustIndicators = () => (
    <div className={`p-4 rounded-xl border ${darkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-300'}`}>
      <div className="flex items-start gap-3">
        <Shield className={`${darkMode ? 'text-cyan-400' : 'text-cyan-600'} flex-shrink-0`} size={20} />
        <div className="flex-1">
          <h4 className={`font-semibold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Secure Trade Process
          </h4>
          <ul className={`space-y-1 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex items-center gap-2">
              <CheckCircle size={12} className="text-green-500" />
              Seller notified of your purchase
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={12} className="text-green-500" />
              Credentials released after payment confirmation
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={12} className="text-green-500" />
              Secure manual verification process
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Buyer Next Step Guide Component
  const BuyerNextStepGuide = () => {
    if (trade.type !== 'buy') return null;

    let stepContent = null;

    if (trade.status === 'pending_payment' && (trade.payment_qr_code || trade.payment_upi_id)) {
      stepContent = (
        <>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Next Step: Complete Payment</h4>
          <ol className={`list-decimal list-inside space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>Scan the QR code or use the UPI ID below</li>
            <li>Complete payment of ₹{trade.total_amount.toLocaleString('en-IN')}</li>
            <li>Click "Confirm Payment Sent" button</li>
            <li>Wait for seller to share credentials</li>
          </ol>
        </>
      );
    } else if (trade.status === 'payment_reported') {
      stepContent = (
        <>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Next Step: Wait for Credentials</h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Your payment has been reported. The seller is verifying and will share account credentials shortly.
          </p>
        </>
      );
    } else if (trade.status === 'credentials_shared') {
      stepContent = (
        <>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Next Step: Verify & Confirm</h4>
          <ol className={`list-decimal list-inside space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>Copy the credentials below</li>
            <li>Log into the account and verify details</li>
            <li>Click "Confirm Account Received" to complete</li>
          </ol>
        </>
      );
    }

    if (!stepContent) return null;

    return (
      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-300'}`}>
        <div className="flex items-start gap-3">
          <Info className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} flex-shrink-0`} size={20} />
          <div className="flex-1">
            {stepContent}
          </div>
        </div>
      </div>
    );
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    await onConfirmReceived(trade.id);
    setIsConfirming(false);
    setShowConfirmDialog(false);
  };

  const handleAddPaymentInfo = async () => {
    if (!qrCode && !upiId) {
      alert('Please provide QR code or UPI ID');
      return;
    }
    await onAddPaymentInfo(trade.id, qrCode, upiId, instructions);
    setShowPaymentForm(false);
  };

  const handleReportPayment = async () => {
    await onReportPayment(trade.id);
  };

  const handleSubmitCredentials = async () => {
    if (!riotId || !riotPassword) {
      alert('Please provide both Riot ID and password');
      return;
    }
    await onSubmitCredentials(trade.id, riotId, riotPassword);
    setShowCredentialsForm(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-xl border shadow-2xl ${
              darkMode ? 'bg-[#0d0d0d]/95 border-white/10' : 'bg-white/95 border-gray-300/30'
            }`}
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 p-6 border-b backdrop-blur-xl ${darkMode ? 'border-white/10 bg-[#0d0d0d]/95' : 'border-gray-300/30 bg-white/95'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={onClose} 
                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trade Details</h2>
                    <p className="text-sm text-gray-400">ID: {trade.id.slice(0, 8)}...</p>
                  </div>
                  <StatusBadge status={trade.status} />
                </div>
                <button 
                  onClick={onClose} 
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Account Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold">
                        {trade.account_rank}
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        trade.type === 'buy'
                          ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                          : darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {trade.type === 'buy' ? 'Buying' : 'Selling'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Level {trade.account_level} • {trade.account_skins} Premium Skins • {trade.region}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      ₹{trade.total_amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-400">{new Date(trade.created_at).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
              </motion.div>

              {/* Progress Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ProgressTracker />
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <TrustIndicators />
              </motion.div>

              {/* Buyer Next Step Guide */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <BuyerNextStepGuide />
              </motion.div>

              {/* Seller: Add Payment Info */}
              {trade.type === 'sell' && trade.status === 'pending_payment' && !trade.has_payment_info && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`p-6 rounded-xl border ${darkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-300'}`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Bell className="text-yellow-400 flex-shrink-0" size={24} />
                    <div className="flex-1">
                      <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Pending Trade Request
                      </h4>
                      <div className={`space-y-1 mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <p><strong>Buyer:</strong> {trade.buyer_name}</p>
                        <p><strong>Account:</strong> {trade.account_rank} • Level {trade.account_level}</p>
                        <p><strong>Transaction Amount:</strong> ₹{trade.total_amount.toLocaleString('en-IN')}</p>
                      </div>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        A buyer wants to purchase your account. Provide your payment details so they can complete the payment.
                      </p>
                      {!showPaymentForm ? (
                        <button
                          onClick={() => setShowPaymentForm(true)}
                          className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
                        >
                          Provide Payment Details
                        </button>
                      ) : (
                        <div className="space-y-4 mt-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Payment QR Code (Image URL or Base64)
                            </label>
                            <input
                              type="text"
                              value={qrCode}
                              onChange={(e) => setQrCode(e.target.value)}
                              placeholder="https://example.com/qr.png or data:image/png;base64,..."
                              className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 focus:border-blue-500'}`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              UPI ID
                            </label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="yourname@upi"
                              className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 focus:border-blue-500'}`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Payment Instructions (Optional)
                            </label>
                            <textarea
                              value={instructions}
                              onChange={(e) => setInstructions(e.target.value)}
                              placeholder="Any special instructions for the buyer..."
                              rows={3}
                              className={`w-full px-4 py-3 rounded-lg border outline-none resize-none ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 focus:border-blue-500'}`}
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={handleAddPaymentInfo}
                              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
                            >
                              Submit Payment Info
                            </button>
                            <button
                              onClick={() => setShowPaymentForm(false)}
                              className={`px-6 py-3 rounded-lg font-semibold ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Buyer: Payment Section */}
              {trade.type === 'buy' && trade.status === 'pending_payment' && (trade.payment_qr_code || trade.payment_upi_id) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`p-6 rounded-xl border ${darkMode ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300'}`}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={24} />
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Payment Information
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* QR Code Section */}
                    {trade.payment_qr_code && (
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white border border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <QrCode size={18} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Scan to Pay
                          </p>
                        </div>
                        <div className="flex justify-center p-4 bg-white rounded-lg">
                          <img src={trade.payment_qr_code} alt="Payment QR Code" className="max-w-full max-h-64" />
                        </div>
                      </div>
                    )}
                    
                    {/* UPI & Instructions */}
                    <div className="space-y-4">
                      {trade.payment_upi_id && (
                        <div>
                          <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            UPI ID:
                          </p>
                          <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-black/30' : 'bg-white border border-gray-200'}`}>
                            <code className={`font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {trade.payment_upi_id}
                            </code>
                            <button 
                              onClick={() => copyToClipboard(trade.payment_upi_id!, 'upi')} 
                              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                            >
                              {copiedField === 'upi' ? (
                                <CheckCircle size={16} className="text-green-400" />
                              ) : (
                                <Copy size={16} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {trade.payment_instructions && (
                        <div>
                          <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Instructions:
                          </p>
                          <p className={`text-sm p-3 rounded-lg ${darkMode ? 'bg-black/30 text-gray-300' : 'bg-white text-gray-700 border border-gray-200'}`}>
                            {trade.payment_instructions}
                          </p>
                        </div>
                      )}
                      
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-cyan-50 border border-cyan-300'}`}>
                        <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Amount to Pay:
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                          ₹{trade.total_amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleReportPayment}
                    className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
                  >
                    Confirm Payment Sent
                  </button>
                </motion.div>
              )}

              {/* Seller: Submit Credentials */}
              {trade.type === 'sell' && trade.status === 'payment_reported' && !trade.has_credentials && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`p-6 rounded-xl border ${darkMode ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'}`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
                    <div className="flex-1">
                      <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Buyer Has Paid - Share Credentials
                      </h4>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        The buyer has reported completing the payment. Please verify the payment in your account and then share the Riot credentials securely.
                      </p>
                      {!showCredentialsForm ? (
                        <button
                          onClick={() => setShowCredentialsForm(true)}
                          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                        >
                          Submit Account Credentials
                        </button>
                      ) : (
                        <div className="space-y-4 mt-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Riot ID (Name#Tag)
                            </label>
                            <input
                              type="text"
                              value={riotId}
                              onChange={(e) => setRiotId(e.target.value)}
                              placeholder="PlayerName#1234"
                              className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 focus:border-blue-500'}`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Account Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={riotPassword}
                                onChange={(e) => setRiotPassword(e.target.value)}
                                placeholder="Enter password"
                                className={`w-full px-4 py-3 rounded-lg border pr-12 outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 focus:border-blue-500'}`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={handleSubmitCredentials}
                              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                            >
                              Submit Credentials
                            </button>
                            <button
                              onClick={() => setShowCredentialsForm(false)}
                              className={`px-6 py-3 rounded-lg font-semibold ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Buyer: View Credentials */}
              {trade.type === 'buy' && trade.status === 'credentials_shared' && trade.riot_id && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`p-6 rounded-xl border ${darkMode ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300'}`}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Lock className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={24} />
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Credentials Available
                    </h3>
                  </div>
                  
                  <CredentialRow 
                    darkMode={darkMode} 
                    label="Riot ID" 
                    value={trade.riot_id} 
                    copied={copiedField === 'riot_id'} 
                    onCopy={() => copyToClipboard(trade.riot_id!, 'riot_id')} 
                  />
                  <CredentialRow 
                    darkMode={darkMode} 
                    label="Password" 
                    value={trade.riot_password!} 
                    copied={copiedField === 'password'} 
                    onCopy={() => copyToClipboard(trade.riot_password!, 'password')} 
                  />

                  <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-300'}`}>
                    <div className="flex gap-3">
                      <AlertTriangle className="text-yellow-400 flex-shrink-0" size={20} />
                      <div>
                        <div className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Verify Account Access
                        </div>
                        <div className="text-xs text-gray-400">
                          Please log in and verify the account details match the listing before confirming.
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
                  >
                    Confirm Account Received
                  </button>
                </motion.div>
              )}

              {/* Completed Status */}
              {trade.status === 'completed' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-8 rounded-xl border text-center ${darkMode ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'}`}
                >
                  <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
                  <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Trade Completed Successfully!
                  </h3>
                  <p className="text-gray-400 mb-4">
                    This trade has been finalized. Thank you for using GameXchange!
                  </p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white border border-gray-200'}`}>
                    <Shield size={16} className="text-green-500" />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Secure transaction completed
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl">
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className={`w-full max-w-md p-6 m-6 rounded-2xl ${darkMode ? 'bg-[#0d0d0d] border border-white/10' : 'bg-white border border-gray-300'}`}
                >
                  <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Confirm Account Receipt</h3>
                  <p className="text-gray-400 mb-6">
                    By confirming, you acknowledge that you have successfully accessed the account and verified it matches the listing.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => void handleConfirm()}
                      disabled={isConfirming}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold disabled:opacity-60"
                    >
                      {isConfirming ? 'Confirming...' : 'Yes, Confirm'}
                    </button>
                    <button
                      onClick={() => setShowConfirmDialog(false)}
                      className={`flex-1 py-3 rounded-xl font-semibold ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-900'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CredentialRow({
  darkMode,
  label,
  value,
  copied,
  onCopy,
}: {
  darkMode: boolean;
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className={`p-4 rounded-lg mb-3 ${darkMode ? 'bg-black/30' : 'bg-white'}`}>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="flex items-center justify-between gap-3">
        <code className={`font-mono break-all ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</code>
        <button onClick={onCopy} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
          {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
        </button>
      </div>
    </div>
  );
}
