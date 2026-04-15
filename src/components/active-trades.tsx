import { motion } from 'motion/react';
import { Shield, Clock, CheckCircle, AlertCircle, ArrowRight, Package, Trash2 } from 'lucide-react';
import type { Trade } from '../types/marketplace';

interface ActiveTradesProps {
  darkMode: boolean;
  trades: Trade[];
  onViewTrade: (tradeId: string) => void;
  onRemoveTrade: (tradeId: string) => Promise<void>;
  removingTradeId?: string | null;
}

export function ActiveTrades({ darkMode, trades, onViewTrade, onRemoveTrade, removingTradeId }: ActiveTradesProps) {
  const getStatusInfo = (status: Trade['status']) => {
    switch (status) {
      case 'pending_payment':
        return { label: 'Pending Payment', color: 'yellow', icon: Clock, description: 'Complete checkout to continue this trade' };
      case 'payment_secured':
        return { label: 'Payment Secured', color: 'cyan', icon: Shield, description: 'Your payment is held in escrow' };
      case 'awaiting_details':
        return { label: 'Awaiting Seller', color: 'yellow', icon: Clock, description: 'Waiting for seller details' };
      case 'verify_access':
        return { label: 'Verify Access', color: 'purple', icon: AlertCircle, description: 'Review delivered account credentials' };
      case 'completed':
        return { label: 'Completed', color: 'green', icon: CheckCircle, description: 'Trade completed successfully' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'gray', icon: AlertCircle, description: 'This trade was removed before payment' };
      case 'disputed':
        return { label: 'Under Review', color: 'red', icon: AlertCircle, description: 'Support team is reviewing this trade' };
      default:
        return { label: 'Unknown', color: 'gray', icon: Clock, description: '' };
    }
  };

  const getStatusColor = (color: string) =>
    ({
      cyan: 'from-cyan-500 to-cyan-600',
      yellow: 'from-yellow-500 to-orange-500',
      purple: 'from-purple-500 to-pink-500',
      green: 'from-green-500 to-emerald-500',
      red: 'from-red-500 to-rose-500',
      gray: 'from-gray-500 to-gray-600',
    }[color] || 'from-gray-500 to-gray-600');

  if (trades.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
          <Package size={32} className="text-gray-400" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Active Trades</h3>
        <p className="text-gray-400">Your purchases and sales will appear here once you start trading.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trades.map((trade) => {
        const statusInfo = getStatusInfo(trade.status);
        const StatusIcon = statusInfo.icon;

        return (
          <motion.div
            key={trade.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className={`p-6 rounded-2xl border cursor-pointer transition-all ${
              darkMode ? 'bg-[#0d0d0d]/60 border-white/10 hover:border-cyan-400' : 'bg-white border-gray-300 hover:border-blue-500'
            }`}
            onClick={() => onViewTrade(trade.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getStatusColor(statusInfo.color)} text-white text-xs font-bold`}>
                    {trade.account_rank}
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    trade.type === 'buy'
                      ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                      : darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {trade.type === 'buy' ? 'Buying' : 'Selling'}
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-1">
                  Level {trade.account_level} • {trade.account_skins} Skins • {trade.region}
                </div>
                <div className="text-xs text-gray-500">Trade ID: {trade.id}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-1">
                  ₹{trade.total_amount.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(trade.created_at).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getStatusColor(statusInfo.color)} flex items-center justify-center text-white`}>
                  <StatusIcon size={20} />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{statusInfo.label}</div>
                  <div className="text-xs text-gray-400">{statusInfo.description}</div>
                </div>
                <ArrowRight className="text-gray-400" size={20} />
              </div>
            </div>

            {trade.status === 'pending_payment' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    void onRemoveTrade(trade.id);
                  }}
                  disabled={removingTradeId === trade.id}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  {removingTradeId === trade.id ? 'Removing...' : 'Remove Trade'}
                </button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
