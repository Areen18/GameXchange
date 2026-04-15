import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, CheckCircle, MapPin, Star, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AccountListing } from '../types/marketplace';

interface AccountDetailModalProps {
  darkMode: boolean;
  account: AccountListing | null;
  onClose: () => void;
  onProceedToCheckout: () => void;
  open: boolean;
  error?: string;
  isLoading?: boolean;
}

export function AccountDetailModal({
  darkMode,
  account,
  onClose,
  onProceedToCheckout,
  open,
  error,
  isLoading = false,
}: AccountDetailModalProps) {
  if (!account) {
    return null;
  }

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
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <button 
                onClick={onClose} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back</span>
              </button>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative h-64 overflow-hidden">
              <img
                src={account.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'}
                alt="Account"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-lg">
                {account.rank}
              </div>
              <div className="absolute top-4 right-16 flex gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-green-500/90 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm">
                  <Shield size={14} />
                  Escrow Protected
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-blue-500/90 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm">
                  <CheckCircle size={14} />
                  Stored in Neon
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="text-4xl font-bold text-white">₹{account.price.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-300">Seller: {account.seller_name}</div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard darkMode={darkMode} label="Region" value={account.region} icon={<MapPin size={18} className="text-cyan-400" />} />
                <StatCard darkMode={darkMode} label="Level" value={String(account.level)} icon={<TrendingUp size={18} className="text-purple-400" />} />
                <StatCard darkMode={darkMode} label="Premium Skins" value={String(account.skins)} icon={<Star size={18} className="text-yellow-400" />} />
                <StatCard darkMode={darkMode} label="Agents" value={account.agents || 'Not specified'} icon={<Users size={18} className="text-cyan-400" />} />
              </div>

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Account Description</h3>
                <p className="text-gray-400 leading-relaxed">{account.description || 'Seller did not include a description for this listing.'}</p>
              </div>

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Full account access',
                    account.email_changeable ? 'Email can be changed' : 'Email locked to current owner',
                    `${account.skins} premium skins`,
                    `Seller: ${account.seller_name}`,
                    'Protected checkout flow',
                    'Persistent trade tracking',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                      <span className="text-gray-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-xl border mb-8 ${darkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-blue-50 border-blue-300'}`}>
                <div className="flex gap-3">
                  <Shield className="text-cyan-400 flex-shrink-0" size={24} />
                  <div>
                    <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Protected by GameXchange Escrow</h4>
                    <p className="text-sm text-gray-400">
                      Your purchase creates a persisted trade record. Once you confirm access, the listing is marked sold and the trade closes cleanly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {error && (
                  <div className="absolute left-8 right-8 -mt-16 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onProceedToCheckout}
                  disabled={isLoading}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Opening Checkout...' : 'Proceed to Secure Purchase'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className={`px-8 py-4 rounded-xl font-semibold border-2 transition-colors ${
                    darkMode ? 'border-white/20 text-white hover:bg-white/5' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function StatCard({ darkMode, label, value, icon }: { darkMode: boolean; label: string; value: string; icon: ReactNode }) {
  return (
    <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'}`}>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}
