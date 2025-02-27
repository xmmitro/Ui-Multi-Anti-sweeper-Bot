import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Trash2, Loader2, XCircle, CheckCircle } from 'lucide-react';
import { executeMultiTransfer } from '../services/mockApi';

type Transfer = {
  fromChain: string;
  toChain: string;
  amount: string;
};

type MultiTransferProps = {
  supportedChains: string[];
};

export function MultiTransfer({ supportedChains }: MultiTransferProps) {
  const [transfers, setTransfers] = useState<Transfer[]>([
    { fromChain: '', toChain: '', amount: '' }
  ]);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addTransfer = () => {
    setTransfers([...transfers, { fromChain: '', toChain: '', amount: '' }]);
  };

  const removeTransfer = (index: number) => {
    if (transfers.length > 1) {
      const newTransfers = [...transfers];
      newTransfers.splice(index, 1);
      setTransfers(newTransfers);
    }
  };

  const updateTransfer = (index: number, field: keyof Transfer, value: string) => {
    const newTransfers = [...transfers];
    newTransfers[index] = { ...newTransfers[index], [field]: value };
    setTransfers(newTransfers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setIsLoading(true);

    // Validate transfers
    const isValid = transfers.every(t => t.fromChain && t.toChain && t.amount && !isNaN(parseFloat(t.amount)));
    
    if (!isValid) {
      setError('Please fill in all fields with valid values');
      setIsLoading(false);
      return;
    }

    try {
      const data = await executeMultiTransfer(transfers);
      
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || 'Failed to process transfers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing transfers');
      console.error('Error processing transfers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Multi-Transfer</h2>
      <p className="text-gray-600 mb-6">
        Transfer tokens between multiple chains in a single operation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 mb-6">
        {transfers.map((transfer, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Transfer #{index + 1}</h3>
              {transfers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTransfer(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor={`fromChain-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  From Chain
                </label>
                <select
                  id={`fromChain-${index}`}
                  value={transfer.fromChain}
                  onChange={(e) => updateTransfer(index, 'fromChain', e.target.value)}
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
                <label htmlFor={`toChain-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  To Chain
                </label>
                <select
                  id={`toChain-${index}`}
                  value={transfer.toChain}
                  onChange={(e) => updateTransfer(index, 'toChain', e.target.value)}
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
                <label htmlFor={`amount-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  id={`amount-${index}`}
                  type="text"
                  value={transfer.amount}
                  onChange={(e) => updateTransfer(index, 'amount', e.target.value)}
                  placeholder="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addTransfer}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Transfer
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            <>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Execute Transfers
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

      {results && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium text-green-700">Transfers Completed</h3>
          </div>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white p-4 rounded-md border border-gray-100">
                <h4 className="font-medium mb-2">Transfer #{index + 1}</h4>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction Hash</p>
                    <p className="text-gray-900 break-all">{result.transactionHash}</p>
                  </div>
                  
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}