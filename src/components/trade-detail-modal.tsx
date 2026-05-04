import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, CheckCircle, Clock, Copy, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { Trade } from '../types/marketplace';

interface TradeDetailModalProps {
  darkMode: boolean;
  trade: Trade | null;
  onClose: () => void;
  onConfirmReceived: (tradeId: string) => Promise<void>;
  open: boolean;
}

export function TradeDetailModal({ darkMode, trade, onClose, onConfirmReceived, open }: TradeDetailModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!trade) {
    return null;
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStageStatus = (stage: number) => {
    const statusOrder = ['pending_payment', 'awaiting_credentials', 'credentials_locked', 'verify_access', 'completed'];
    const currentStageIndex = statusOrder.indexOf(trade.status);
    
    if (stage < currentStageIndex) return 'completed';
    if (stage === currentStageIndex) return 'active';
    return 'pending';
  };

  const stages = [
    { label: 'Payment Secured', description: 'Buyer payment held in escrow' },
    { label: 'Credentials Submitted', description: 'Seller submits Riot account credentials' },
    { label: 'Credentials Locked', description: 'Credentials encrypted and secured' },
    { label: 'Buyer Confirms Access', description: 'Buyer verifies account and confirms receipt' },
    { label: 'Payment Released', description: 'Trade completed, payment released to seller' },
  ];

  const handleConfirm = async () => {
    setIsConfirming(true);
    await onConfirmReceived(trade.id);
    setIsConfirming(false);
    setShowConfirmDialog(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-xl border shadow-2xl ${
              darkMode ? 'bg-[#0d0d0d]/95 border-white/10' : 'bg-white/95 border-gray-300/30'
            }`}
          >
            <div className={`sticky top-0 z-10 p-6 border-b backdrop-blur-xl ${darkMode ? 'border-white/10 bg-[#0d0d0d]/95' : 'border-gray-300/30 bg-white/95'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={onClose} 
                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trade Details</h2>
                    <p className="text-sm text-gray-400">ID: {trade.id}</p>
                  </div>
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
              <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
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
              </div>

              <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="text-cyan-400" size={20} />
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Escrow Progress</h3>
                </div>
                <div className="space-y-4">
                  {stages.map((stage, index) => {
                    const status = getStageStatus(index);
                    return (
                      <div key={stage.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            status === 'completed'
                              ? 'bg-green-500 text-white'
                              : status === 'active'
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white animate-pulse'
                                : darkMode ? 'bg-white/10 text-gray-500' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {status === 'completed' ? <CheckCircle size={20} /> : status === 'active' ? <Clock size={20} /> : <div className="w-2 h-2 rounded-full bg-gray-400" />}
                          </div>
                          {index < stages.length - 1 && <div className={`w-0.5 h-12 my-1 ${status === 'completed' ? 'bg-green-500' : darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className={`font-semibold mb-1 ${status === 'active' ? 'text-cyan-400' : status === 'completed' ? 'text-green-400' : 'text-gray-500'}`}>
                            {stage.label}
                          </div>
                          <div className="text-sm text-gray-400">{stage.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${darkMode ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-300'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="text-purple-400" size={20} />
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Account Credentials</h3>
                </div>
                
                {trade.status === 'awaiting_credentials' && trade.type === 'sell' ? (
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-300'}`}>
                    <div className="flex gap-3">
                      <AlertTriangle className="text-yellow-400 flex-shrink-0" size={20} />
                      <div>
                        <div className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Action Required</div>
                        <div className="text-xs text-gray-400 mb-3">
                          The buyer has completed payment. Please submit the Riot account credentials to proceed with the trade.
                        </div>
                        <button
                          onClick={onClose}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold"
                        >
                          Submit Credentials
                        </button>
                      </div>
                    </div>
                  </div>
                ) : trade.status === 'credentials_locked' ? (
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-cyan-50 border border-cyan-300'}`}>
                    <div className="flex gap-3">
                      <Shield className="text-cyan-400 flex-shrink-0" size={20} />
                      <div>
                        <div className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Credentials Locked</div>
                        <div className="text-xs text-gray-400">
                          Your credentials have been encrypted and secured. They will be released to the buyer after verification. Payment will be released to you once the buyer confirms access.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (trade.account_email || trade.riot_id) ? (
                  <>
                    {trade.account_email && (
                      <>
                        <CredentialRow darkMode={darkMode} label="Email Address" value={trade.account_email} copied={copiedField === 'email'} onCopy={() => void copyToClipboard(trade.account_email, 'email')} />
                        <CredentialRow darkMode={darkMode} label="Password" value={trade.account_password} copied={copiedField === 'password'} onCopy={() => void copyToClipboard(trade.account_password, 'password')} />
                        <CredentialRow darkMode={darkMode} label="Security Code" value={trade.security_code} copied={copiedField === 'code'} onCopy={() => void copyToClipboard(trade.security_code, 'code')} />
                      </>
                    )}
                    
                    {trade.riot_id && trade.type === 'sell' && (
                      <>
                        <div className="text-xs text-gray-400 mb-2 mt-4">Submitted Riot Credentials:</div>
                        <CredentialRow darkMode={darkMode} label="Riot ID" value={trade.riot_id} copied={copiedField === 'riot_id'} onCopy={() => void copyToClipboard(trade.riot_id || '', 'riot_id')} />
                        {trade.riot_password && (
                          <CredentialRow darkMode={darkMode} label="Riot Password" value={trade.riot_password} copied={copiedField === 'riot_password'} onCopy={() => void copyToClipboard(trade.riot_password || '', 'riot_password')} />
                        )}
                      </>
                    )}

                    {trade.status === 'verify_access' && trade.type === 'buy' && (
                      <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-300'}`}>
                        <div className="flex gap-3">
                          <AlertTriangle className="text-yellow-400 flex-shrink-0" size={20} />
                          <div>
                            <div className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Important: Verify Access</div>
                            <div className="text-xs text-gray-400">
                              Sign in with the delivered credentials, validate the listing, then confirm receipt to complete the escrow flow.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    Credentials will be available once the seller submits them.
                  </div>
                )}
              </div>

              {trade.status === 'verify_access' && (
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowConfirmDialog(true)}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg"
                  >
                    Confirm Account Received
                  </motion.button>
                </div>
              )}

              {trade.status === 'completed' && (
                <div className={`p-6 rounded-xl border text-center ${darkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-300'}`}>
                  <CheckCircle className="text-green-400 mx-auto mb-3" size={48} />
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trade Completed Successfully</h3>
                  <p className="text-sm text-gray-400">This account is now marked sold and the trade has been finalized.</p>
                </div>
              )}
            </div>

            {showConfirmDialog && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className={`w-full max-w-md p-6 rounded-2xl ${darkMode ? 'bg-[#0d0d0d] border border-white/10' : 'bg-white border border-gray-300'}`}
                >
                  <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Confirm Account Receipt</h3>
                  <p className="text-gray-400 mb-6">
                    By confirming, you acknowledge that you have successfully accessed the account and the listing matched expectations.
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
