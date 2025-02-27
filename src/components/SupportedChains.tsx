import React from 'react';
import { List, ExternalLink } from 'lucide-react';

type SupportedChainsProps = {
  chains: string[];
};

export function SupportedChains({ chains }: SupportedChainsProps) {
  // Map of chain keys to their respective explorer URLs
  const chainExplorers: Record<string, string> = {
    ETH: 'https://sepolia.etherscan.io',
    POLYGON: 'https://polygonscan.com',
    BNB: 'https://bscscan.com',
    OP: 'https://optimistic.etherscan.io',
    BASE: 'https://basescan.org',
    ARB: 'https://arbiscan.io',
    Holesky: 'https://holesky.etherscan.io',
  };

  // Map of chain keys to their native tokens
  const chainTokens: Record<string, string> = {
    ETH: 'ETH',
    POLYGON: 'POL',
    BNB: 'BNB',
    OP: 'ETH',
    BASE: 'ETH',
    ARB: 'ETH',
    Holesky: 'ETH',
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Supported Chains</h2>
      <p className="text-gray-600 mb-6">
        The following blockchain networks are supported by this application.
      </p>

      <div className="bg-gray-50 rounded-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {chains.map((chain) => (
            <div key={chain} className="bg-white p-4 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{chain}</h3>
                {chainExplorers[chain] && (
                  <a 
                    href={chainExplorers[chain]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Native Token: {chainTokens[chain] || 'Unknown'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}