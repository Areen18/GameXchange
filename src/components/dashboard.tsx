import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Shield, 
  Wallet, 
  ChevronDown,
  ChevronRight,
  User,
  Settings,
  Lock,
  LogOut,
  Star,
  Eye,

  
  ShoppingBag,
  Bell,
  MessageSquare,
  AlertCircle,
  ArrowUpDown
} from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { WalletLoading } from './wallet-loading';
import { BuyAccountsPage } from './buy-accounts-page';
import valorantImage from 'figma:asset/394da8fa90b62156e4eb134efb4382de90103bd6.png';
import cs2Image from 'figma:asset/b949b3f01060c59350b3cb6cc79f7bb080a15040.png';
import clashOfClansImage from 'figma:asset/a18a0570d02590f6fb286d6226d422b862a6d6c4.png';
import clashRoyaleImage from 'figma:asset/ec5ec14bed30b52e58c9f3073c312d5c60b3794b.png';

interface DashboardProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export function Dashboard({ darkMode, onToggleDarkMode, onLogout }: DashboardProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoadingBuy, setIsLoadingBuy] = useState(false);
  const [showBuyPage, setShowBuyPage] = useState(false);

  const handleBuyClick = () => {
    setIsLoadingBuy(true);
    
    // Show buy page after 5 seconds
    setTimeout(() => {
      setIsLoadingBuy(false);
      setShowBuyPage(true);
    }, 5000);
  };

  const handleBackToDashboard = () => {
    setShowBuyPage(false);
  };

  // Show loading animation
  if (isLoadingBuy) {
    return <WalletLoading darkMode={darkMode} />;
  }

  // Show buy accounts page
  if (showBuyPage) {
    return <BuyAccountsPage darkMode={darkMode} onBack={handleBackToDashboard} />;
  }

  const games = [
    { 
      name: 'Valorant', 
      listings: 234,
      image: valorantImage
    },
    { 
      name: 'CS2', 
      listings: 189,
      image: cs2Image
    },
    { 
      name: 'Clash of Clans', 
      listings: 156,
      image: clashOfClansImage
    },
    { 
      name: 'Clash Royale', 
      listings: 142,
      image: clashRoyaleImage
    },
  ];

  const featuredListings = [
    {
      game: 'Valorant',
      rank: 'Immortal 3',
      price: 450,
      sellerRating: 4.9,
      escrowProtected: true,
      image: valorantImage
    },
    {
      game: 'CS2',
      rank: 'Global Elite',
      price: 890,
      sellerRating: 5.0,
      escrowProtected: true,
      image: cs2Image
    },
    {
      game: 'Clash of Clans',
      rank: 'TH15 Max',
      price: 320,
      sellerRating: 4.8,
      escrowProtected: true,
      image: clashOfClansImage
    },
    {
      game: 'Clash Royale',
      rank: 'King Level 14',
      price: 275,
      sellerRating: 4.7,
      escrowProtected: true,
      image: clashRoyaleImage
    },
  ];

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'
    }`}>
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className={`sticky top-0 z-40 backdrop-blur-lg transition-colors duration-500 border-b ${
          darkMode 
            ? 'bg-[#0a0a0a]/80 border-white/10' 
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight">
                <span className={`text-transparent bg-clip-text transition-all duration-500 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-500'
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600'
                }`}
                  style={{
                    filter: darkMode 
                      ? 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))'
                      : 'drop-shadow(0 0 10px rgba(37, 99, 235, 0.5)) drop-shadow(0 0 20px rgba(124, 58, 237, 0.3))',
                    WebkitTextStroke: darkMode ? '0.5px rgba(6, 182, 212, 0.3)' : '0.5px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  GameXchange
                </span>
              </h1>
            </div>

            {/* Center Navigation - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {['Buy', 'Sell', 'Market', 'My Trades'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => tab === 'Buy' && handleBuyClick()}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    tab === 'Market'
                      ? darkMode
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-blue-500/20 text-blue-600'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-white/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right Side - User Info */}
            <div className="flex items-center gap-4">
              {/* Wallet Balance */}
              <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-white/5 border border-white/10' 
                  : 'bg-gray-100 border border-gray-200'
              }`}>
                <Wallet className={`w-4 h-4 ${
                  darkMode ? 'text-cyan-400' : 'text-blue-600'
                }`} />
                <span className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Rs 2,450.00
                </span>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    darkMode 
                      ? 'hover:bg-white/5' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    darkMode 
                      ? 'bg-gradient-to-br from-cyan-500 to-purple-600' 
                      : 'bg-gradient-to-br from-blue-500 to-violet-600'
                  }`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className={`hidden sm:block font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ProGamer
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  } ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden ${
                      darkMode 
                        ? 'bg-[#1a1a1a] border-white/10' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className={`px-4 py-3 border-b ${
                      darkMode ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <p className={`text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        ProGamer
                      </p>
                      <p className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        pro@gamexchange.com
                      </p>
                    </div>

                    <div className="py-2">
                      {[
                        { icon: User, label: 'Profile' },
                        { icon: ShoppingBag, label: 'Transactions' },
                        { icon: Lock, label: 'Security' },
                        { icon: Settings, label: 'Settings' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${
                            darkMode 
                              ? 'hover:bg-white/5 text-gray-300 hover:text-white' 
                              : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}

                      <div className={`border-t ${
                        darkMode ? 'border-white/10' : 'border-gray-200'
                      }`}>
                        <button
                          onClick={onLogout}
                          className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${
                            darkMode 
                              ? 'hover:bg-red-500/10 text-red-400 hover:text-red-300' 
                              : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className={`relative w-14 h-8 rounded-full transition-colors flex items-center ${
                  darkMode ? 'bg-cyan-500' : 'bg-gray-300'
                }`}
              >
                <motion.div 
                  className="absolute w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                  animate={{
                    x: darkMode ? 30 : 4
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {darkMode ? (
                    <div className="w-3 h-3 bg-cyan-500 rounded-full" />
                  ) : (
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Buy Accounts Card */}
              <motion.button
                onClick={handleBuyClick}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-8 rounded-2xl overflow-hidden transition-all duration-300 group ${
                  darkMode 
                    ? 'bg-gradient-to-br from-cyan-500 to-purple-600 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]'
                    : 'bg-gradient-to-br from-blue-600 to-violet-600 hover:shadow-[0_0_40px_rgba(37,99,235,0.3)]'
                }`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="relative flex items-start justify-between">
                  <div className="text-left">
                    <ShoppingCart className="w-10 h-10 text-white mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Buy Accounts
                    </h3>
                    <p className="text-white/80 text-sm">
                      Browse premium gaming accounts
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                </div>
              </motion.button>

              {/* Sell Your Account Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-8 rounded-2xl overflow-hidden transition-all duration-300 border-2 group ${
                  darkMode 
                    ? 'bg-[#0d0d0d]/70 border-cyan-500/50 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                    : 'bg-white border-blue-500/50 hover:border-blue-600 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]'
                } backdrop-blur-md`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <Package className={`w-10 h-10 mb-4 ${
                      darkMode ? 'text-cyan-400' : 'text-blue-600'
                    }`} />
                    <h3 className={`text-2xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Sell Your Account
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      List and sell securely
                    </p>
                  </div>
                  <ChevronRight className={`w-6 h-6 transition-colors ${
                    darkMode 
                      ? 'text-gray-600 group-hover:text-cyan-400' 
                      : 'text-gray-400 group-hover:text-blue-600'
                  }`} />
                </div>
              </motion.button>
            </motion.div>

            {/* Game Market Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Popular Games
                </h2>
                <button className={`text-sm font-medium flex items-center gap-1 ${
                  darkMode 
                    ? 'text-cyan-400 hover:text-cyan-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}>
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {games.map((game, index) => (
                  <motion.button
                    key={game.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`relative group rounded-xl overflow-hidden transition-all duration-300 ${
                      darkMode 
                        ? 'bg-[#0d0d0d]/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]' 
                        : 'bg-white hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]'
                    } backdrop-blur-md border ${
                      darkMode ? 'border-white/10' : 'border-gray-200'
                    }`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <ImageWithFallback
                        src={game.image}
                        alt={game.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t transition-opacity ${
                        darkMode 
                          ? 'from-black/80 via-black/20 to-transparent' 
                          : 'from-gray-900/80 via-gray-900/20 to-transparent'
                      }`} />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {game.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {game.listings} listings
                      </p>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                      darkMode 
                        ? 'bg-gradient-to-t from-cyan-500/20 to-transparent' 
                        : 'bg-gradient-to-t from-blue-500/20 to-transparent'
                    }`} />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Featured Account Listings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Featured Listings
                </h2>
                <button className={`text-sm font-medium flex items-center gap-1 ${
                  darkMode 
                    ? 'text-cyan-400 hover:text-cyan-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}>
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredListings.map((listing, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className={`relative group rounded-xl overflow-hidden transition-all duration-300 ${
                      darkMode 
                        ? 'bg-[#0d0d0d]/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]' 
                        : 'bg-white hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]'
                    } backdrop-blur-md border ${
                      darkMode ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={listing.image}
                          alt={listing.game}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className={`font-bold text-lg ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {listing.game}
                            </h3>
                            <p className={`text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {listing.rank}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">{listing.sellerRating}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {listing.escrowProtected && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                              darkMode 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              <Shield className="w-3 h-3" />
                              Escrow Protected
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-2xl font-bold ${
                              darkMode ? 'text-cyan-400' : 'text-blue-600'
                            }`}>
                              Rs {listing.price}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode 
                                  ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' 
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              <Eye className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                                darkMode 
                                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                                  : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                              }`}
                            >
                              Buy Now
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Utility Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block space-y-6"
          >
            {/* Wallet Summary */}
            <div className={`p-6 rounded-xl transition-all duration-300 ${
              darkMode 
                ? 'bg-[#0d0d0d]/70 border-white/10' 
                : 'bg-white border-gray-200'
            } backdrop-blur-md border`}>
              <div className="flex items-center gap-2 mb-4">
                <Wallet className={`w-5 h-5 ${
                  darkMode ? 'text-cyan-400' : 'text-blue-600'
                }`} />
                <h3 className={`font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Wallet Summary
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Available Balance
                  </p>
                  <p className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Rs 2,450.00
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    In Escrow
                  </p>
                  <p className={`text-lg font-semibold ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    Rs 890.00
                  </p>
                </div>
              </div>

              <button className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'bg-white/5 hover:bg-white/10 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}>
                Add Funds
              </button>
            </div>

            {/* Active Trades */}
            <div className={`p-6 rounded-xl transition-all duration-300 ${
              darkMode 
                ? 'bg-[#0d0d0d]/70 border-white/10' 
                : 'bg-white border-gray-200'
            } backdrop-blur-md border`}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className={`w-5 h-5 ${
                  darkMode ? 'text-cyan-400' : 'text-blue-600'
                }`} />
                <h3 className={`font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Active Trades
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-white/5' : 'bg-gray-50'
                }`}>
                  <p className={`text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    CS2 Account
                  </p>
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    In Escrow • Rs 890
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-white/5' : 'bg-gray-50'
                }`}>
                  <p className={`text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Valorant Account
                  </p>
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    Completed • Rs 450
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className={`p-6 rounded-xl transition-all duration-300 ${
              darkMode 
                ? 'bg-[#0d0d0d]/70 border-white/10' 
                : 'bg-white border-gray-200'
            } backdrop-blur-md border`}>
              <div className="flex items-center gap-2 mb-4">
                <Bell className={`w-5 h-5 ${
                  darkMode ? 'text-cyan-400' : 'text-blue-600'
                }`} />
                <h3 className={`font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Notifications
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className={`flex gap-3 p-3 rounded-lg ${
                  darkMode ? 'bg-white/5' : 'bg-gray-50'
                }`}>
                  <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    darkMode ? 'text-cyan-400' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className={`text-xs ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      New message from buyer
                    </p>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      2 minutes ago
                    </p>
                  </div>
                </div>
                
                <div className={`flex gap-3 p-3 rounded-lg ${
                  darkMode ? 'bg-white/5' : 'bg-gray-50'
                }`}>
                  <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                  <div>
                    <p className={`text-xs ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Verification pending
                    </p>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      1 hour ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-colors duration-500 border-t ${
        darkMode 
          ? 'bg-[#0a0a0a]/95 border-white/10' 
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-lg`}>
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {[
            { icon: ShoppingCart, label: 'Buy' },
            { icon: Package, label: 'Sell' },
            { icon: TrendingUp, label: 'Market' },
            { icon: User, label: 'Profile' },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                item.label === 'Market'
                  ? darkMode
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-blue-500/20 text-blue-600'
                  : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}