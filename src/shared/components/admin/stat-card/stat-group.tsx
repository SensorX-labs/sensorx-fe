'use client';

import React from 'react';
import { StatCard, StatPill, StatCardProps } from './stat-card';
import { cn } from '@/shared/utils/cn';

interface StatGroupProps {
  items: (StatCardProps & { key?: string | number })[];
  gridCols?: number;
  className?: string;
  variant?: 'card' | 'pill';
}

const gridColsMap: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  7: "lg:grid-cols-7",
  8: "lg:grid-cols-8",
  9: "lg:grid-cols-9",
  10: "lg:grid-cols-10",
  11: "lg:grid-cols-11",
  12: "lg:grid-cols-12",
};

export function StatGroup({ items, gridCols = 4, className, variant = 'card' }: StatGroupProps) {
  if (variant === 'pill') {
    return (
      <div className={cn("bg-white rounded border border-gray-100 shadow-sm p-4 mb-4", className)}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {items.map(({ key, ...itemProps }, index) => (
            <StatPill
              key={key ?? index}
              {...itemProps}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0",
      gridColsMap[gridCols] || "lg:grid-cols-4",
      className
    )}>
      {items.map(({ key, ...itemProps }, index) => (
        <StatCard
          key={key ?? index}
          {...itemProps}
        />
      ))}
    </div>
  );
}
