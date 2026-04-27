'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

interface AdminContentCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminContentCard({ children, className }: AdminContentCardProps) {
  return (
    <div className={cn(
      "bg-white rounded shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col min-h-0",
      className
    )}>
      {children}
    </div>
  );
}
