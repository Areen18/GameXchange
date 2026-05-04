import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { Trade } from '../types/marketplace';

interface SellerCredentialsModalProps {
  darkMode: boolean;
  trade: Trade | null;
  onClose: () => void;
  onSubmitCredentials: (tradeId: string, riotId: string, riotPassword: string) => Promise<void>;
  open: boolean;
}

export function SellerCredentialsModal({ 
  darkMode, 
  trade, 
  onClose, 
  onSubmitCredentials, 
  open 
}: SellerCredentialsModalProps) {
  const [riotId, setRiotId] = useState('');
  const [riotPassword, setRiotPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!trade) {
    return null;
  }

  const handleSubmit = async () => {
    if (!riotId.trim() || !riotPassword.trim()) {
      setError('Both Riot ID and password are required');
      return;
    }

    // Validate Riot ID format (Name#Tag)
    if (!riotId.includes('#')) {
      setError('Riot ID must be in format: Name#Tag');
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      await onSubmitCredentials(trade.id, riotId, riotPassword);
      setShowConfirmDialog(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit credentials');
      setShowConfirmDialog(false);
    } finally {
      setIsSubmitting(false);
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
            {/* Header */}
            <div className={`sticky top-0 z-10 p-6 border-b backdrop-blur-xl ${
              darkMode ? 'border-white/10 bg-[#0d0d0d]/95' : 'border-gray-300/30 bg-white/95'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Submit Account Credentials
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Trade ID: {trade.id}</p>
                </div>
                <button 
                  onClick={onClose} 
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Trade Info */}
              <div className={`p-6 rounded-xl border ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'
              }`}>
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Account Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rank:</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {trade.account_rank}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {trade.account_level}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sale Price:</span>
                    <span className="font-semibold text-green-400">
                      ₹{trade.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className={`p-6 rounded-xl border ${
                darkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-300'
              }`}>
                <div className="flex gap-3">
                  <Shield className="text-green-400 flex-shrink-0" size={24} />
                  <div>
                    <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Payment Secured in Escrow
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      The buyer's payment of ₹{trade.total_amount.toLocaleString('en-IN')} is securely held in escrow. 
                      Once you submit the credentials and the buyer confirms access, the payment will be released to you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Credentials Form */}
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Riot ID (Name#Tag) *
                  </label>
                  <input
                    type="text"
                    value={riotId}
                    onChange={(e) => setRiotId(e.target.value)}
                    placeholder="Example: PlayerName#1234"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter the Riot ID in the format: Name#Tag
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Account Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={riotPassword}
                      onChange={(e) => setRiotPassword(e.target.value)}
                      placeholder="Enter account password"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors pr-12 ${
                        darkMode 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                      }`}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-300'
              }`}>
                <div className="flex gap-3">
                  <AlertTriangle className="text-yellow-400 flex-shrink-0" size={20} />
                  <div>
                    <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Important Security Notice
                    </h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Credentials will be encrypted and locked until buyer verification</li>
                      <li>• Double-check the Riot ID and password before submitting</li>
                      <li>• Payment will be released only after buyer confirms access</li>
                      <li>• Do not share these credentials outside the platform</li>
                    </ul>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    darkMode 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting || !riotId.trim() || !riotPassword.trim()}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    isSubmitting || !riotId.trim() || !riotPassword.trim()
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg'
                  }`}
                >
                  <Lock size={18} />
                  Submit & Lock Credentials
                </motion.button>
              </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className={`w-full max-w-md p-6 m-6 rounded-2xl ${
                    darkMode ? 'bg-[#0d0d0d] border border-white/10' : 'bg-white border border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                      <CheckCircle className="text-white" size={24} />
                    </div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Confirm Submission
                    </h3>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <p className="text-gray-400 text-sm">
                      Please verify the credentials before submitting:
                    </p>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="text-xs text-gray-400 mb-1">Riot ID:</div>
                      <div className={`font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>{riotId}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="text-xs text-gray-400 mb-1">Password:</div>
                      <div className={`font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {'•'.repeat(riotPassword.length)}
                      </div>
                    </div>
                    <p className="text-xs text-yellow-400">
                      ⚠️ Once submitted, credentials will be encrypted and locked. Make sure they are correct!
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmDialog(false)}
                      disabled={isSubmitting}
                      className={`flex-1 py-3 rounded-xl font-semibold ${
                        darkMode 
                          ? 'bg-white/10 text-white hover:bg-white/20' 
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      } disabled:opacity-50`}
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleConfirmSubmit}
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Confirm & Submit
                        </>
                      )}
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
