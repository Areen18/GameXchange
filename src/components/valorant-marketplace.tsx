import { useEffect, useMemo, useRef, useState } from 'react';
import { Moon, Sun, User, Shield, Settings, Wallet, ShoppingBag, HelpCircle, LogOut, UserCircle, Search, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SellAccountForm } from './sell-account-form';
import { AccountDetailModal } from './account-detail-modal';
import { CheckoutModal } from './checkout-modal';
import { ActiveTrades } from './active-trades';
import { ProfileDetailsModal } from './profile-details-modal';
import { SettingsModal } from './settings-modal';
import { TradeDetailModal } from './trade-detail-modal';
import { WalletDetailsModal } from './wallet-details-modal';
import { cancelTrade, confirmTrade, createTrade, getAccounts, getTrades } from '../utils/api';
import type { AccountListing, Trade, User as MarketplaceUser } from '../types/marketplace';
import valoImage from 'figma:asset/f360f0a27c183a0e446740ac6f0a45404aad0dd6.png';

interface ValorantMarketplaceProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  user?: MarketplaceUser;
}

export function ValorantMarketplace({ darkMode, onToggleDarkMode, onLogout, user }: ValorantMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRank, setSelectedRank] = useState('All Ranks');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [minimumSkins, setMinimumSkins] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [showActiveTrades, setShowActiveTrades] = useState(false);
  const [showAccountDetail, setShowAccountDetail] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showTradeDetail, setShowTradeDetail] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountListing | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [accounts, setAccounts] = useState<AccountListing[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [removingTradeId, setRemovingTradeId] = useState<string | null>(null);
  const [accountActionError, setAccountActionError] = useState('');
  const [error, setError] = useState('');
  const [currentTradeId, setCurrentTradeId] = useState<string | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<{ id: string; amount: number; currency: string } | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    void refreshMarketplace();
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAccounts();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery, selectedRank, selectedRegion, minimumSkins]);

  const featuredAccounts = useMemo(() => accounts.slice(0, 6), [accounts]);
  const trendingAccounts = useMemo(
    () => [...accounts].sort((a, b) => b.price - a.price).slice(0, 4),
    [accounts],
  );

  async function loadAccounts() {
    try {
      const response = await getAccounts({
        search: searchQuery,
        rank: selectedRank,
        region: selectedRegion,
        minSkins: minimumSkins,
      });
      setAccounts(response.accounts);
      setError('');
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Failed to load marketplace listings');
    }
  }

  async function loadTrades() {
    try {
      const response = await getTrades();
      setTrades(response.trades);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Failed to load active trades');
    }
  }

  async function refreshMarketplace() {
    setIsLoading(true);
    await Promise.all([loadAccounts(), loadTrades()]);
    setIsLoading(false);
  }

  async function handleManualRefresh() {
    setIsRefreshing(true);
    await Promise.all([loadAccounts(), loadTrades()]);
    setIsRefreshing(false);
  }

  const handleBuyClick = (account: AccountListing) => {
    setAccountActionError('');
    setSelectedAccount(account);
    setShowAccountDetail(true);
  };

  const handleProceedToCheckout = async () => {
    if (!selectedAccount) return;

    setIsStartingCheckout(true);
    setAccountActionError('');

    try {
      const response = await createTrade(selectedAccount.id);
      setCurrentTradeId(response.trade.id);
      setPaymentOrder(response.paymentOrder);
      setShowAccountDetail(false);
      setShowCheckout(true);
      setError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create trade';

      if (message.includes('active trade')) {
        await loadTrades();
        setShowAccountDetail(false);
        setShowActiveTrades(true);
        setAccountActionError('');
      } else {
        setAccountActionError(message);
      }

      setError(message);
    } finally {
      setIsStartingCheckout(false);
    }
  };

  const handlePaymentComplete = async () => {
    await Promise.all([loadAccounts(), loadTrades()]);
    setShowCheckout(false);
    setSelectedAccount(null);
    setCurrentTradeId(null);
    setPaymentOrder(null);
    
    // Find and show the completed trade
    if (currentTradeId) {
      const trade = trades.find((t) => t.id === currentTradeId);
      if (trade) {
        setSelectedTrade(trade);
        setShowTradeDetail(true);
      }
    }
    setShowActiveTrades(true);
  };

  const handleViewTrade = (tradeId: string) => {
    const trade = trades.find((entry) => entry.id === tradeId);

    if (trade) {
      setSelectedTrade(trade);
      setShowTradeDetail(true);
    }
  };

  const handleConfirmReceived = async (tradeId: string) => {
    await confirmTrade(tradeId);
    await Promise.all([loadAccounts(), loadTrades()]);
    const completedTrade = trades.find((trade) => trade.id === tradeId);

    if (completedTrade) {
      setSelectedTrade({ ...completedTrade, status: 'completed' });
    }
  };

  const handleRemoveTrade = async (tradeId: string) => {
    setRemovingTradeId(tradeId);

    try {
      await cancelTrade(tradeId);
      await Promise.all([loadAccounts(), loadTrades()]);

      if (selectedTrade?.id === tradeId) {
        setSelectedTrade(null);
        setShowTradeDetail(false);
      }
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Failed to remove trade');
    } finally {
      setRemovingTradeId(null);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#0B0B0B]' : 'bg-[#FAFAFA]'}`}>
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        darkMode ? 'bg-[#0B0B0B]/95 border-[#FF4655]/20' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div
                  className="text-2xl font-bold bg-gradient-to-r from-[#FF4655] to-white bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setShowSellForm(false);
                    setShowActiveTrades(false);
                  }}
                >
                  GameXchange
                </div>
                <div className="text-xs text-gray-400">Valorant Marketplace</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => void handleManualRefresh()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  darkMode ? 'bg-white/10 text-white' : 'bg-black/10 text-gray-900'
                }`}
                title="Refresh marketplace"
              >
                <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleDarkMode}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  darkMode ? 'bg-white/10 text-white' : 'bg-black/10 text-gray-900'
                }`}
                title="Toggle theme"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              <div ref={profileRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen((open) => !open)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4655] to-[#E11D48] flex items-center justify-center text-white"
                >
                  <User size={20} />
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 mt-3 w-72 rounded-2xl backdrop-blur-xl border shadow-2xl overflow-hidden z-50 ${
                        darkMode
                          ? 'bg-[#0d0d0d]/95 border-white/10 shadow-[0_0_40px_rgba(6,182,212,0.2)]'
                          : 'bg-white/95 border-gray-300/30 shadow-[0_0_40px_rgba(37,99,235,0.2)]'
                      }`}
                    >
                      <div className={`p-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-300/30'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF4655] to-[#E11D48] flex items-center justify-center text-white">
                            <User size={24} />
                          </div>
                          <div>
                            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user?.full_name || 'Gamer'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {user?.email || 'user@gamexchange.com'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setShowProfileDetails(true);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            darkMode ? 'text-gray-300 hover:text-[#FF4655] hover:bg-[#FF4655]/10' : 'text-gray-700 hover:text-[#E11D48] hover:bg-[#E11D48]/10'
                          }`}
                        >
                          <UserCircle size={18} />
                          <span className="text-sm font-medium">My Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setShowSellForm(true);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            darkMode ? 'text-gray-300 hover:text-[#FF4655] hover:bg-[#FF4655]/10' : 'text-gray-700 hover:text-[#E11D48] hover:bg-[#E11D48]/10'
                          }`}
                        >
                          <ShoppingBag size={18} />
                          <span className="text-sm font-medium">Create Listing</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setShowActiveTrades(true);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            darkMode ? 'text-gray-300 hover:text-[#FF4655] hover:bg-[#FF4655]/10' : 'text-gray-700 hover:text-[#E11D48] hover:bg-[#E11D48]/10'
                          }`}
                        >
                          <Shield size={18} />
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">Active Trades</div>
                            <div className="text-xs text-[#FF4655]">{trades.length} tracked</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setShowWalletDetails(true);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            darkMode ? 'text-gray-300 hover:text-[#FF4655] hover:bg-[#FF4655]/10' : 'text-gray-700 hover:text-[#E11D48] hover:bg-[#E11D48]/10'
                          }`}
                        >
                          <Wallet size={18} />
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">Wallet</div>
                            <div className="text-xs text-gray-400">Escrow-calculated at checkout</div>
                          </div>
                        </button>
                        <div className={`my-2 border-t ${darkMode ? 'border-white/10' : 'border-gray-300/30'}`} />
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setShowSettings(true);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            darkMode ? 'text-gray-300 hover:text-[#FF4655] hover:bg-[#FF4655]/10' : 'text-gray-700 hover:text-[#E11D48] hover:bg-[#E11D48]/10'
                          }`}
                        >
                          <Settings size={18} />
                          <span className="text-sm font-medium">Settings</span>
                        </button>
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            darkMode ? 'text-gray-300 hover:text-[#FF4655] hover:bg-[#FF4655]/10' : 'text-gray-700 hover:text-[#E11D48] hover:bg-[#E11D48]/10'
                          }`}
                        >
                          <HelpCircle size={18} />
                          <span className="text-sm font-medium">Support / Help Center</span>
                        </button>
                        <div className={`my-2 border-t ${darkMode ? 'border-white/10' : 'border-gray-300/30'}`} />
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <LogOut size={18} />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showSellForm ? (
        <SellAccountForm
          darkMode={darkMode}
          onClose={() => setShowSellForm(false)}
          onCreated={async () => {
            setShowSellForm(false);
            await Promise.all([loadAccounts(), loadTrades()]);
          }}
        />
      ) : showActiveTrades ? (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tracked Trades</h1>
              <p className="text-gray-400">Every purchase and delivery status is now backed by Neon.</p>
            </div>
            <motion.button
              whileHover={{ x: -4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowActiveTrades(false)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                darkMode 
                  ? 'border-white/10 text-white hover:bg-white/5 hover:border-white/20' 
                  : 'border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back to Marketplace</span>
            </motion.button>
          </div>
          <ActiveTrades
            darkMode={darkMode}
            trades={trades}
            onViewTrade={handleViewTrade}
            onRemoveTrade={handleRemoveTrade}
            removingTradeId={removingTradeId}
          />
        </section>
      ) : (
        <>
          <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'><path d='M 40 0 L 0 0 0 40' fill='none' stroke='white' stroke-width='1'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)'/></svg>\")",
                }}
              />
            </div>
            <div className="relative z-10 max-w-5xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={`text-4xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Buy & Sell Valorant Accounts Securely
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`text-lg md:text-xl mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex gap-4 justify-center flex-wrap"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('accounts')}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF4655] to-[#F43F5E] text-white font-semibold shadow-lg hover:shadow-[0_0_40px_rgba(255,70,85,0.7)] transition-shadow"
                >
                  Browse Accounts
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSellForm(true)}
                  className={`px-8 py-4 rounded-xl font-semibold border-2 transition-colors ${
                    darkMode ? 'border-[#FF4655] text-[#FF4655] hover:bg-[#FF4655]/10' : 'border-[#E11D48] text-[#E11D48] hover:bg-[#E11D48]/10'
                  }`}
                >
                  Sell Your Account
                </motion.button>
              </motion.div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Find Your Perfect Account
            </h2>
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl backdrop-blur-xl border ${
              darkMode ? 'bg-[#0d0d0d]/60 border-white/10' : 'bg-white/60 border-gray-300/30'
            }`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-all ${
                    darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                  } focus:ring-4 focus:ring-cyan-500/10`}
                />
              </div>
              <select
                value={selectedRank}
                onChange={(event) => setSelectedRank(event.target.value)}
                className={`px-4 py-3 rounded-lg border outline-none transition-all ${
                  darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                } focus:ring-4 focus:ring-cyan-500/10`}
              >
                <option>All Ranks</option>
                <option>Iron</option>
                <option>Bronze</option>
                <option>Silver</option>
                <option>Gold</option>
                <option>Platinum</option>
                <option>Diamond</option>
                <option>Immortal</option>
                <option>Radiant</option>
              </select>
              <select
                value={selectedRegion}
                onChange={(event) => setSelectedRegion(event.target.value)}
                className={`px-4 py-3 rounded-lg border outline-none transition-all ${
                  darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                } focus:ring-4 focus:ring-cyan-500/10`}
              >
                <option>All Regions</option>
                <option>NA</option>
                <option>EU</option>
                <option>APAC</option>
                <option>LATAM</option>
                <option>BR</option>
              </select>
              <input
                type="number"
                placeholder="Min skins"
                value={minimumSkins}
                onChange={(event) => setMinimumSkins(event.target.value)}
                className={`px-4 py-3 rounded-lg border outline-none transition-all ${
                  darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                } focus:ring-4 focus:ring-cyan-500/10`}
              />
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="mt-10 text-center text-gray-400">Loading live listings from Neon...</div>
            ) : featuredAccounts.length === 0 ? (
              <div className={`mt-10 rounded-2xl border p-10 text-center ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-300 bg-white'}`}>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>No listings match these filters.</p>
                <p className="mt-2 text-sm text-gray-400">Try widening your search or publish a listing of your own.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8" id="accounts">
                {featuredAccounts.map((account, index) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -8 }}
                    className={`group overflow-hidden rounded-2xl backdrop-blur-xl border transition-all ${
                      darkMode
                        ? 'bg-[#0d0d0d]/60 border-white/10 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.5),0_0_80px_rgba(6,182,212,0.2)]'
                        : 'bg-white/60 border-gray-300/30 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.5),0_0_80px_rgba(37,99,235,0.2)]'
                    }`}
                  >
                    <div className="relative overflow-hidden h-48">
                      <img src={account.image_url || valoImage} alt="Valorant Account" className="w-full h-full object-cover transition-transform duration-400 ease-out group-hover:scale-110" />
                      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs shadow-lg border border-white/20">
                        {account.rank}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out flex flex-col justify-end p-5">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-white">
                            <span className="text-xs font-medium text-cyan-300">Seller</span>
                            <span className="text-sm font-bold">{account.seller_name}</span>
                          </div>
                          <div className="flex items-center justify-between text-white">
                            <span className="text-xs font-medium text-cyan-300">Region</span>
                            <span className="text-sm font-bold">{account.region}</span>
                          </div>
                          <div className="flex items-center justify-between text-white">
                            <span className="text-xs font-medium text-cyan-300">Skins</span>
                            <span className="text-sm font-bold">{account.skins} Premium</span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBuyClick(account)}
                          className="w-full py-2.5 rounded-lg bg-white text-black font-semibold text-sm shadow-lg"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-sm text-gray-400">Level</span>
                          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{account.level}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-sm text-gray-400">Skins</span>
                          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{account.skins}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-sm text-gray-400">Seller</span>
                          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{account.seller_name}</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        ₹{account.price.toLocaleString('en-IN')}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBuyClick(account)}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FF4655] to-black text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(255,70,85,0.5)]"
                      >
                        Buy Account
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {trendingAccounts.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trending Accounts</h2>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-white/5">
                {trendingAccounts.map((account) => (
                  <motion.div
                    key={account.id}
                    whileHover={{ y: -8 }}
                    className={`flex-shrink-0 w-80 p-6 rounded-2xl backdrop-blur-xl border transition-all ${
                      darkMode ? 'bg-[#0d0d0d]/60 border-white/10 hover:border-cyan-500' : 'bg-white/60 border-gray-300/30 hover:border-blue-600'
                    }`}
                  >
                    <div className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-sm mb-4">
                      {account.rank}
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Seller</span>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{account.seller_name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Skins</span>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{account.skins}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      ₹{account.price.toLocaleString('en-IN')}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBuyClick(account)}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold"
                    >
                      View Details
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <AccountDetailModal
        darkMode={darkMode}
        account={selectedAccount}
        onClose={() => {
          setShowAccountDetail(false);
          setSelectedAccount(null);
          setAccountActionError('');
        }}
        onProceedToCheckout={handleProceedToCheckout}
        open={showAccountDetail}
        error={accountActionError}
        isLoading={isStartingCheckout}
      />

      <CheckoutModal
        darkMode={darkMode}
        account={selectedAccount}
        tradeId={currentTradeId || undefined}
        paymentOrder={paymentOrder || undefined}
        onClose={() => {
          setShowCheckout(false);
          setSelectedAccount(null);
          setCurrentTradeId(null);
          setPaymentOrder(null);
        }}
        onBack={() => {
          setShowCheckout(false);
          setShowAccountDetail(true);
        }}
        onPaymentComplete={handlePaymentComplete}
        open={showCheckout}
      />

      <TradeDetailModal
        darkMode={darkMode}
        trade={selectedTrade}
        onClose={() => setShowTradeDetail(false)}
        onConfirmReceived={handleConfirmReceived}
        open={showTradeDetail}
      />

      <ProfileDetailsModal
        darkMode={darkMode}
        user={user}
        activeTradesCount={trades.length}
        listingsCount={accounts.filter((account) => account.seller_name === user?.full_name).length}
        onClose={() => setShowProfileDetails(false)}
        open={showProfileDetails}
      />

      <WalletDetailsModal
        darkMode={darkMode}
        activeTradesCount={trades.length}
        onClose={() => setShowWalletDetails(false)}
        open={showWalletDetails}
      />

      <SettingsModal
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onClose={() => setShowSettings(false)}
        open={showSettings}
      />
    </div>
  );
}
