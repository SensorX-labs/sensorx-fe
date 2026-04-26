'use client';

import React from 'react';
import { StatCard, StatCardProps } from './stat-card';
import { cn } from '@/shared/utils/cn';

interface StatGroupProps {
  items: (StatCardProps & { key?: string | number })[];
  gridCols?: number;
  className?: string;
}

export function StatGroup({ items, gridCols = 4, className }: StatGroupProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0",
      gridCols === 3 && "lg:grid-cols-3",
      gridCols === 4 && "lg:grid-cols-4",
      gridCols === 5 && "lg:grid-cols-5",
      className
    )}>
      {items.map((item, index) => (
        <StatCard 
          key={item.key ?? index} 
          {...item} 
        />
      ))}
    </div>
  );
}
