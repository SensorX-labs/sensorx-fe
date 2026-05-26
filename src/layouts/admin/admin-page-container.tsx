'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';
import { cn } from '@/shared/utils/cn';

interface AdminPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminPageContainer({
  children,
  className,
}: AdminPageContainerProps) {
  // usePathname() để theo dõi route hiện tại.
  // Truyền pathname làm `key` vào inner wrapper → force React unmount/remount
  // mỗi khi navigate → animate-in kích hoạt lại đúng cách.
  const pathname = usePathname();

  return (
    <main
      className={cn(
        // KHÔNG overflow-hidden ở đây — sẽ phá vỡ position: sticky của con cháu
        'flex flex-col flex-1 min-h-0',
        className
      )}
      style={{
        height: `calc(100vh - ${LAYOUT_CONSTANTS.HEADER_HEIGHT + LAYOUT_CONSTANTS.FOOTER_HEIGHT - 25}px)`,
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
    >
      {/* key={pathname}: buộc React unmount/remount nội dung mỗi lần đổi route
          → animate-in chạy lại. duration-[500ms] là arbitrary value hợp lệ. */}
      <div
        key={pathname}
        className="flex flex-col flex-1 min-h-0 animate-in fade-in slide-in-from-left-4 duration-[500ms]"
      >
        {children}
      </div>
    </main>
  );
}
