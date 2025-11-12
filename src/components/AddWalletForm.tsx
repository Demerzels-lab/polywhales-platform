import { useState } from 'react';
import { X } from 'lucide-react';

interface AddWalletFormProps {
  onSubmit: (walletAddress: string, label?: string) => Promise<void>;
  onCancel: () => void;
}

export default function AddWalletForm({ onSubmit, onCancel }: AddWalletFormProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate wallet address
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress.trim())) {
      setError('Invalid Ethereum address format');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(walletAddress.trim(), label.trim() || undefined);
      setWalletAddress('');
      setLabel('');
    } catch (err) {
      setError('Failed to add wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Add Wallet to Track</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Wallet Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
            Label (Optional)
          </label>
          <input
            type="text"
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Top Trader, Whale #1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex items-center space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Wallet'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
