'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

interface AdminHeaderBarProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminHeaderBar({ children, className }: AdminHeaderBarProps) {
  return (
    <div className={cn(
      "bg-white/80 backdrop-blur-md border-b border-slate-50 p-4 shrink-0 z-10",
      className
    )}>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </div>
  );
}
