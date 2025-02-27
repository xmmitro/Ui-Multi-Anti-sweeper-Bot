import React, { useState } from 'react';
import { Coins, Loader2, XCircle, CheckCircle } from 'lucide-react';
import { getGasPrice } from '../services/mockApi';

type GasPriceProps = {
  supportedChains: string[];
};

export function GasPrice({ supportedChains }: GasPriceProps) {
  const [chainKey, setChainKey] = useState('');
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGasPrice(null);
    setIsLoading(true);

    if (!chainKey) {
      setError('Please select a chain');
      setIsLoading(false);
      return;
    }

    try {
      const data = await getGasPrice(chainKey);
      
      if (data.success) {
        setGasPrice(data.gasPrice);
      } else {
        setError(data.error || 'Failed to fetch gas price');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching gas price');
      console.error('Error fetching gas price:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gas Price</h2>
      <p className="text-gray-600 mb-6">
        Check the current gas price for a specific blockchain.
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
              <Coins className="mr-2 h-4 w-4" />
              Check Gas Price
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

      {gasPrice !== null && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium text-green-700">Gas Price Retrieved</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Chain</p>
              <p className="text-gray-900">{chainKey}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Current Gas Price</p>
              <p className="text-2xl font-bold text-gray-900">
                {parseFloat(gasPrice).toFixed(2)} Gwei
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}