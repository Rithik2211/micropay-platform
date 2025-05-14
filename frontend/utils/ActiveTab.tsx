'use client'
import { ReactNode } from "react";

interface NavLinkProps {
    isActive: boolean;
    children: ReactNode;
    onClick: () => void;
  }
  
  const ActiveTab: React.FC<NavLinkProps> = ({ isActive, children, onClick }) => {
    return (
      <div 
        className={`flex items-center px-3 py-2.5 rounded-md transition-colors font-medium tracking-tighter cursor-pointer ${
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'hover:bg-primary/5 text-foreground'
        }`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  };

export default ActiveTab;