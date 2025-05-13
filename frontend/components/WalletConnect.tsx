// import { useState } from 'react'
// import { useAccount, useConnect, useDisconnect } from 'wagmi'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { Wallet, LogOut, ExternalLink, Copy, CheckCircle } from 'lucide-react'

// export function WalletConnect() {
//   const { address, isConnected } = useAccount()
//   const { connect, connectors, isLoading, pendingConnector } = useConnect()
//   const { disconnect } = useDisconnect()
//   const [copied, setCopied] = useState(false)
  
//   const copyAddress = () => {
//     if (address) {
//       navigator.clipboard.writeText(address)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     }
//   }
  
//   const formatAddress = (addr: string) => {
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`
//   }
  
//   if (isConnected && address) {
//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="outline" className="flex items-center gap-2">
//             <div className="w-2 h-2 rounded-full bg-green-500"></div>
//             {formatAddress(address)}
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="w-56">
//           <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
//             {copied ? (
//               <>
//                 <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
//                 <span>Copied!</span>
//               </>
//             ) : (
//               <>
//                 <Copy className="mr-2 h-4 w-4" />
//                 <span>Copy Address</span>
//               </>
//             )}
//           </DropdownMenuItem>
//           <DropdownMenuItem 
//             className="cursor-pointer"
//             onClick={() => window.open(`https://basescan.org/address/${address}`, '_blank')}
//           >
//             <ExternalLink className="mr-2 h-4 w-4" />
//             <span>View on Explorer</span>
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={() => disconnect()} className="cursor-pointer text-red-500 focus:text-red-500">
//             <LogOut className="mr-2 h-4 w-4" />
//             <span>Disconnect</span>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     )
//   }
  
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button className="flex items-center gap-2">
//           <Wallet className="h-4 w-4" />
//           Connect Wallet
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-56">
//         <DropdownMenuLabel>Select Wallet</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         {connectors.map((connector) => (
//           <DropdownMenuItem
//             key={connector.id}
//             onClick={() => connect({ connector })}
//             disabled={!connector.ready}
//             className="cursor-pointer"
//           >
//             <span>{connector.name}</span>
//             {isLoading && connector.id === pendingConnector?.id && (
//               <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
//             )}
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }