'use client';

import React from 'react';
import {
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/components/shadcn-ui/tooltip';
import { InternalPrice, InternalPriceStatus } from '../../../models';

interface InternalPriceTableProps {
  prices: InternalPrice[];
  onQuickView: (price: InternalPrice) => void;
}

export function InternalPriceTable({
  prices,
  onQuickView
}: InternalPriceTableProps) {

  const getStatusBadge = (status: InternalPriceStatus) => {
    const badgeMap: Record<InternalPriceStatus, { label: string, color: string, tooltip: string }> = {
      'Active': {
        label: 'Đang hiệu lực',
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

    const config = badgeMap[status];

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={`${config.color} font-medium`}>
              {config.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs max-w-[200px]">{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <table className="w-full text-sm">
      <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
        <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
          <th className="px-6 py-4 tracking-label uppercase font-semibold text-gray-400 text-[10px]">Mã sản phẩm</th>
          <th className="px-6 py-4 tracking-label uppercase font-semibold text-gray-400 text-[10px]">Sản phẩm</th>
          <th className="px-6 py-4 tracking-label uppercase font-semibold text-gray-400 text-[10px] text-right group cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-end gap-1">
              Giá đề xuất <ArrowUpDown className="w-3 h-3 text-gray-400 group-hover:text-emerald-500" />
            </div>
          </th>
          <th className="px-6 py-4 tracking-label uppercase font-semibold text-gray-400 text-[10px] text-center group cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-center gap-1">
              Giá sàn <ArrowUpDown className="w-3 h-3 text-gray-400 group-hover:text-emerald-500" />
            </div>
          </th>
          <th className="px-6 py-4 tracking-label uppercase font-semibold text-gray-400 text-[10px] text-center group cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-center gap-1">
              Trạng thái <Filter className="w-3 h-3 text-gray-400 group-hover:text-emerald-500" />
            </div>
          </th>
          <th className="px-6 py-4 tracking-label uppercase font-semibold text-gray-400 text-[10px] group cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-1">
              Ngày hết hạn <Filter className="w-3 h-3 text-gray-400 group-hover:text-emerald-500" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {prices.map((price) => (
          <React.Fragment key={price.id}>
            <tr
              className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
              onClick={() => onQuickView(price)}
            >
              <td className="px-6 py-4 font-mono text-[11px] font-bold text-emerald-700">{price.productCode}</td>
              <td className="px-6 py-4">
                <div className="font-bold text-gray-900 text-[13px]">{price.productName}</div>
              </td>
              <td className="px-6 py-4 text-right font-bold text-gray-700">
                {price.suggestedPrice.toLocaleString() + " " + price.suggestedPriceCurrency}
              </td>
              <td className="px-6 py-4 text-center">
                <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold text-xs border border-rose-100">
                  {price.floorPrice.toLocaleString() + " " + price.floorPriceCurrency}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                {getStatusBadge(price.status)}
              </td>
              <td className="px-6 py-4 text-gray-500 font-medium text-xs">
                {new Date(price.expiresAt).toLocaleDateString('vi-VN')}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
