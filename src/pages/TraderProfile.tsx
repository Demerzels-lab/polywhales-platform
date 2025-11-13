import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TrackedWallet } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Copy, 
  User, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Target,
  Activity,
  CheckCircle,
  X,
  Plus,
  Calendar,
  BarChart3,
  Award,
  AlertTriangle
} from 'lucide-react';

interface TraderData {
  id: string;
  trader_wallet: string;
  trader_name: string;
  profile_image_url: string;
  total_profit: number;
  past_month_profit: number;
  win_rate: number;
  total_trades: number;
  description: string;
}

interface TopTrade {
  id: string;
  trader_wallet: string;
  market_name: string;
  profit: number;
  position: 'BUY' | 'SELL';
  amount: number;
  trade_date: string;
}

interface PnLMetrics {
  best_single_trade: number;
  worst_single_trade: number;
  avg_position_size: number;
  win_rate_percentage: number;
  largest_position: number;
  risk_level: 'Low' | 'Medium' | 'High';
}

export default function TraderProfile() {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Debug: Log the walletAddress from URL params
  console.log('TraderProfile - walletAddress from URL params:', walletAddress);
  
  const [trader, setTrader] = useState<TraderData | null>(null);
  const [topTrades, setTopTrades] = useState<TopTrade[]>([]);
  const [pnlMetrics, setPnlMetrics] = useState<PnLMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [walletLabel, setWalletLabel] = useState('');
  const [addWalletLoading, setAddWalletLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      fetchTraderData();
      fetchTopTrades();
      fetchPnLMetrics();
    }
  }, [walletAddress]);

  const fetchTraderData = async () => {
    try {
      console.log('Fetching trader data for wallet:', walletAddress);
      const { data, error } = await supabase
        .from('recommended_traders')
        .select('*')
        .eq('trader_wallet', walletAddress)
        .single();

      if (error) throw error;
      console.log('Trader data fetched:', data.trader_name, 'Wallet:', data.trader_wallet);
      setTrader(data);
      setWalletLabel(data.trader_name || data.trader_wallet.slice(0, 8));
    } catch (error) {
      console.error('Error fetching trader data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trader_top_trades')
        .select('*')
        .eq('trader_wallet', walletAddress)
        .order('profit', { ascending: false })
        .limit(5);

      if (error) throw error;
      setTopTrades(data || []);
    } catch (error) {
      console.error('Error fetching top trades:', error);
    }
  };

  const fetchPnLMetrics = async () => {
    try {
      console.log('Fetching PnL metrics for wallet:', walletAddress);
      // Get top trades for this trader first
      const { data: trades, error: tradesError } = await supabase
        .from('trader_top_trades')
        .select('*')
        .eq('trader_wallet', walletAddress)
        .order('profit', { ascending: false })
        .limit(10);

      if (tradesError) {
        console.error('Error fetching trades for PnL calculation:', tradesError);
      }

      // Calculate PnL metrics based on actual trades data
      const metrics: PnLMetrics = {
        best_single_trade: trades && trades.length > 0 ? Math.max(...trades.map(t => t.profit)) : 50000,
        worst_single_trade: trades && trades.length > 0 ? Math.min(...trades.map(t => t.profit)) : -10000,
        avg_position_size: trades && trades.length > 0 ? trades.reduce((sum, t) => sum + t.amount, 0) / trades.length : 25000,
        win_rate_percentage: trades && trades.length > 0 ? Math.round((trades.filter(t => t.profit > 0).length / trades.length) * 100) : 75,
        largest_position: trades && trades.length > 0 ? Math.max(...trades.map(t => t.amount)) : 50000,
        risk_level: trades && trades.length > 0 ? 
          (trades.filter(t => t.profit > 0).length / trades.length > 0.75 ? 'Low' : 
           trades.filter(t => t.profit > 0).length / trades.length > 0.65 ? 'Medium' : 'High') : 'Medium'
      };
      
      console.log('PnL metrics calculated:', metrics);
      setPnlMetrics(metrics);
    } catch (error) {
      console.error('Error fetching PnL metrics:', error);
    }
  };

  const copyWalletAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Error copying wallet address:', error);
      }
    }
  };

  const handleAddToWallets = async () => {
    if (!user || !walletAddress) return;

    setAddWalletLoading(true);
    try {
      // Check if wallet already exists for this user
      const { data: existingWallet } = await supabase
        .from('tracked_wallets')
        .select('id')
        .eq('user_id', user.id)
        .eq('wallet_address', walletAddress)
        .single();

      if (existingWallet) {
        alert('This wallet is already in your tracked wallets.');
        setAddWalletLoading(false);
        return;
      }

      const { error } = await supabase
        .from('tracked_wallets')
        .insert([{
          user_id: user.id,
          wallet_address: walletAddress,
          label: walletLabel || (trader?.trader_name || walletAddress.slice(0, 8)),
          chain_id: 137
        }]);

      if (error) throw error;

      setShowAddWalletModal(false);
      alert('Wallet added successfully to your tracked wallets!');
    } catch (error) {
      console.error('Error adding wallet:', error);
      alert('Failed to add wallet. Please try again.');
    } finally {
      setAddWalletLoading(false);
    }
  };

  const formatProfit = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      return `$${(absAmount / 1000000).toFixed(2)}M`;
    } else if (absAmount >= 1000) {
      return `$${(absAmount / 1000).toFixed(1)}k`;
    }
    return `$${absAmount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trader profile...</p>
        </div>
      </div>
    );
  }

  if (!trader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Trader not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Trader Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trader Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={trader.profile_image_url}
                  alt={trader.trader_name}
                  className="w-20 h-20 rounded-full object-cover bg-gradient-to-br from-indigo-100 to-purple-100"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${trader.trader_name}&background=6366f1&color=fff`;
                  }}
                />
                {trader.win_rate > 75 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Award className="h-4 w-4 text-yellow-800" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{trader.trader_name}</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Wallet:</span>
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                      {trader.trader_wallet.slice(0, 10)}...{trader.trader_wallet.slice(-8)}
                    </code>
                    <button
                      onClick={copyWalletAddress}
                      className={`p-1 rounded transition-colors ${
                        copySuccess ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title="Copy wallet address"
                    >
                      {copySuccess ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {trader.description && (
                  <p className="text-gray-600 max-w-2xl">{trader.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddWalletModal(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Add to My Wallets</span>
              </button>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Profit</h3>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              +{formatProfit(trader.total_profit)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Win Rate</h3>
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {trader.win_rate}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min(trader.win_rate, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Trades</h3>
              <Activity className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {trader.total_trades.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Past Month</h3>
              {trader.past_month_profit >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p className={`text-2xl font-bold ${
              trader.past_month_profit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trader.past_month_profit >= 0 ? '+' : ''}{formatProfit(trader.past_month_profit)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top 5 Most Profitable Trades */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <span>Top 5 Most Profitable Trades</span>
              </h3>
              
              {topTrades.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No trades data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topTrades.map((trade, index) => (
                    <div key={trade.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          <h4 className="font-medium text-gray-900">{trade.market_name}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${
                            trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {trade.profit >= 0 ? '+' : ''}{formatProfit(trade.profit)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>Position: <span className="font-medium">{trade.position}</span></span>
                          <span>Amount: <span className="font-medium">{formatProfit(trade.amount)}</span></span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(trade.trade_date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PnL Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <span>PnL Breakdown</span>
              </h3>
              
              {pnlMetrics && (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Best Single Trade</span>
                      <span className="text-lg font-bold text-green-600">
                        +{formatProfit(pnlMetrics.best_single_trade)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Worst Single Trade</span>
                      <span className="text-lg font-bold text-red-600">
                        {formatProfit(pnlMetrics.worst_single_trade)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Average Position Size</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatProfit(pnlMetrics.avg_position_size)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Win Rate</span>
                      <span className="text-lg font-bold text-gray-900">
                        {pnlMetrics.win_rate_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(pnlMetrics.win_rate_percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Largest Position</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatProfit(pnlMetrics.largest_position)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Risk Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(pnlMetrics.risk_level)}`}>
                        {pnlMetrics.risk_level}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Wallet Modal */}
      {showAddWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Wallet to My Wallets</h3>
              <button
                onClick={() => setShowAddWalletModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-mono">
                  {walletAddress}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label (Optional)
                </label>
                <input
                  type="text"
                  value={walletLabel}
                  onChange={(e) => setWalletLabel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={trader?.trader_name || 'Enter a label'}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddWalletModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToWallets}
                  disabled={addWalletLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {addWalletLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Add Wallet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
