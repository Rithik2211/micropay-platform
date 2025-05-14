'use client'
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

// Define window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  account: string | null;
  balance: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  transferTokens: (to: string, amount: string) => Promise<string>;
  getEnsName: (address: string) => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  balance: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  transferTokens: async () => '',
  getEnsName: async () => null,
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if MetaMask is available
  const checkIfMetaMaskIsAvailable = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Connect to wallet
  const connectWallet = async () => {
    if (!checkIfMetaMaskIsAvailable()) {
      toast("MetaMask Not Found", {
        description: "Please install MetaMask to connect your wallet",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
      return;
    }

    try {
      setIsConnecting(true);
      
      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      const address = accounts[0];
      const network = await provider.getNetwork();
      const chainIdHex = await provider.send('eth_chainId', []);
      
      // Get account balance
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      
      setAccount(address);
      setBalance(balanceEth);
      setChainId(chainIdHex);
      setIsConnected(true);
      
      // Listen for account changes
      if (window.ethereum && window.ethereum.on) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('disconnect', handleDisconnect);
      }
      
      toast(<div className='flex items-center gap-2'> 
        <div className='rounded-full p-2 bg-green-600'>
          <Check  className='w-4 h-4 text-white'/>
        </div> Wallet Connected! </div>, {
        description: `Connected to ${formatAddress(address)}`,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast("Connection Failed", {
        description: "Failed to connect wallet. Please try again.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
      toast("Account Changed", {
        description: `Switched to ${formatAddress(accounts[0])}`,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
    }
  };

  // Handle chain changes
  const handleChainChanged = (chainId: string) => {
    setChainId(chainId);
    window.location.reload();
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnectWallet();
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    }
    
    setAccount(null);
    setBalance(null);
    setChainId(null);
    setIsConnected(false);
    
    toast("Wallet Disconnected", {
        description: 'Your wallet has been disconnected',
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
  };

  // Transfer tokens - Updated for better error handling and support for contract
  const transferTokens = async (to: string, amount: string): Promise<string> => {
    if (!checkIfMetaMaskIsAvailable() || !account) {
      throw new Error('Wallet not connected');
    }
    
    try {
      console.log(`Initiating transfer of ${amount} tokens to ${to}`);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(`Using signer with address: ${await signer.getAddress()}`);
      
      // For testing, we'll use direct ETH transfer instead of token transfer
      // This simulates the payment for demo purposes
      const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseEther(amount)
      });
      
      console.log(`Transaction sent with hash: ${tx.hash}`);
      console.log(`Waiting for confirmation...`);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log(`Transaction confirmed with ${receipt?.status === 1 ? 'success' : 'failure'}`);
      
      // When real token contract is available, use this code instead:
      /*
      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      console.log(`Contract created at address: ${CONTRACT_ADDRESS}`);
      
      // Send transaction
      const tx = await contract.transfer(to, ethers.parseUnits(amount, 18));
      console.log(`Transaction sent with hash: ${tx.hash}`);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      */
      
      return tx.hash;
    } catch (error) {
      console.error('Transfer error:', error);
      throw error;
    }
  };

  // Get ENS name for an address
  const getEnsName = async (address: string): Promise<string | null> => {
    try {
      if (checkIfMetaMaskIsAvailable()) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        return await provider.lookupAddress(address);
      }
      return null;
    } catch (error) {
      console.error('Error resolving ENS name:', error);
      return null;
    }
  };

  // Format address for display
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Auto connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (checkIfMetaMaskIsAvailable() && window.ethereum.isConnected()) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const address = accounts[0].address;
            const balanceWei = await provider.getBalance(address);
            const balanceEth = ethers.formatEther(balanceWei);
            const chainIdHex = await provider.send('eth_chainId', []);
            
            setAccount(address);
            setBalance(balanceEth);
            setChainId(chainIdHex);
            setIsConnected(true);
            
            // Set up listeners
            if (window.ethereum && window.ethereum.on) {
              window.ethereum.on('accountsChanged', handleAccountsChanged);
              window.ethereum.on('chainChanged', handleChainChanged);
              window.ethereum.on('disconnect', handleDisconnect);
            }
          }
        } catch (error) {
          console.error('Auto connect error:', error);
        }
      }
    };
    
    autoConnect();
    
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        balance,
        chainId,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        transferTokens,
        getEnsName,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);