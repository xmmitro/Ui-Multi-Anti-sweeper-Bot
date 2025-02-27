import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
import { TransactionStatus } from './components/TransactionStatus';
import { WalletBalance } from './components/WalletBalance';
import { GasPrice } from './components/GasPrice';
import { SupportedChains } from './components/SupportedChains';
import { MultiTransfer } from './components/MultiTransfer';
import { Wallet, Activity, Coins, List, ArrowRightLeft } from 'lucide-react';
import { useSupportedChains } from './services/mockApi';

function App() {
  const [activeTab, setActiveTab] = useState('transaction');
  const { chains: supportedChains, isLoading } = useSupportedChains();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Wallet className="mr-2 h-6 w-6 text-blue-500" />
            Blockchain Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="transaction" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Transaction Status
            </TabsTrigger>
            <TabsTrigger value="balance" className="flex items-center">
              <Wallet className="mr-2 h-4 w-4" />
              Wallet Balance
            </TabsTrigger>
            <TabsTrigger value="gas" className="flex items-center">
              <Coins className="mr-2 h-4 w-4" />
              Gas Price
            </TabsTrigger>
            <TabsTrigger value="chains" className="flex items-center">
              <List className="mr-2 h-4 w-4" />
              Supported Chains
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex items-center">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Multi-Transfer
            </TabsTrigger>
          </TabsList>

          <div className="bg-white shadow rounded-lg p-6">
            <TabsContent value="transaction">
              <TransactionStatus supportedChains={supportedChains} />
            </TabsContent>
            
            <TabsContent value="balance">
              <WalletBalance supportedChains={supportedChains} />
            </TabsContent>
            
            <TabsContent value="gas">
              <GasPrice supportedChains={supportedChains} />
            </TabsContent>
            
            <TabsContent value="chains">
              <SupportedChains chains={supportedChains} />
            </TabsContent>
            
            <TabsContent value="transfer">
              <MultiTransfer supportedChains={supportedChains} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

export default App;