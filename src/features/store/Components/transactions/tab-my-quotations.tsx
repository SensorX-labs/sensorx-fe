'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FileText, Clock, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/shared/utils';
import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';
import { StoreQuoteService, StoreMyQuoteItem } from '../../services/store-quote.service';
import { useRouter } from 'next/navigation';
import { ListSkeleton } from '@/shared/components/common/loading';

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  [QuoteStatus.SENT]: {
    label: 'Chờ phản hồi',
    icon: CheckCircle2,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [QuoteStatus.PENDING]: {
    label: 'Chờ phản hồi',
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  [QuoteStatus.APPROVED]: {
    label: 'Đã chốt',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  [QuoteStatus.ORDERED]: {
    label: 'Đã chốt',
    icon: CheckCircle2,
    className: 'bg-[var(--brand-green)]/10 text-[var(--brand-green)] border-[var(--brand-green)]/20',
  },
  [QuoteStatus.EXPIRED]: {
    label: 'Hết hạn',
    icon: Clock,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  [QuoteStatus.RETURNED]: {
    label: 'Đã từ chối',
    icon: CheckCircle2,
    className: 'bg-red-50 text-red-700 border-red-200',
  }
};

export function MyQuotationsTab({
  customerId
}: {
  customerId?: string
}) {
  const router = useRouter();
  const [quotes, setQuotes] = useState<StoreMyQuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [hasNext, setHasNext] = useState(false);

  const paginationRef = useRef({
    lastId: undefined as string | undefined,
    lastValue: undefined as string | undefined,
    pageSize: 10
  });

  const filters = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'WAITING', label: 'Chờ phản hồi' },
    { id: 'ACCEPTED', label: 'Đã chốt' },
    { id: QuoteStatus.RETURNED, label: 'Đã từ chối' },
    { id: QuoteStatus.EXPIRED, label: 'Hết hạn' }
  ];

  const fetchQuotes = useCallback(async (isLoadMore = false, status?: string, search?: string) => {
    if (!customerId) return;
    try {
      setLoading(true);

      const response = await StoreQuoteService.getMyQuotes({
        pageSize: paginationRef.current.pageSize,
        status: status === 'ALL' ? undefined : status,
        searchTerm: search || undefined,
        lastId: isLoadMore ? paginationRef.current.lastId : undefined,
        lastValue: isLoadMore ? paginationRef.current.lastValue : undefined,
        isDescending: true
      });

      if (response) {
        setQuotes(prev => isLoadMore ? [...prev, ...response.items] : response.items);
        paginationRef.current.lastId = response.lastId;
        paginationRef.current.lastValue = response.lastValue;
        setHasNext(response.hasNext);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  // Luồng đổi Tab / Init
  useEffect(() => {
    setQuotes([]);
    paginationRef.current.lastId = undefined;
    paginationRef.current.lastValue = undefined;
    fetchQuotes(false, activeFilter, searchTerm);
  }, [activeFilter, customerId, fetchQuotes]);

  // Luồng tìm kiếm (Debounce)
  useEffect(() => {
    if (!searchTerm) return;
    const timer = setTimeout(() => {
      paginationRef.current.lastId = undefined;
      paginationRef.current.lastValue = undefined;
      fetchQuotes(false, activeFilter, searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, activeFilter, fetchQuotes]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã báo giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all uppercase"
          />
        </div>
      </div>

      <div className="flex items-center border-b border-gray-100 mb-6 bg-white sticky top-0 z-10">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "flex-1 py-4 text-xs font-bold tracking-widest uppercase transition-all border-b-2 text-center",
              activeFilter === filter.id
                ? "border-[var(--brand-green)] text-[var(--brand-green)]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading && quotes.length === 0 ? (
          <ListSkeleton count={4} />
        ) : quotes.length > 0 ? (
          <>
            {quotes.map((quote) => {
              const config = statusConfig[quote.status] || { label: quote.status, icon: FileText, className: '' };
              const Icon = config.icon;

              return (
                <div
                  key={quote.id}
                  className="group border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-200 cursor-pointer shadow-sm"
                  onClick={() => router.push(`/transactions/quotations/${quote.id}`)}
                >
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-4">
                          <span className="tracking-title text-sm">{quote.code}</span>
                          <span className={cn("px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border flex items-center gap-1", config.className)}>
                            <Icon size={10} />
                            {config.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                          Giá trị: <span className="text-gray-900 font-bold">{quote.totalAmount?.toLocaleString()} VNĐ</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <p className="tracking-label uppercase text-gray-400 mb-0.5 !text-[10px]">Ngày báo giá</p>
                        <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('vi-VN') : '---'}
                        </p>
                      </div>
                      <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900 group/btn">
                        <span>Chi tiết</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && <ListSkeleton count={1} />}

            {hasNext && !loading && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => fetchQuotes(true, activeFilter, searchTerm)}
                  className="px-8 py-3 border border-gray-900 text-gray-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all"
                >
                  Xem thêm báo giá
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center bg-white border border-dashed border-gray-100">
            <FileText className="w-12 h-12 text-gray-100 mx-auto mb-4" />
            <p className="meta-label uppercase">Không tìm thấy báo giá nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}