import React from 'react'
import { Button } from './ui/button';
import Image from 'next/image';

const NavigationBar = () => {
  return (
    <section className='w-full h-[55px] backdrop-blur-md fixed z-10 flex flex-row justify-between items-center px-[20px]'>
        <div className="text-2xl font-bold tracking-tighter flex flex-row justify-between"> <Image src={'/microPay.png'} width={40} height={40} alt='Logo'/>MicroPay</div>
        <div className='flex flex-row w-[200px] justify-between items-center space-x-2'>
            <div className="font-medium tracking-tighter cursor-pointer">Portal</div>
            <div className="font-medium tracking-tighter cursor-pointer">About</div>
            <Button className="h-8 px-4 rounded-[20px] transition-all hover:scale-105 ">
                Connect
            </Button>
        </div>
    </section>
  )
}

export default NavigationBar;