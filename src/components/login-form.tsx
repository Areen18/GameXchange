import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Lock, Mail, Shield, User, ArrowLeft } from 'lucide-react';
import { login, signup, storeToken, resendVerification } from '../utils/api';
import type { User as AuthUser } from '../types/marketplace';

interface LoginFormProps {
  darkMode: boolean;
  onAuthSuccess: (user: AuthUser) => void;
  onBack?: () => void;
}

export function LoginForm({ darkMode, onAuthSuccess, onBack }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showResendButton, setShowResendButton] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await resendVerification(email);
      setSuccessMessage(response.message);
      setShowResendButton(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (isSignUp) {
      if (!fullName) {
        setError('Please enter your full name');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setError('Password must contain at least one uppercase letter');
        return;
      }
      if (!/[a-z]/.test(password)) {
        setError('Password must contain at least one lowercase letter');
        return;
      }
      if (!/[0-9]/.test(password)) {
        setError('Password must contain at least one number');
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setError('Password must contain at least one special character');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const response = await signup({ email, password, fullName });
        setSuccessMessage(response.message || 'Account created successfully! Please check your email to verify your account.');
        // Don't auto-login for signup - require email verification
        setIsLoading(false);
      } else {
        const response = await login({ email, password });
        storeToken(response.token, response.refreshToken, rememberMe);
        setSuccessMessage('Login successful! Opening your dashboard...');
        setTimeout(() => {
          onAuthSuccess(response.user);
        }, 800);
      }
    } catch (error: any) {
      if (error.message.includes('EMAIL_NOT_VERIFIED')) {
        setError('Please verify your email before logging in. Check your inbox for the verification link.');
        setShowResendButton(true);
      } else {
        setError(error instanceof Error ? error.message : 'Network error. Please check your connection and try again.');
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Blended Card - Adapts to theme */}
      <div className={`relative rounded-2xl p-8 lg:p-10 transition-all duration-500 shadow-2xl ${
        darkMode 
          ? 'bg-[#0d0d0d]/70 border-white/10'
          : 'bg-white/70 border-gray-300/30'
      } backdrop-blur-md border`}>
        
        {/* Subtle Accent Glow */}
        <div className={`absolute inset-0 rounded-2xl opacity-20 blur-2xl transition-opacity duration-500 ${
          darkMode 
            ? 'bg-gradient-to-r from-[#FF4655]/10 to-[#F43F5E]/10'
            : 'bg-gradient-to-r from-[#FF4655]/15 to-[#F43F5E]/15'
        }`} />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          
          {/* Back Button */}
          {onBack && (
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className={`flex items-center gap-2 mb-4 transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Home</span>
            </motion.button>
          )}
          
          {/* Header */}
          <div className="text-center space-y-2">
            {/* MODE INDICATOR */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                isSignUp 
                  ? 'bg-[#FF4655] text-white'
                  : darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                SIGN UP
              </div>
              <div className={`w-8 h-px ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
              <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                !isSignUp 
                  ? 'bg-[#FF4655] text-white'
                  : darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                LOGIN
              </div>
            </div>
            
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg transition-all duration-500 ${
              darkMode 
                ? 'bg-gradient-to-br from-[#FF4655] to-[#F43F5E]' 
                : 'bg-gradient-to-br from-[#FF4655] to-[#F43F5E]'
            }`}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <h2 className={`text-2xl lg:text-3xl font-bold tracking-tight transition-colors duration-500 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {isSignUp ? 'Create Your Account' : 'Login to Your Account'}
            </h2>
            
            <p className={`transition-colors duration-500 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isSignUp ? 'Join GameXchange today' : 'Welcome back, gamer'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name Field (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <label className={`block text-sm font-medium transition-colors duration-500 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl transition-all duration-300 outline-none backdrop-blur-sm border-2 ${
                      darkMode 
                        ? 'bg-black/40 border-white/10 text-white placeholder-gray-500 focus:border-[#FF4655] focus:bg-black/50'
                        : 'bg-white/60 border-gray-300/50 text-gray-900 placeholder-gray-400 focus:border-[#E11D48] focus:bg-white/80'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium transition-colors duration-500 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  emailFocused 
                    ? 'text-[#FF4655]'
                    : (darkMode ? 'text-gray-500' : 'text-gray-400')
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl transition-all duration-300 outline-none backdrop-blur-sm border-2 ${
                    darkMode 
                      ? 'bg-black/40 border-white/10 text-white placeholder-gray-500 focus:border-[#FF4655] focus:bg-black/50 focus:shadow-[0_0_20px_rgba(255,70,85,0.3)]'
                      : 'bg-white/60 border-gray-300/50 text-gray-900 placeholder-gray-400 focus:border-[#E11D48] focus:bg-white/80 focus:shadow-[0_0_20px_rgba(225,29,72,0.2)]'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium transition-colors duration-500 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  passwordFocused 
                    ? 'text-[#F43F5E]'
                    : (darkMode ? 'text-gray-500' : 'text-gray-400')
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl transition-all duration-300 outline-none backdrop-blur-sm border-2 ${
                    darkMode 
                      ? 'bg-black/40 border-white/10 text-white placeholder-gray-500 focus:border-[#F43F5E] focus:bg-black/50 focus:shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                      : 'bg-white/60 border-gray-300/50 text-gray-900 placeholder-gray-400 focus:border-[#F43F5E] focus:bg-white/80 focus:shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <label className={`block text-sm font-medium transition-colors duration-500 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl transition-all duration-300 outline-none backdrop-blur-sm border-2 ${
                      darkMode 
                        ? 'bg-black/40 border-white/10 text-white placeholder-gray-500 focus:border-[#F43F5E] focus:bg-black/50'
                        : 'bg-white/60 border-gray-300/50 text-gray-900 placeholder-gray-400 focus:border-[#F43F5E] focus:bg-white/80'
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <p className="text-green-400 text-sm">{successMessage}</p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <p className="text-red-400 text-sm">{error}</p>
                {showResendButton && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="mt-2 text-sm text-red-300 hover:text-red-200 underline disabled:opacity-50"
                  >
                    {isResending ? 'Sending...' : 'Resend verification email'}
                  </button>
                )}
              </motion.div>
            )}

            {/* Remember Me & Forgot Password (Login Only) */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`w-4 h-4 rounded cursor-pointer transition-all duration-300 border-2 ${
                      darkMode 
                        ? 'accent-[#FF4655] bg-black/40 border-white/20' 
                        : 'accent-[#E11D48] bg-white/60 border-gray-400'
                    }`}
                  />
                  <span className={`text-sm transition-colors ${
                    darkMode 
                      ? 'text-gray-400 group-hover:text-gray-300'
                      : 'text-gray-600 group-hover:text-gray-800'
                  }`}>
                    Remember me
                  </span>
                </label>
                
                <a
                  href="#"
                  className={`text-sm font-medium transition-colors ${
                    darkMode 
                      ? 'text-[#FF4655] hover:text-[#F43F5E]'
                      : 'text-[#E11D48] hover:text-[#F43F5E]'
                  }`}
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode 
                  ? 'bg-gradient-to-r from-[#FF4655] to-[#F43F5E] hover:shadow-[0_0_30px_rgba(255,70,85,0.4)]'
                  : 'bg-gradient-to-r from-[#FF4655] to-[#F43F5E] hover:shadow-[0_0_30px_rgba(255,70,85,0.3)]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isSignUp ? 'Creating account...' : 'Logging in...'}</span>
                </div>
              ) : (
                isSignUp ? 'Sign Up' : 'Login'
              )}
            </motion.button>
          </form>

          {/* Security Badge */}
          <div className={`flex items-center justify-center gap-2 text-xs transition-colors duration-500 ${
            darkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            <Lock className="w-3.5 h-3.5" />
            <span>Secured by Supabase Authentication</span>
          </div>

          {/* Toggle Sign Up/Login */}
          <div className="text-center pt-2">
            <p className={`text-sm transition-colors duration-500 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccessMessage('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setFullName('');
                }}
                className={`font-semibold transition-colors ${
                  darkMode 
                    ? 'text-[#FF4655] hover:text-[#F43F5E]'
                    : 'text-[#E11D48] hover:text-[#F43F5E]'
                }`}
              >
                {isSignUp ? 'Login' : 'Create an account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
