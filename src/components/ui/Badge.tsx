import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'featured' | 'new' | 'limited' | 'sale';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'featured', 
  className 
}) => {
  const variants = {
    featured: 'bg-clay-creek text-white',
    new: 'bg-green-500 text-white',
    limited: 'bg-red-500 text-white',
    sale: 'bg-orange-500 text-white'
  };

  return (
    <span className={cn(
      'absolute top-2 left-2 px-2 py-1 text-xs font-medium uppercase tracking-wide rounded z-10',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};