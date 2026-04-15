import { motion } from 'motion/react';
import { 
  Search,
  Filter,
  Star,
  Shield,
  Eye,
  Heart,
  ArrowLeft,
  ChevronDown,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import valorantImage from 'figma:asset/394da8fa90b62156e4eb134efb4382de90103bd6.png';
import cs2Image from 'figma:asset/b949b3f01060c59350b3cb6cc79f7bb080a15040.png';
import clashOfClansImage from 'figma:asset/a18a0570d02590f6fb286d6226d422b862a6d6c4.png';
import clashRoyaleImage from 'figma:asset/ec5ec14bed30b52e58c9f3073c312d5c60b3794b.png';

interface BuyAccountsPageProps {
  darkMode: boolean;
  onBack: () => void;
}

export function BuyAccountsPage({ darkMode, onBack }: BuyAccountsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('All Games');
  const [sortBy, setSortBy] = useState('Featured');

  const allAccounts = [
    {
      id: 1,
      game: 'Valorant',
      rank: 'Immortal 3',
      price: 450,
      sellerRating: 4.9,
      views: 234,
      escrowProtected: true,
      featured: true,
      image: valorantImage,
      description: 'Full access, All agents unlocked'
    },
    {
      id: 2,
      game: 'CS2',
      rank: 'Global Elite',
      price: 890,
      sellerRating: 5.0,
      views: 512,
      escrowProtected: true,
      featured: true,
      image: cs2Image,
      description: 'Prime Status, High Trust Factor'
    },
    {
      id: 3,
      game: 'Valorant',
      rank: 'Radiant',
      price: 1200,
      sellerRating: 4.8,
      views: 891,
      escrowProtected: true,
      featured: true,
      image: valorantImage,
      description: 'Top 500 Leaderboard, All skins'
    },
    {
      id: 4,
      game: 'Clash of Clans',
      rank: 'TH15 Max',
      price: 320,
      sellerRating: 4.8,
      views: 156,
      escrowProtected: true,
      featured: false,
      image: clashOfClansImage,
      description: 'Max heroes, Full army'
    },
    {
      id: 5,
      game: 'Clash Royale',
      rank: 'King Level 14',
      price: 275,
      sellerRating: 4.7,
      views: 98,
      escrowProtected: true,
      featured: false,
      image: clashRoyaleImage,
      description: 'Max cards, High trophies'
    },
    {
      id: 6,
      game: 'CS2',
      rank: 'Supreme Master',
      price: 650,
      sellerRating: 4.9,
      views: 342,
      escrowProtected: true,
      featured: false,
      image: cs2Image,
      description: 'Prime, 2000+ hours'
    },
    {
      id: 7,
      game: 'Valorant',
      rank: 'Diamond 3',
      price: 280,
      sellerRating: 4.6,
      views: 187,
      escrowProtected: true,
      featured: false,
      image: valorantImage,
      description: 'Multiple skins, Good MMR'
    },
    {
      id: 8,
      game: 'Clash of Clans',
      rank: 'TH14 Near Max',
      price: 250,
      sellerRating: 4.7,
      views: 134,
      escrowProtected: true,
      featured: false,
      image: clashOfClansImage,
      description: 'Legends League, Strong heroes'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${
        darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        darkMode 
          ? 'bg-[#0a0a0a]/80 border-white/10' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Buy Accounts
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Secure marketplace with escrow protection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search by game, rank, or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-cyan-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              } focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-cyan-500/20' : 'focus:ring-blue-500/20'
              }`}
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-3">
            {/* Game Filter */}
            <div className="relative">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  darkMode
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedGame}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Sort By */}
            <div className="relative">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  darkMode
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Sort: {sortBy}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filters */}
            <button
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                darkMode
                  ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
                  : 'bg-blue-500/20 border-blue-500/30 text-blue-600 hover:bg-blue-500/30'
              }`}
            >
              Escrow Protected
            </button>
            <button
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              High Rated
            </button>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group rounded-xl overflow-hidden border transition-all hover:scale-[1.02] ${
                darkMode
                  ? 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10'
                  : 'bg-white border-gray-200 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10'
              }`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={account.image}
                  alt={account.game}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {account.featured && (
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold ${
                    darkMode
                      ? 'bg-cyan-500 text-black'
                      : 'bg-blue-500 text-white'
                  }`}>
                    Featured
                  </div>
                )}
                <button
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                    darkMode
                      ? 'bg-black/50 hover:bg-black/70 text-white'
                      : 'bg-white/80 hover:bg-white text-gray-700'
                  } backdrop-blur-sm`}
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Game & Rank */}
                <div>
                  <p className={`text-xs font-medium ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {account.game}
                  </p>
                  <h3 className={`font-bold text-lg ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {account.rank}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {account.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className={`w-3 h-3 ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-500'
                    }`} fill="currentColor" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {account.sellerRating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className={`w-3 h-3 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {account.views}
                    </span>
                  </div>
                  {account.escrowProtected && (
                    <div className="flex items-center gap-1">
                      <Shield className={`w-3 h-3 ${
                        darkMode ? 'text-cyan-400' : 'text-blue-600'
                      }`} />
                      <span className={darkMode ? 'text-cyan-400' : 'text-blue-600'}>
                        Escrow
                      </span>
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-3 border-t ${
                  darkMode ? 'border-white/10' : 'border-gray-200'
                }">
                  <div>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Price
                    </p>
                    <p className={`text-xl font-bold ${
                      darkMode
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'
                    }`}>
                      Rs {account.price}
                    </p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      darkMode
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-400 hover:to-violet-500 text-white'
                    } shadow-lg hover:shadow-xl`}
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
