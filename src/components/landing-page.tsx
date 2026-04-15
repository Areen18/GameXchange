import { motion } from 'motion/react';
import { Shield, Award, Clock, Users, ChevronRight, Lock, Zap, Star } from 'lucide-react';

interface LandingPageProps {
  darkMode: boolean;
  onLoginClick: () => void;
}

export function LandingPage({ darkMode, onLoginClick }: LandingPageProps) {
  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-[#0B0B0B]' : 'bg-[#FAFAFA]'
    }`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-[#0B0B0B]/95 border-[#FF4655]/20' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#FF4655] to-white bg-clip-text text-transparent">
                GameXchange
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLoginClick}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#FF4655] to-[#F43F5E] text-white font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(255,70,85,0.5)] transition-shadow"
              >
                Login
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'><path d='M 40 0 L 0 0 0 40' fill='none' stroke='white' stroke-width='1'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)'/></svg>")`,
          }} />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-2 rounded-full bg-[#FF4655]/10 border border-[#FF4655]/20 text-[#FF4655] text-sm font-semibold mb-6"
          >
            Game Account Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`text-5xl md:text-7xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Trade Valorant Accounts
            <br />
            <span className="bg-gradient-to-r from-[#FF4655] to-[#F43F5E] bg-clip-text text-transparent">
              Safely & Securely
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-lg md:text-xl mb-12 max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Join thousands of gamers buying and selling premium Valorant accounts with complete escrow protection. Your transactions are safe, instant, and verified.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoginClick}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#FF4655] to-[#F43F5E] text-white font-semibold shadow-lg hover:shadow-[0_0_40px_rgba(255,70,85,0.7)] transition-shadow text-lg flex items-center gap-2"
            >
              Get Started
              <ChevronRight size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-10 py-4 rounded-xl font-semibold border-2 transition-colors text-lg ${
                darkMode 
                  ? 'border-[#FF4655] text-[#FF4655] hover:bg-[#FF4655]/10' 
                  : 'border-[#E11D48] text-[#E11D48] hover:bg-[#E11D48]/10'
              }`}
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12"
          >
            <div className="text-center">
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4655] to-[#F43F5E] bg-clip-text text-transparent`}>
                50K+
              </div>
              <div className="text-sm text-gray-400 mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4655] to-[#F43F5E] bg-clip-text text-transparent`}>
                ₹2Cr+
              </div>
              <div className="text-sm text-gray-400 mt-1">Transaction Value</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4655] to-[#F43F5E] bg-clip-text text-transparent`}>
                15K+
              </div>
              <div className="text-sm text-gray-400 mt-1">Accounts Sold</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4655] to-[#F43F5E] bg-clip-text text-transparent`}>
                4.9/5
              </div>
              <div className="text-sm text-gray-400 mt-1">User Rating</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Why Choose GameXchange?
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The most secure and trusted platform for Valorant account trading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Shield,
              title: 'Escrow Protection',
              desc: 'All payments secured with escrow until transaction completion',
              color: 'from-[#FF4655] to-[#F43F5E]'
            },
            {
              icon: Zap,
              title: 'Instant Delivery',
              desc: 'Receive account credentials immediately after verification',
              color: 'from-[#FF4655] to-[#F43F5E]'
            },
            {
              icon: Lock,
              title: 'Secure Transactions',
              desc: 'Bank-grade encryption and security for all transactions',
              color: 'from-[#FF4655] to-[#F43F5E]'
            },
            {
              icon: Star,
              title: 'Verified Sellers',
              desc: 'All sellers verified with reputation and review system',
              color: 'from-[#FF4655] to-[#F43F5E]'
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`p-8 rounded-2xl backdrop-blur-xl border transition-all ${
                  darkMode 
                    ? 'bg-[#0d0d0d]/60 border-white/10 hover:border-[#FF4655]/50' 
                    : 'bg-white/60 border-gray-300/30 hover:border-[#E11D48]/50'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                  <Icon size={28} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 ${darkMode ? 'bg-[#0d0d0d]/40' : 'bg-white/40'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Simple, secure, and straightforward process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Lines (hidden on mobile) */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-[#FF4655]/20 via-[#FF4655]/40 to-[#FF4655]/20" style={{ top: '4rem' }} />

            {[
              { num: 1, title: 'Create Account', desc: 'Sign up with email verification in seconds' },
              { num: 2, title: 'Browse Listings', desc: 'Find the perfect account with our filters' },
              { num: 3, title: 'Secure Payment', desc: 'Pay safely with escrow protection' },
              { num: 4, title: 'Instant Transfer', desc: 'Receive credentials immediately' },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative z-10"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FF4655] to-[#F43F5E] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {step.num}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center p-16 rounded-3xl border relative overflow-hidden ${
            darkMode 
              ? 'bg-gradient-to-br from-[#FF4655]/10 to-[#F43F5E]/10 border-white/10' 
              : 'bg-gradient-to-br from-[#FF4655]/10 to-[#F43F5E]/10 border-gray-300/30'
          }`}
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='dots' width='30' height='30' patternUnits='userSpaceOnUse'><circle cx='15' cy='15' r='2' fill='white'/></pattern></defs><rect width='60' height='60' fill='url(%23dots)'/></svg>")`,
            }} />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF4655] to-[#F43F5E] bg-clip-text text-transparent">
              Ready to Start Trading?
            </h2>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join 50,000+ gamers who trust GameXchange for secure account trading
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoginClick}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#FF4655] to-[#F43F5E] text-white font-semibold shadow-lg hover:shadow-[0_0_40px_rgba(255,70,85,0.7)] transition-shadow text-lg flex items-center gap-2 mx-auto"
            >
              Login / Sign Up Now
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`border-t mt-12 ${
        darkMode 
          ? 'bg-[#0a0a0a]/80 border-white/10' 
          : 'bg-white/80 border-gray-300/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                GameXchange
              </h3>
              <p className="text-sm text-gray-400">
                India's most trusted marketplace for Valorant account trading.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Links
              </h3>
              <ul className="space-y-2">
                {['About Us', 'How It Works', 'Pricing', 'FAQ'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-[#FF4655] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Support
              </h3>
              <ul className="space-y-2">
                {['Help Center', 'Contact Us', 'Report Issue', 'Trust & Safety'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-[#FF4655] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Legal
              </h3>
              <ul className="space-y-2">
                {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Disclaimer'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-[#FF4655] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              © 2026 GameXchange. All rights reserved. Not affiliated with Riot Games.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
