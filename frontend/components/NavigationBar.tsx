'use client'
import React from 'react'
import { Button } from './ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BadgePlus, ChartNoAxesCombined, FileText, LogOut, Users, Wallet } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { formatAddress } from '@/utils/helper';
import { DropdownMenuContent } from './ui/dropdown-menu';
import { DropdownMenuTrigger } from './ui/dropdown-menu';
import { DropdownMenu } from './ui/dropdown-menu';
import ActiveTab from '@/utils/ActiveTab';
import MobileNav from './MobileNavBar';

const NavigationBar = () => {
    const navigate = useRouter()
    const { account, connectWallet, isConnecting, disconnectWallet } = useWallet();
    
    const handleNavigation = (path : string) => {
        navigate.push(path)
    }
  return (
    <section className='w-full h-[55px] backdrop-blur-md fixed z-10 flex flex-row justify-between items-center px-[20px]'>
        <MobileNav />
        <div className="text-2xl font-bold tracking-tighter flex flex-row justify-between cursor-pointer" onClick={() => handleNavigation('/')}> 
            <Image src={'/microPay.png'} width={40} height={40} alt='Logo'/> MicroPay
        </div>
        {
            account && (
                <nav className="hidden md:flex flex-row space-y-1">
                    <ActiveTab  
                        isActive={false} 
                        onClick={() => handleNavigation('/dashboard')}
                    >
                    <ChartNoAxesCombined className="w-4 h-4 mr-1" /> Dashboard
                    </ActiveTab>
                    <ActiveTab  
                        isActive={false} 
                        onClick={() => handleNavigation('/transactions')}
                    >
                    <FileText className="w-4 h-4 mr-1" /> Transactions
                    </ActiveTab>
                    <ActiveTab  
                        isActive={false} 
                        onClick={() => handleNavigation('/about')}
                    >
                    <Users className="w-4 h-4 mr-1" /> About
                    </ActiveTab>
                    <ActiveTab  
                        isActive={false} 
                        onClick={() => handleNavigation('/creators')}
                    >
                    <BadgePlus className="w-4 h-4 mr-1" /> Creator
                    </ActiveTab>
                </nav>
            )
        }
        <div className='hidden md:flex flex-row justify-between items-center space-x-2'>
            {account ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 rounded-[20px]">
                            <Wallet className='w-4 h-4' />
                            <span>{formatAddress(account)}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <Button variant="outline" size="sm" className="w-full" onClick={disconnectWallet}>
                            <LogOut className="w-4 h-4" />
                            <span>Disconnect</span>
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button className="h-8 px-4 rounded-[20px] transition-all hover:scale-105 " onClick={connectWallet} disabled={isConnecting}>
                    <Wallet className='w-5 h-5' />
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
            )}
        </div>
    </section>
  )
}

export default NavigationBar;