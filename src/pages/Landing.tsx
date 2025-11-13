import { useState } from 'react';
import { Activity, TrendingUp, Bell, Eye, Users, BarChart3, Zap, Shield, CheckCircle, UserPlus, MessageCircle, Settings, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LandingProps {
  onShowAuth: () => void;
}

export default function Landing({ onShowAuth }: LandingProps) {
  const { signIn, signUp } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const sampleTraders = [
    {
      name: 'fengdubiying',
      profit: '$2.96M',
      monthProfit: '+$2.94M',
      winRate: '73.5%',
      isPositive: true
    },
    {
      name: 'yatsen',
      profit: '$1.85M',
      monthProfit: '+$1.82M',
      winRate: '68.2%',
      isPositive: true
    },
    {
      name: 'scottilicious',
      profit: '$1.46M',
      monthProfit: '+$1.40M',
      winRate: '71.8%',
      isPositive: true
    }
  ];

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Top Trader Insights',
      description: 'Track performance from top performers on Polymarket with real-time metrics'
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Telegram Alerts',
      description: 'Get instant notifications via Telegram bot for every trader activity'
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Personal Watchlist',
      description: 'Save and monitor your favorite traders in a personal watchlist'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Performance Analytics',
      description: 'Analyze win rate, profit trends, and trading patterns in depth'
    }
  ];

  const stats = [
    { label: 'Tracked Traders', value: '500+' },
    { label: 'Total Profit Tracked', value: '$2M+' },
    { label: 'Active Users', value: '1,000+' },
    { label: 'Daily Alerts', value: '10K+' }
  ];

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
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Track Whale Wallets On Polymarket
            <span className="block text-indigo-600 mt-2">Get Real-Time Alerts</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Monitor profitable traders, analyze their strategies, and get instant notifications 
            via Telegram. Start making smarter trading decisions today.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg flex items-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>Start Tracking Now</span>
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('preview');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg border-2 border-indigo-600"
            >
              View Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PolyWhales?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools and insights to help you track and learn from top traders
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Flow Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and start receiving real-time alerts from top Polymarket traders
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-4 relative">
                <UserPlus className="h-10 w-10" />
                <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Sign Up & Login</h4>
              <p className="text-gray-600 text-sm">
                Create your free account with email and password to access the dashboard
              </p>
              
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-10 -right-4 text-gray-300">
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4 relative">
                <MessageCircle className="h-10 w-10" />
                <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Connect Telegram</h4>
              <p className="text-gray-600 text-sm">
                Link your Telegram account to receive instant notifications via our bot
              </p>
              
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-10 -right-4 text-gray-300">
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 text-purple-600 mb-4 relative">
                <Eye className="h-10 w-10" />
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Add Wallets</h4>
              <p className="text-gray-600 text-sm">
                Search and add whale wallets you want to track to your personal watchlist
              </p>
              
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-10 -right-4 text-gray-300">
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-600 mb-4 relative">
                <Settings className="h-10 w-10" />
                <div className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  4
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Set Preferences</h4>
              <p className="text-gray-600 text-sm">
                Customize alert settings: profit thresholds, trading activity, and notification frequency
              </p>
              
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-10 -right-4 text-gray-300">
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>

            {/* Step 5 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 mb-4 relative">
                <AlertTriangle className="h-10 w-10" />
                <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  5
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Alerts</h4>
              <p className="text-gray-600 text-sm">
                Receive real-time Telegram alerts when tracked wallets make profitable moves
              </p>
            </div>
          </div>

          {/* Mobile arrows */}
          <div className="md:hidden flex justify-center space-x-4 mt-8">
            <ArrowRight className="h-6 w-6 text-gray-300 rotate-90" />
            <ArrowRight className="h-6 w-6 text-gray-300 rotate-90" />
            <ArrowRight className="h-6 w-6 text-gray-300 rotate-90" />
          </div>

          {/* Call to action */}
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg inline-flex items-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>Start Your Journey Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section id="preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4">
            <Shield className="h-4 w-4" />
            <span className="font-semibold text-sm">PREVIEW MODE - Sample Data</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Sample Dashboard Preview</h3>
          <p className="text-lg text-gray-600">
            See what the complete dashboard looks like with real-time data
          </p>
        </div>

        {/* Sample Traders Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {sampleTraders.map((trader, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 relative">
              <div className="absolute top-4 right-4">
                <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
                  Sample
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{trader.name}</h4>
                  <p className="text-xs text-gray-500">Top Performer</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-600">Total Profit</span>
                  <span className="text-lg font-bold text-green-600">{trader.profit}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-600">Past Month</span>
                  <span className="text-lg font-bold text-green-600">{trader.monthProfit}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Win Rate</span>
                  <span className="text-sm font-semibold text-gray-900">{trader.winRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setAuthMode('signup');
              setShowAuthModal(true);
            }}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg inline-flex items-center space-x-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Unlock Full Dashboard</span>
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Start Tracking?
          </h3>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of traders who are already using PolyWhales to improve their trading strategies
          </p>
          <button
            onClick={() => {
              setAuthMode('signup');
              setShowAuthModal(true);
            }}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
          >
            Create Free Account
          </button>
          <p className="text-indigo-200 mt-4 text-sm">
            No credit card required. Get started in seconds.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">PolyWhales</span>
              </div>
              <p className="text-sm">
                Track top Polymarket traders and get real-time alerts via Telegram.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://t.me/PolyWhales_bot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Telegram Bot
                  </a>
                </li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>2025 PolyWhales. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                {authMode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Login'}
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
