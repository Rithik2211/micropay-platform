'use client'
import React from 'react';
import { Users, FileText, Menu, X, Wallet, LogOut, ChartNoAxesCombined, BadgePlus } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ActiveTab from '@/utils/ActiveTab';
import { useRouter } from 'next/navigation';
import { DropdownMenuContent } from './ui/dropdown-menu';
import { formatAddress } from '@/utils/helper';
import { DropdownMenuTrigger } from './ui/dropdown-menu';
import { useWallet } from '@/context/WalletContext';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';

const MobileNav: React.FC = () => {
    const navigate = useRouter()
    const [open, setOpen] = React.useState(false);
    const { account, connectWallet, isConnecting, disconnectWallet } = useWallet();

    const handleNavigation = (path: string) => {
        navigate.push(path)
    }

    return (
        <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Menu">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between my-6">
                            <div className="text-2xl font-bold tracking-tighter flex flex-row justify-between cursor-pointer" onClick={() => handleNavigation('/')}>
                                <Image src={'/microPay.png'} width={40} height={40} alt='Logo' /> MicroPay
                            </div>
                        </div>

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

                        <div className="flex items-end justify-center mb-2">
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
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MobileNav;
