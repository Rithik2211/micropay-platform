import React from 'react'
import { Button } from './ui/button';

const NavigationBar = () => {
  return (
    <section className='w-full h-[55px] backdrop-blur-md fixed z-10 flex flex-row justify-between items-center px-[20px]'>
        <div className="text-2xl font-bold tracking-tighter">MicroPay</div>
        <div className='flex flex-row w-[300px] justify-between items-center space-x-2'>
            <div className="font-medium">Portal</div>
            <div className="font-medium">About</div>
            <Button className="h-8 px-4 rounded-[20px] transition-all hover:scale-105 ">
                Connect
            </Button>
        </div>
    </section>
  )
}

export default NavigationBar;