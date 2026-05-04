'use client';

import React from 'react';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/components/shadcn-ui/tooltip';
import { InternalPriceStatus } from '../../../models';

interface InternalPriceStatusBadgeProps {
  status: InternalPriceStatus;
  className?: string;
}

export function InternalPriceStatusBadge({ status, className }: InternalPriceStatusBadgeProps) {
  const badgeMap: Record<InternalPriceStatus, { label: string, color: string, tooltip: string }> = {
    'Active': {
      label: 'Đang hoạt động',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      tooltip: 'Bảng giá đang được áp dụng cho các giao dịch hiện tại.'
    },
    'ExpiringSoon': {
      label: 'Sắp hết hạn',
      color: 'bg-amber-50 text-amber-700 border-amber-100',
      tooltip: 'Bảng giá sẽ hết hiệu lực trong vòng 7 ngày tới.'
    },
    'Expired': {
      label: 'Đã hết hạn',
      color: 'bg-rose-50 text-rose-700 border-rose-100',
      tooltip: 'Bảng giá đã qua ngày hết hạn và không thể sử dụng.'
    }
  };

  const config = badgeMap[status] || {
    label: status,
    color: 'bg-slate-50 text-slate-700 border-slate-100',
    tooltip: 'Trạng thái không xác định'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${config.color} font-medium ${className}`}>
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs max-w-[200px]">{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
