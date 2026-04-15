import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Loader, Mail, ArrowRight } from 'lucide-react';
import { verifyEmail, storeToken } from '../utils/api';
import type { User } from '../types/marketplace';

interface VerifyEmailPageProps {
  darkMode: boolean;
  token: string | null;
  onVerificationSuccess: (user: User) => void;
  onBackToLogin: () => void;
}

export function VerifyEmailPage({ darkMode, token, onVerificationSuccess, onBackToLogin }: VerifyEmailPageProps) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        storeToken(response.token, response.refreshToken, true);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
        
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          onVerificationSuccess(response.user);
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to verify email. The link may have expired.');
      }
    };

    verify();
  }, [token, onVerificationSuccess]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
      darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md rounded-2xl p-8 transition-all duration-500 shadow-2xl ${
          darkMode 
            ? 'bg-[#0d0d0d]/70 border-white/10'
            : 'bg-white/70 border-gray-300/30'
        } backdrop-blur-md border`}
      >
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            {status === 'verifying' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center"
              >
                <Loader className="w-10 h-10 text-white" />
              </motion.div>
            )}
            
            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
            )}
            
            {status === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center"
              >
                <XCircle className="w-10 h-10 text-white" />
              </motion.div>
            )}
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-bold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {status === 'verifying' && 'Verifying Your Email'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h2>

          {/* Message */}
          <p className={`mb-6 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {message}
          </p>

          {/* Success Animation */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
              }`}>
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Redirecting to dashboard...</span>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {status === 'success' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onVerificationSuccess({ id: '', email: '', full_name: '' } as User)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              >
                <span className="flex items-center justify-center gap-2">
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </span>
              </motion.button>
            )}

            {status === 'error' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBackToLogin}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  darkMode
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Back to Login
              </motion.button>
            )}
          </div>

          {/* Help Text */}
          {status === 'error' && (
            <p className={`mt-6 text-sm ${
              darkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Need help? Contact support or try signing up again.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
