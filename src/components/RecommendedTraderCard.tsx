import { useState } from 'react';
import { TrendingUp, TrendingDown, Eye, EyeOff, Award, Target } from 'lucide-react';

interface RecommendedTraderCardProps {
  trader: {
    id: string;
    trader_wallet: string;
    trader_name: string;
    profile_image_url: string;
    total_profit: number;
    past_month_profit: number;
    win_rate: number;
    total_trades: number;
    description: string;
  };
  isWatched: boolean;
  onWatch: (walletAddress: string) => Promise<void>;
  onUnwatch: (walletAddress: string) => Promise<void>;
}

export default function RecommendedTraderCard({ 
  trader, 
  isWatched, 
  onWatch, 
  onUnwatch 
}: RecommendedTraderCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const formatProfit = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      return `$${(absAmount / 1000000).toFixed(2)}M`;
    } else if (absAmount >= 1000) {
      return `$${(absAmount / 1000).toFixed(1)}k`;
    }
    return `$${absAmount.toFixed(2)}`;
  };

  const handleToggleWatch = async () => {
    setIsLoading(true);
    try {
      if (isWatched) {
        await onUnwatch(trader.trader_wallet);
      } else {
        await onWatch(trader.trader_wallet);
      }
    } catch (error) {
      console.error('Error toggling watch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isProfitPositive = trader.past_month_profit >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-5 border border-gray-200">
      {/* Header with Avatar and Name */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={trader.profile_image_url}
              alt={trader.trader_name}
              className="w-12 h-12 rounded-full object-cover bg-gradient-to-br from-indigo-100 to-purple-100"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${trader.trader_name}&background=6366f1&color=fff`;
              }}
            />
            {trader.win_rate && trader.win_rate > 70 && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Award className="h-3 w-3 text-yellow-800" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{trader.trader_name}</h3>
            <p className="text-xs text-gray-500 truncate max-w-[180px]">{trader.trader_wallet}</p>
          </div>
        </div>
        
        <button
          onClick={handleToggleWatch}
          disabled={isLoading}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-1 ${
            isWatched
              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : isWatched ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Unwatch</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Watch</span>
            </>
          )}
        </button>
      </div>

      {/* Description */}
      {trader.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{trader.description}</p>
      )}

      {/* Performance Metrics */}
      <div className="space-y-3">
        {/* Total Profit */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <span className="text-sm text-gray-600">Total Profit</span>
          <span className="text-lg font-bold text-green-600">
            +{formatProfit(trader.total_profit)}
          </span>
        </div>

        {/* Past Month Profit */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <span className="text-sm text-gray-600">Past Month</span>
          <div className="flex items-center space-x-1">
            {isProfitPositive ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-lg font-bold text-green-600">
                  +{formatProfit(trader.past_month_profit)}
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-lg font-bold text-red-600">
                  {formatProfit(trader.past_month_profit)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className="text-sm font-semibold text-gray-900">{trader.win_rate}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Trades</p>
              <p className="text-sm font-semibold text-gray-900">{trader.total_trades}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Link to Profile (future feature) */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <a
          href={`/profile/${trader.trader_wallet}`}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          onClick={(e) => {
            e.preventDefault();
            alert('Profile page coming soon!');
          }}
        >
          View Full Profile →
        </a>
      </div>
    </div>
  );
}
