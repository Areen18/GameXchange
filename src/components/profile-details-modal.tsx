import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Calendar, Mail, Shield, ShoppingBag, User, X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { User as MarketplaceUser } from '../types/marketplace';

interface ProfileDetailsModalProps {
  darkMode: boolean;
  open: boolean;
  onClose: () => void;
  user?: MarketplaceUser;
  activeTradesCount: number;
  listingsCount: number;
}

export function ProfileDetailsModal({
  darkMode,
  open,
  onClose,
  user,
  activeTradesCount,
  listingsCount,
}: ProfileDetailsModalProps) {
  const joinedOn = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recently joined';

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
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Profile</h2>
                    <p className="text-sm text-gray-400">Your account details and activity</p>
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
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4655] to-[#E11D48] flex items-center justify-center text-white">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user?.full_name || 'Gamer'}
                    </h3>
                    <p className="text-gray-400">{user?.email || 'user@gamexchange.com'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProfileStat darkMode={darkMode} icon={<Shield size={18} className="text-cyan-400" />} label="Active Trades" value={String(activeTradesCount)} />
                <ProfileStat darkMode={darkMode} icon={<ShoppingBag size={18} className="text-[#FF4655]" />} label="Listings" value={String(listingsCount)} />
                <ProfileStat darkMode={darkMode} icon={<Calendar size={18} className="text-amber-400" />} label="Joined" value={joinedOn} />
              </div>

              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
                <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile Details</h4>
                <div className="space-y-4">
                  <DetailRow darkMode={darkMode} icon={<User size={18} />} label="Full Name" value={user?.full_name || 'Not available'} />
                  <DetailRow darkMode={darkMode} icon={<Mail size={18} />} label="Email Address" value={user?.email || 'Not available'} />
                  <DetailRow darkMode={darkMode} icon={<Calendar size={18} />} label="Member Since" value={joinedOn} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ProfileStat({
  darkMode,
  icon,
  label,
  value,
}: {
  darkMode: boolean;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
    </div>
  );
}

function DetailRow({
  darkMode,
  icon,
  label,
  value,
}: {
  darkMode: boolean;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-black/30' : 'bg-white'}`}>
      <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{icon}</div>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className={darkMode ? 'text-white' : 'text-gray-900'}>{value}</div>
      </div>
    </div>
  );
}
