import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { checkTxStatus } from '../services/mockApi';

type TransactionStatusProps = {
  supportedChains: string[];
};

export function TransactionStatus({ supportedChains }: TransactionStatusProps) {
  const [chainKey, setChainKey] = useState('');
  const [txHash, setTxHash] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    if (!chainKey || !txHash) {
      setError('Please provide both chain and transaction hash');
      setIsLoading(false);
      return;
    }

    try {
      const data = await checkTxStatus(chainKey, txHash);
      
      if (data.success) {
        setResult(data.txReceipt);
      } else {
        setError(data.error || 'Failed to fetch transaction status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching transaction status');
      console.error('Error fetching transaction status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Transaction Status</h2>
      <p className="text-gray-600 mb-6">
        Check the status of a transaction by providing the chain and transaction hash.
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

        <div>
          <label htmlFor="txHash" className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Hash
          </label>
          <input
            id="txHash"
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
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
              <Search className="mr-2 h-4 w-4" />
              Check Status
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

      {result && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium text-green-700">Transaction Found</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-gray-900">
                {result.status ? 'Success' : 'Failed'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Block Number</p>
              <p className="text-gray-900">{result.blockNumber}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Gas Used</p>
              <p className="text-gray-900">{result.gasUsed}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Transaction Hash</p>
              <p className="text-gray-900 break-all">{result.transactionHash}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}