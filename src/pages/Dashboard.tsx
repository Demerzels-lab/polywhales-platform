import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { TrackedWallet, BettingActivity, RecommendedTrader } from '../types';
import WalletCard from '../components/WalletCard';
import AddWalletForm from '../components/AddWalletForm';
import ActivityFeed from '../components/ActivityFeed';
import RecommendedTraderCard from '../components/RecommendedTraderCard';
import { Activity, Wallet, Plus, LogOut, User, TrendingUp } from 'lucide-react';

type TabType = 'wallets' | 'recommended';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('wallets');
  const [wallets, setWallets] = useState<TrackedWallet[]>([]);
  const [activities, setActivities] = useState<BettingActivity[]>([]);
  const [recommendedTraders, setRecommendedTraders] = useState<RecommendedTrader[]>([]);


  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchWallets();
    fetchActivities();
    fetchRecommendedTraders();

    // Subscribe to real-time updates
    const walletsSubscription = supabase
      .channel('tracked_wallets_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tracked_wallets' }, () => {
        fetchWallets();
      })
      .subscribe();

    const activitiesSubscription = supabase
      .channel('betting_activities_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'betting_activities' }, () => {
        fetchActivities();
      })
      .subscribe();

    return () => {
      walletsSubscription.unsubscribe();
      activitiesSubscription.unsubscribe();
    };
  }, []);

  const fetchWallets = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('tracked_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      if (!user) return;
      
      const { data: userWallets } = await supabase
        .from('tracked_wallets')
        .select('wallet_address')
        .eq('user_id', user.id);

      if (!userWallets || userWallets.length === 0) {
        setActivities([]);
        return;
      }

      const walletAddresses = userWallets.map(w => w.wallet_address);

      const { data, error } = await supabase
        .from('betting_activities')
        .select('*')
        .in('wallet_address', walletAddresses)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchRecommendedTraders = async () => {
    try {
      const { data, error } = await supabase
        .from('recommended_traders')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRecommendedTraders(data || []);
    } catch (error) {
      console.error('Error fetching recommended traders:', error);
    }
  };



  const handleAddWallet = async (walletAddress: string, label?: string) => {
    try {
      if (!user) {
        alert('You must be logged in to add wallets');
        return;
      }

      const { error } = await supabase
        .from('tracked_wallets')
        .insert([{
          user_id: user.id,
          wallet_address: walletAddress,
          label: label,
          chain_id: 137
        }]);

      if (error) throw error;

      setShowAddForm(false);
      fetchWallets();
    } catch (error) {
      console.error('Error adding wallet:', error);
      alert('Failed to add wallet. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteWallet = async (id: string) => {
    if (!confirm('Are you sure you want to stop tracking this wallet?')) return;

    try {
      const { error } = await supabase
        .from('tracked_wallets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchWallets();
    } catch (error) {
      console.error('Error deleting wallet:', error);
      alert('Failed to delete wallet. Please try again.');
    }
  };







  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PolyWhales</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <span className="text-sm text-gray-500">
                {wallets.length} wallet{wallets.length !== 1 ? 's' : ''} tracked
              </span>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Wallet</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Wallet className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Track Polymarket traders and get instant alerts via Telegram bot{' '}
                <a
                  href="https://t.me/PolyWhales_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:text-blue-800"
                >
                  @PolyWhales_bot
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('wallets')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'wallets'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Wallet className="h-4 w-4" />
                <span>My Wallets</span>
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {wallets.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'recommended'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Recommended Traders</span>
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {recommendedTraders.length}
                </span>
              </div>
            </button>

          </div>
        </div>

        {/* Add Wallet Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <AddWalletForm
                onSubmit={handleAddWallet}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* My Wallets Tab */}
            {activeTab === 'wallets' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tracked Wallets</h2>
                {wallets.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No wallets tracked yet</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Your First Wallet</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wallets.map((wallet) => (
                      <WalletCard
                        key={wallet.id}
                        wallet={wallet}
                        onDelete={handleDeleteWallet}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recommended Traders Tab */}
            {activeTab === 'recommended' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performers</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Watch these top-performing traders to get notified about their activities
                </p>
                {recommendedTraders.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recommended traders available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedTraders.map((trader) => (
                      <RecommendedTraderCard
                        key={trader.id}
                        trader={trader}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}



          </div>

          {/* Activity Feed - Always visible */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </main>
    </div>
  );
}