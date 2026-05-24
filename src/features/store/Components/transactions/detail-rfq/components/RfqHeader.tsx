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
    <div className="flex items-start justify-between p-8 border-b border-gray-100/50">
      <div>
        <p className="meta-label uppercase text-gray-400 mb-2">
          Chi tiết yêu cầu
        </p>

        <h1 className="tracking-title-xl">
          {code}
        </h1>
      </div>

      <div
        className={cn(
          'px-5 py-2 border tracking-label text-[10px] uppercase font-bold',
          config.className
        )}
      >
        {config.label}
      </div>
    </div>
  );
}
