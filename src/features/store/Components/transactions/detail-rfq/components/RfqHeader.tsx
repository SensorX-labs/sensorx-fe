import React from 'react';
import { cn } from '@/shared/utils';

interface RfqHeaderProps {
  code: string;
  config: {
    label: string;
    className: string;
  };
}

export function RfqHeader({ code, config }: RfqHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#edf1f4] bg-[#f8fafc] p-8">
      <div>
        <p className="meta-label mb-2 uppercase text-gray-400">Chi tiết yêu cầu</p>
        <h1 className="tracking-title-xl">{code}</h1>
      </div>

      <div
        className={cn(
          'rounded-full px-5 py-2 border tracking-label text-[10px] font-bold uppercase shadow-sm',
          config.className
        )}
      >
        {config.label}
      </div>
    </div>
  );
}
