
import { ethers } from 'ethers';

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Format address to shorter version
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Format date to readable format
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format amount to readable format
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Check if a string is a valid Ethereum address
export const isValidEthereumAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};

// Generate invite link for a group
export const generateInviteLink = (groupId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/invite?groupId=${groupId}`;
};
