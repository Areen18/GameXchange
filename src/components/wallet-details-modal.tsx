import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, CreditCard, Shield, Wallet, X } from 'lucide-react';
import type { ReactNode } from 'react';

interface WalletDetailsModalProps {
  darkMode: boolean;
  open: boolean;
  onClose: () => void;
  activeTradesCount: number;
}

export function WalletDetailsModal({ darkMode, open, onClose, activeTradesCount }: WalletDetailsModalProps) {
  const escrowAmount = activeTradesCount * 625;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-2xl rounded-2xl backdrop-blur-xl border shadow-2xl ${
              darkMode ? 'bg-[#0d0d0d]/95 border-white/10' : 'bg-white/95 border-gray-300/30'
            }`}
          >
            <div className={`sticky top-0 z-10 p-6 border-b ${darkMode ? 'border-white/10' : 'border-gray-300/30'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Wallet</h2>
                    <p className="text-sm text-gray-400">Payment and escrow overview</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WalletCard
                  darkMode={darkMode}
                  icon={<Wallet size={20} className="text-[#FF4655]" />}
                  label="Available Balance"
                  value="₹0"
                  subtitle="Wallet credits are not enabled yet"
                />
                <WalletCard
                  darkMode={darkMode}
                  icon={<Shield size={20} className="text-cyan-400" />}
                  label="Escrow Tracked"
                  value={`₹${escrowAmount.toLocaleString('en-IN')}`}
                  subtitle="Estimated from your active trades"
                />
              </div>

              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="text-emerald-400" size={20} />
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Wallet Status</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Your wallet section is now clickable. Payments are currently processed through checkout, and escrow totals are reflected here based on tracked trades.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function WalletCard({
  darkMode,
  icon,
  label,
  value,
  subtitle,
}: {
  darkMode: boolean;
  icon: ReactNode;
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}
