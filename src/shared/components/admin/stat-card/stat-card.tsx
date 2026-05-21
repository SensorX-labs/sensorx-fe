'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export type StatColorTheme = 'slate' | 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'indigo' | 'emerald' | 'orange' | 'dark' | 'purple';

export const STAT_COLORS: Record<StatColorTheme, {
  cardIcon: string;
  cardActiveBorder: string;
  pillInactive: string;
  pillActive: string;
}> = {
  slate: {
    cardIcon: 'bg-slate-50 text-slate-500',
    cardActiveBorder: 'border-slate-400 ring-2 ring-slate-100',
    pillInactive: 'bg-slate-100 text-slate-600',
    pillActive: 'border-slate-600 bg-slate-600 text-white',
  },
  gray: {
    cardIcon: 'bg-gray-50 text-gray-500',
    cardActiveBorder: 'border-gray-400 ring-2 ring-gray-100',
    pillInactive: 'bg-gray-100 text-gray-600',
    pillActive: 'border-gray-600 bg-gray-600 text-white',
  },
  dark: {
    cardIcon: 'bg-slate-100 text-slate-700',
    cardActiveBorder: 'border-slate-900 ring-2 ring-slate-200',
    pillInactive: 'bg-gray-100 text-gray-700',
    pillActive: 'border-gray-900 bg-gray-900 text-white',
  },
  blue: {
    cardIcon: 'bg-blue-50 text-blue-600',
    cardActiveBorder: 'border-blue-400 ring-2 ring-blue-100',
    pillInactive: 'bg-blue-50 text-blue-600',
    pillActive: 'border-blue-600 bg-blue-600 text-white',
  },
  green: {
    cardIcon: 'bg-green-50 text-green-600',
    cardActiveBorder: 'border-green-400 ring-2 ring-green-100',
    pillInactive: 'bg-green-50 text-green-600',
    pillActive: 'border-green-600 bg-green-600 text-white',
  },
  yellow: {
    cardIcon: 'bg-yellow-50 text-yellow-600',
    cardActiveBorder: 'border-yellow-400 ring-2 ring-yellow-100',
    pillInactive: 'bg-yellow-50 text-yellow-600',
    pillActive: 'border-yellow-500 bg-yellow-500 text-white',
  },
  red: {
    cardIcon: 'bg-red-50 text-red-500',
    cardActiveBorder: 'border-red-400 ring-2 ring-red-100',
    pillInactive: 'bg-red-50 text-red-500',
    pillActive: 'border-red-500 bg-red-500 text-white',
  },
  indigo: {
    cardIcon: 'bg-indigo-50 text-indigo-600',
    cardActiveBorder: 'border-indigo-400 ring-2 ring-indigo-100',
    pillInactive: 'bg-indigo-50 text-indigo-600',
    pillActive: 'border-indigo-600 bg-indigo-600 text-white',
  },
  emerald: {
    cardIcon: 'bg-emerald-50 text-emerald-600',
    cardActiveBorder: 'border-emerald-400 ring-2 ring-emerald-100',
    pillInactive: 'bg-emerald-50 text-emerald-600',
    pillActive: 'border-emerald-600 bg-emerald-600 text-white',
  },
  orange: {
    cardIcon: 'bg-orange-50 text-orange-500',
    cardActiveBorder: 'border-orange-400 ring-2 ring-orange-100',
    pillInactive: 'bg-orange-50 text-orange-500',
    pillActive: 'border-orange-500 bg-orange-500 text-white',
  },
  purple: {
    cardIcon: 'bg-purple-50 text-purple-600',
    cardActiveBorder: 'border-purple-400 ring-2 ring-purple-100',
    pillInactive: 'bg-purple-50 text-purple-600',
    pillActive: 'border-purple-500 bg-purple-500 text-white',
  },
};

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  colorTheme?: StatColorTheme;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StatPill({
  label,
  value,
  isActive,
  onClick,
  colorTheme = 'blue',
  className
}: StatCardProps) {
  const theme = STAT_COLORS[colorTheme];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all",
        isActive
          ? theme.pillActive
          : "border-gray-200 text-gray-600 hover:bg-gray-50",
        className
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "py-0.5 px-2.5 rounded-full text-xs font-bold",
          isActive ? "bg-white/20 text-white" : theme.pillInactive
        )}
      >
        {value}
      </span>
    </button>
  );
}


export function StatCard({
  label,
  value,
  icon: Icon,
  colorTheme = 'blue',
  isActive,
  onClick,
  className
}: StatCardProps) {
  const theme = STAT_COLORS[colorTheme];

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-5 rounded border transition-all flex items-center gap-4 bg-white",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-1",
        isActive 
          ? theme.cardActiveBorder
          : "border-slate-100 shadow-sm opacity-75 hover:opacity-100",
        className
      )}
    >
      {Icon && (
        <div className={cn("p-3 rounded shrink-0", theme.cardIcon)}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium mb-0.5 truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
