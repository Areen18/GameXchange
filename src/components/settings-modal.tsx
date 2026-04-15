import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Bell, Moon, Shield, Sun, X } from 'lucide-react';
import type { ReactNode } from 'react';

interface SettingsModalProps {
  darkMode: boolean;
  open: boolean;
  onClose: () => void;
  onToggleDarkMode: () => void;
}

export function SettingsModal({ darkMode, open, onClose, onToggleDarkMode }: SettingsModalProps) {
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
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
                    <p className="text-sm text-gray-400">Manage your dashboard preferences</p>
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

            <div className="p-6 space-y-4">
              <SettingsRow
                darkMode={darkMode}
                icon={darkMode ? <Moon size={18} className="text-amber-400" /> : <Sun size={18} className="text-cyan-400" />}
                title="Theme Mode"
                description={darkMode ? 'Currently using dark mode' : 'Currently using light mode'}
                actionLabel={darkMode ? 'Switch to Light' : 'Switch to Dark'}
                onAction={onToggleDarkMode}
              />

              <SettingsRow
                darkMode={darkMode}
                icon={<Bell size={18} className="text-[#FF4655]" />}
                title="Notifications"
                description="Trade and account alerts are enabled for this demo"
                actionLabel="Enabled"
              />

              <SettingsRow
                darkMode={darkMode}
                icon={<Shield size={18} className="text-emerald-400" />}
                title="Security"
                description="Your account is protected with email-based authentication"
                actionLabel="Protected"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SettingsRow({
  darkMode,
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  darkMode: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
}) {
  return (
    <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">{icon}</div>
          <div>
            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</div>
            <div className="text-sm text-gray-400 mt-1">{description}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onAction}
          disabled={!onAction}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            onAction
              ? darkMode
                ? 'bg-[#FF4655]/20 text-[#FF4655] hover:bg-[#FF4655]/30'
                : 'bg-[#FFE4E8] text-[#E11D48] hover:bg-[#FFD2DA]'
              : darkMode
                ? 'bg-white/10 text-gray-300 cursor-default'
                : 'bg-white text-gray-700 cursor-default border border-gray-200'
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
