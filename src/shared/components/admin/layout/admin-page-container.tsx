'use client';

import React from 'react';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';
import { cn } from '@/shared/utils/cn';

interface AdminPageContainerProps {
  children: React.ReactNode;
  className?: string;
  offsetBottom?: number; // Bù thêm khoảng cách nếu cần (ví dụ: +40px)
}

export function AdminPageContainer({ 
  children, 
  className, 
  offsetBottom = 0 
}: AdminPageContainerProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-4 animate-in fade-in slide-in-from-left-4 duration-1000 -mt-2 overflow-hidden",
        className
      )}
      style={{ 
        height: `calc(100vh - ${LAYOUT_CONSTANTS.HEADER_HEIGHT + LAYOUT_CONSTANTS.FOOTER_HEIGHT + offsetBottom}px)` 
      }}
    >
      {children}
    </div>
  );
}
