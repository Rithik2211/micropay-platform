'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/context/WalletContext';
import { Transaction } from '@/types';
import { FileText } from 'lucide-react';
import React, { useState } from 'react'

const Transactions = () => {
  const { account, connectWallet } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  if (!account) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center w-full bg-gradient-to-b from-blue-100 to-violet-100 dark:from-gray-900 dark:to-gray-950">
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 mt-[80px]">
        <FileText className="w-16 h-16 mx-auto mb-6 text-purple-500" />
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">
            To view your transaction history, please connect your Ethereum wallet.
          </p>
          <Button variant='outline' onClick={connectWallet} >
            Connect Wallet
          </Button>
      </section>
    </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-violet-100 dark:from-gray-900 dark:to-gray-950">
      <section className="py-8 mx-[40px] max-w-full pt-[80px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">Transactions History</h1>
            <p className="text-muted-foreground">
              View all your subscriptions and payments
            </p>
          </div>
          <div className="w-full md:w-64 border-1 border-gray-300 rounded-md">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="glass-card rounded-xl p-8 text-center animate-fade-in flex flex-col items-center justify-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-purple-500 opacity-70" />
          <h2 className="text-xl font-semibold mb-2">No Transactions Found</h2>
          <p className="text-muted-foreground mb-6">
            {searchTerm.length > 0
              ? `No transactions matching "${searchTerm}"`
              : "You don't have any transactions yet. They will appear here when you settle expenses."}
          </p>
        </div>
      </section>
    </div>
  )
}

export default Transactions;