import { useEffect, useState } from 'react';
import { AnimatedBackground } from './components/animated-background';
import { LandingPage } from './components/landing-page';
import { LoginForm } from './components/login-form';
import { LoadingTransition } from './components/loading-transition';
import { ValorantMarketplace } from './components/valorant-marketplace';
import { VerifyEmailPage } from './components/verify-email-page';
import { clearStoredToken, getCurrentUser, getStoredToken, logout } from './utils/api';
import type { User } from './types/marketplace';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for verification token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token && window.location.pathname === '/verify-email') {
      setVerificationToken(token);
      setShowVerifyEmail(true);
      setShowLanding(false);
      setShowLogin(false);
      return;
    }

    void checkSession();
  }, []);

  const checkSession = async () => {
    if (!getStoredToken()) {
      return;
    }

    try {
      const { user } = await getCurrentUser();
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShowLanding(false);
    } catch {
      clearStoredToken();
    }
  };

  const handleLoginClick = () => {
    setShowLanding(false);
    setShowLogin(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoading(true);
    setShowLogin(false);
    setShowVerifyEmail(false);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      setShowLanding(false);
    }, 3000);
  };

  const handleVerificationSuccess = (user: User) => {
    handleAuthSuccess(user);
  };

  const handleBackToLogin = () => {
    setShowVerifyEmail(false);
    setShowLogin(true);
    setVerificationToken(null);
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore errors, just clear local state
    }
    setIsLoggedIn(false);
    setShowLanding(true);
    setShowLogin(false);
    setCurrentUser(null);
  };

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'
    }`}>
      {/* Full-screen Animated Background - Only show on login/verification page */}
      {!isLoggedIn && !showLanding && (
        <div className="fixed inset-0">
          <AnimatedBackground darkMode={darkMode} />
        </div>
      )}

      {/* Loading Transition */}
      {isLoading && <LoadingTransition darkMode={darkMode} />}

      {/* Main Content */}
      {showLanding ? (
        <LandingPage darkMode={darkMode} onLoginClick={handleLoginClick} />
      ) : showVerifyEmail ? (
        <VerifyEmailPage 
          darkMode={darkMode}
          token={verificationToken}
          onVerificationSuccess={handleVerificationSuccess}
          onBackToLogin={handleBackToLogin}
        />
      ) : isLoggedIn ? (
        <ValorantMarketplace 
          darkMode={darkMode} 
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onLogout={handleLogout}
          user={currentUser ?? undefined}
        />
      ) : (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-6xl mx-auto">
            {/* Desktop: Split Layout | Mobile: Stacked */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Left Side - Spacer for GameXchange text (now in background) */}
              <div className="relative order-2 lg:order-1">
                {/* Empty - text is now in the background component */}
              </div>
              
              {/* Right Side - Form with Blended Panel */}
              <div className="order-1 lg:order-2 relative">
                {/* Blended Background Panel */}
                <div className={`absolute inset-0 -inset-x-8 -inset-y-12 lg:-inset-x-16 lg:-inset-y-16 rounded-3xl transition-all duration-500 shadow-2xl ${
                  darkMode 
                    ? 'bg-black/30 border-white/5' 
                    : 'bg-white/40 border-gray-300/30'
                } backdrop-blur-xl border`} />
                
                {/* Form Content */}
                <div className="relative z-10">
                  {showLogin && (
                    <LoginForm 
                      darkMode={darkMode} 
                      onAuthSuccess={handleAuthSuccess}
                      onBack={() => {
                        setShowLogin(false);
                        setShowLanding(true);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
