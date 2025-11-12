import { BettingActivity } from '../types';
import { TrendingUp, TrendingDown, Activity as ActivityIcon } from 'lucide-react';

interface ActivityFeedProps {
  activities: BettingActivity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <ActivityIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No activity yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Activity will appear here when tracked wallets make trades
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
      {activities.map((activity) => {
        const isBuy = activity.side === 'BUY';
        const shortAddress = `${activity.wallet_address.substring(0, 6)}...${activity.wallet_address.substring(activity.wallet_address.length - 4)}`;
        
        return (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${isBuy ? 'bg-green-100' : 'bg-red-100'}`}>
                {isBuy ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-semibold ${isBuy ? 'text-green-600' : 'text-red-600'}`}>
                    {activity.side}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-900 mb-1">
                  {activity.outcome || 'Unknown Outcome'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <code>{shortAddress}</code>
                  {activity.amount && (
                    <span className="font-medium">
                      ${activity.amount.toFixed(2)}
                    </span>
                  )}
                </div>
                {activity.price && (
                  <div className="mt-1 text-xs text-gray-400">
                    Price: ${activity.price.toFixed(3)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
