// Mock API service to simulate backend responses
import { useState, useEffect } from 'react';

// Mock data for supported chains
const MOCK_CHAINS = ['ETH', 'POLYGON', 'BNB', 'OP', 'BASE', 'ARB', 'Holesky'];

// Mock transaction receipt
const MOCK_TX_RECEIPT = {
  blockHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  blockNumber: 12345678,
  contractAddress: null,
  cumulativeGasUsed: '1234567',
  effectiveGasPrice: '10000000000',
  from: '0xabcdef1234567890abcdef1234567890abcdef12',
  gasUsed: '21000',
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: true,
  to: '0x1234567890abcdef1234567890abcdef1234567890',
  transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  transactionIndex: 0,
  type: '0x0'
};

// Mock gas prices for different chains (in Gwei)
const MOCK_GAS_PRICES: Record<string, string> = {
  ETH: '25.45',
  POLYGON: '150.32',
  BNB: '5.78',
  OP: '0.25',
  BASE: '0.15',
  ARB: '0.35',
  Holesky: '10.25'
};

// Mock balances for different chains (in native token)
const MOCK_BALANCES: Record<string, string> = {
  ETH: '1.234567',
  POLYGON: '245.678901',
  BNB: '5.432109',
  OP: '0.987654',
  BASE: '2.345678',
  ARB: '3.456789',
  Holesky: '10.123456'
};

// Mock multi-transfer results
const createMockTransferResult = (fromChain: string, toChain: string) => {
  return {
    blockHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    blockNumber: Math.floor(Math.random() * 10000000),
    contractAddress: null,
    cumulativeGasUsed: String(Math.floor(Math.random() * 1000000)),
    effectiveGasPrice: String(Math.floor(Math.random() * 100000000000)),
    from: `0x${Math.random().toString(16).substring(2, 42)}`,
    gasUsed: String(Math.floor(Math.random() * 100000)),
    status: Math.random() > 0.2, // 80% chance of success
    to: `0x${Math.random().toString(16).substring(2, 42)}`,
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    transactionIndex: Math.floor(Math.random() * 100)
  };
};

// API functions
export const fetchChains = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return { success: true, chains: MOCK_CHAINS };
};

export const checkTxStatus = async (chainKey: string, txHash: string) => {
  // Validate inputs
  if (!chainKey || !MOCK_CHAINS.includes(chainKey)) {
    throw new Error('Invalid chain key');
  }
  
  if (!txHash || !/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
    throw new Error('Invalid transaction hash format');
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return { success: true, txReceipt: MOCK_TX_RECEIPT };
};

export const checkBalance = async (chainKey: string) => {
  // Validate inputs
  if (!chainKey || !MOCK_CHAINS.includes(chainKey)) {
    throw new Error('Invalid chain key');
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { 
    success: true, 
    balance: MOCK_BALANCES[chainKey] || '0.000000'
  };
};

export const getGasPrice = async (chainKey: string) => {
  // Validate inputs
  if (!chainKey || !MOCK_CHAINS.includes(chainKey)) {
    throw new Error('Invalid chain key');
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return { 
    success: true, 
    gasPrice: MOCK_GAS_PRICES[chainKey] || '10.00'
  };
};

export const executeMultiTransfer = async (transfers: Array<{fromChain: string, toChain: string, amount: string}>) => {
  // Validate inputs
  if (!Array.isArray(transfers) || transfers.length === 0) {
    throw new Error('Invalid transfers data');
  }
  
  for (const transfer of transfers) {
    if (!transfer.fromChain || !MOCK_CHAINS.includes(transfer.fromChain)) {
      throw new Error(`Invalid from chain: ${transfer.fromChain}`);
    }
    if (!transfer.toChain || !MOCK_CHAINS.includes(transfer.toChain)) {
      throw new Error(`Invalid to chain: ${transfer.toChain}`);
    }
    if (!transfer.amount || isNaN(parseFloat(transfer.amount))) {
      throw new Error(`Invalid amount: ${transfer.amount}`);
    }
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const results = transfers.map(transfer => 
    createMockTransferResult(transfer.fromChain, transfer.toChain)
  );
  
  return { success: true, results };
};

// Custom hook for fetching chains
export function useSupportedChains() {
  const [chains, setChains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getChains = async () => {
      try {
        setIsLoading(true);
        const response = await fetchChains();
        if (response.success) {
          setChains(response.chains);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error fetching chains:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getChains();
  }, []);

  return { chains, isLoading, error };
}