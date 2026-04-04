'use client';

import React from 'react';
import { FileText, Clock, CheckCircle2, XCircle, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/shared/utils';

interface QuotationRequest {
  id: string;
  date: string;
  status: 'pending' | 'responded' | 'cancelled' | 'expired';
  itemsCount: number;
  validUntil?: string;
  totalEstimated?: number;
}

const mockRequests: QuotationRequest[] = [
  {
    id: 'RFQ-2024-001',
    date: '2024-12-20',
    status: 'responded',
    itemsCount: 5,
    validUntil: '2024-12-30',
    totalEstimated: 12500000,
  },
  {
    id: 'RFQ-2024-002',
    date: '2024-12-18',
    status: 'pending',
    itemsCount: 2,
  },
  {
    id: 'RFQ-2024-003',
    date: '2024-11-15',
    status: 'expired',
    itemsCount: 12,
    validUntil: '2024-11-25',
  },
  {
    id: 'RFQ-2024-004',
    date: '2024-10-05',
    status: 'cancelled',
    itemsCount: 3,
  },
];

const statusConfig = {
  pending: {
    label: 'Đang chờ xử lý',
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  responded: {
    label: 'Đã báo giá',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  cancelled: {
    label: 'Đã hủy',
    icon: XCircle,
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  },
  expired: {
    label: 'Hết hạn',
    icon: Clock,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
};

export function QuotationRequestsTab({ onViewDetail }: { onViewDetail?: (id: string) => void }) {
  return (
    <div className="duration-500">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Yêu cầu báo giá của tôi</h2>
          <p className="text-sm text-gray-500">Theo dõi trạng thái các yêu cầu báo giá bạn đã gửi</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm theo mã yêu cầu..."
            className="pl-10 pr-4 py-2 border border-gray-200 focus:border-[var(--brand-green)] outline-none text-sm transition-all w-72"
          />
        </div>
      </div>

      <div className="space-y-4">
        {mockRequests.length > 0 ? (
          mockRequests.map((request) => {
            const config = statusConfig[request.status];
            
            return (
              <div 
                key={request.id}
                className="group border border-gray-100 bg-white hover:border-gray-300 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => onViewDetail?.(request.id)}
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-none border shrink-0 transition-transform group-hover:scale-110",
                      config.className
                    )}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 tracking-tight">{request.id}</span>
                        <span className={cn(
                          "px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest border",
                          config.className
                        )}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-8 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5 min-w-[120px]">
                           <Clock className="w-3.5 h-3.5" />
                           Ngày tạo: {request.date}
                        </span>
                        <span className="flex items-center gap-1.5 min-w-[150px]">
                           <FileText className="w-3.5 h-3.5" />
                           Số mặt hàng: {request.itemsCount}
                        </span>
                        {request.validUntil && (
                          <span className="text-red-500 font-medium">Hạn báo giá: {request.validUntil}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    {request.totalEstimated && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Giá trị ước tính</p>
                        <p className="text-lg font-bold text-[var(--brand-green)]">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(request.totalEstimated)}
                        </p>
                      </div>
                    )}
                    <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-[var(--brand-green)] transition-colors group/btn">
                      Chi tiết
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <div className="h-0.5 bg-gray-50 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-yellow-400/30 animate-pulse" />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-none bg-gray-50/50">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Bạn chưa có yêu cầu báo giá nào</p>
            <button className="mt-4 text-sm font-bold text-[var(--brand-green)] hover:underline uppercase tracking-widest">Gửi yêu cầu ngay</button>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="px-8 py-3 border border-gray-900 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300">
          Xem thêm yêu cầu cũ
        </button>
      </div>
    </div>
  );
}
