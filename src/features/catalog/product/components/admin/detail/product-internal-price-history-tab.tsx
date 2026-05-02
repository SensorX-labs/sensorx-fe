'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Layers, Clock } from 'lucide-react';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/shadcn-ui/tooltip';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import { InternalPrice, InternalPriceStatus } from '@/features/catalog/internal-price/models';
import InternalPriceService from '@/features/catalog/internal-price/services/internal-price-services';

interface ProductInternalPriceHistoryTabProps {
  productId: string;
}

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<
  InternalPriceStatus,
  { label: string; color: string; tooltip: string }
> = {
  Active: {
    label: 'Đang hiệu lực',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    tooltip: 'Bảng giá đang được áp dụng cho các giao dịch hiện tại.',
  },
  ExpiringSoon: {
    label: 'Sắp hết hạn',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
    tooltip: 'Bảng giá sẽ hết hiệu lực trong vòng 7 ngày tới.',
  },
  Expired: {
    label: 'Đã hết hạn',
    color: 'bg-rose-50 text-rose-700 border-rose-100',
    tooltip: 'Bảng giá đã qua ngày hết hạn và không thể sử dụng.',
  },
};

function StatusBadge({ status }: { status: InternalPriceStatus }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    color: 'bg-slate-50 text-slate-700 border-slate-100',
    tooltip: '',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${config.color} font-medium`}>
            {config.label}
          </Badge>
        </TooltipTrigger>
        {config.tooltip && (
          <TooltipContent side="top">
            <p className="text-xs max-w-[200px]">{config.tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === 'VND' ? 'đ' : currency;
  return `${amount.toLocaleString('vi-VN')} ${symbol}`;
}

export function ProductInternalPriceHistoryTab({
  productId,
}: ProductInternalPriceHistoryTabProps) {
  const [items, setItems] = useState<InternalPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, [productId, currentPage]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const result = await InternalPriceService.getProductHistory(productId, {
        pageNumber: currentPage,
        pageSize: PAGE_SIZE,
      });
      if (result.isSuccess && result.value) {
        setItems(result.value.items);
        setTotalPages(result.value.totalPages);
        setTotalCount(result.value.totalCount);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Đang tải lịch sử bảng giá...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
          <DollarSign className="w-8 h-8 opacity-10" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest opacity-40">
          Chưa có lịch sử bảng giá
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-6 py-3 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {totalCount} bản ghi
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-left">
              <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Ngày hết hạn
              </th>
              <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 text-right">
                Giá đề xuất
              </th>
              <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 text-right">
                Giá sàn
              </th>
              <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 text-center">
                Số bậc giá
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-3 text-xs font-bold text-slate-700 tabular-nums">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-6 py-3 text-xs tabular-nums">
                  {item.expiresAt ? (
                    <span className="font-bold text-slate-700">
                      {formatDate(item.expiresAt)}
                    </span>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-600 border-blue-100 font-medium text-[10px]"
                    >
                      Vô thời hạn
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-3 text-right">
                  <span className="text-xs font-black text-emerald-700 tabular-nums">
                    {formatCurrency(item.suggestedPrice, item.suggestedPriceCurrency)}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <span className="text-xs font-black text-rose-700 tabular-nums">
                    {formatCurrency(item.floorPrice, item.floorPriceCurrency)}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Layers className="w-3 h-3 text-slate-300" />
                    <span className="text-xs font-bold text-slate-600">
                      {item.priceTiers.length}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LocalPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
