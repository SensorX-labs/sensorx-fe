'use client';

import React from 'react';
import { FileText, Clock, CheckCircle2, XCircle, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/shared/utils';
import { MOCK_QUOTES } from '@/features/sales/quotation/mocks/quote-mocks';
import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  [QuoteStatus.SENT]: {
    label: 'Đã gửi khách',
    icon: CheckCircle2,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [QuoteStatus.PENDING]: {
    label: 'Chờ xử lý',
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  [QuoteStatus.APPROVED]: {
    label: 'Đã duyệt',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  [QuoteStatus.ORDERED]: {
    label: 'Đã đặt hàng',
    icon: CheckCircle2,
    className: 'bg-[var(--brand-green)]/10 text-[var(--brand-green)] border-[var(--brand-green)]/20',
  },
  [QuoteStatus.EXPIRED]: {
    label: 'Hết hạn',
    icon: Clock,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  [QuoteStatus.RETURNED]: {
    label: 'Bị từ chối',
    icon: XCircle,
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  },
};

export function MyQuotationsTab({ onViewDetail }: { onViewDetail?: (id: string) => void }) {
  const myQuotes = MOCK_QUOTES;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="tracking-title-lg !mb-1">Báo giá của tôi</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm theo mã báo giá..."
            className="pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all w-80 btn-tracking uppercase"
          />
        </div>
      </div>

      <div className="space-y-4">
        {myQuotes.length > 0 ? (
          myQuotes.map((quote) => {
            const config = statusConfig[quote.status] || statusConfig[QuoteStatus.PENDING];
            
            return (
              <div 
                key={quote.id}
                className="group border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-200 cursor-pointer shadow-sm"
                onClick={() => onViewDetail?.(quote.code)}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-4">
                        <span className="tracking-title text-sm">
                          {quote.code}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border",
                          config.className
                        )}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-10">
                        <span className="flex items-center gap-1.5 meta-label uppercase">
                           Ngày: {new Date(quote.quoteDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1.5 meta-label uppercase">
                           Gốc: {quote.REQId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-16">
                    <div className="text-right">
                      <p className="tracking-label uppercase text-gray-400 mb-0.5 !text-[10px]">Tổng cộng</p>
                      <p className="qty-label !text-lg !text-gray-900">
                         {quote.items ? 
                            (quote.items.reduce((acc: any, i: any) => acc + (i.unitPrice * i.quantity), 0) * 1.1).toLocaleString('vi-VN') + ' VNĐ' : 
                            'Liên hệ'
                         }
                      </p>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900 group/btn btn-tracking">
                      <span>Chi tiết</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center bg-white border border-dashed border-gray-100">
             <FileText className="w-12 h-12 text-gray-100 mx-auto mb-4" />
             <p className="meta-label uppercase">Bạn chưa có báo giá nào được gửi từ hệ thống.</p>
          </div>
        )}
      </div>
    </div>
  );
}