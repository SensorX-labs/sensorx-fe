'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string; // Tailwind bg and text classes, e.g., 'bg-blue-50 text-blue-600'
  borderColor: string;
  activeBorder?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  borderColor,
  activeBorder,
  isActive,
  onClick,
  className
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-5 rounded border transition-all flex items-center gap-4 bg-white",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-1",
        isActive 
          ? (activeBorder || "border-primary ring-2 ring-primary/10") 
          : (borderColor || "border-slate-100 shadow-sm opacity-75 hover:opacity-100"),
        className
      )}
    >
      <div className={cn("p-3 rounded shrink-0", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium mb-0.5 truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
