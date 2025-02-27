import React, { useState } from 'react';
import { Wallet, Loader2, XCircle, CheckCircle } from 'lucide-react';
import { checkBalance } from '../services/mockApi';

type WalletBalanceProps = {
  supportedChains: string[];
};

export function WalletBalance({ supportedChains }: WalletBalanceProps) {
  const [chainKey, setChainKey] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBalance(null);
    setIsLoading(true);

    if (!chainKey) {
      setError('Please select a chain');
      setIsLoading(false);
      return;
    }

    try {
      const data = await checkBalance(chainKey);
      
      if (data.success) {
        setBalance(data.balance);
      } else {
        setError(data.error || 'Failed to fetch wallet balance');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching wallet balance');
      console.error('Error fetching wallet balance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
      <p className="text-gray-600 mb-6">
        Check the wallet balance for a specific blockchain.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="chainKey" className="block text-sm font-medium text-gray-700 mb-1">
            Chain
          </label>
          <select
            id="chainKey"
            value={chainKey}
            onChange={(e) => setChainKey(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a chain</option>
            {supportedChains.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Checking...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Check Balance
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {balance !== null && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium text-green-700">Balance Retrieved</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Chain</p>
              <p className="text-gray-900">{chainKey}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {parseFloat(balance).toFixed(6)} {chainKey === 'ETH' ? 'ETH' : chainKey === 'POLYGON' ? 'POL' : chainKey === 'BNB' ? 'BNB' : 'Tokens'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}