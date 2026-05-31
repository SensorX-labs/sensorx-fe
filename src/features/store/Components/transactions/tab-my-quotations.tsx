'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Clock, CheckCircle2, ChevronRight, Search, FileText } from 'lucide-react';
import { cn } from '@/shared/utils';
import { StoreQuoteService, StoreMyQuoteItem, StatusCustomerCanSeeQuote } from '../../services/store-quote.service';
import { useRouter } from 'next/navigation';
import { ListSkeleton } from '@/shared/components/common/loading';

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  'All': {
    label: 'Tất cả',
    icon: Clock,
    className: 'bg-gray-150 text-gray-700 border-gray-200/50',
  },
  'Pending': {
    label: 'Chờ phản hồi',
    icon: Clock,
    className: 'bg-amber-100/80 text-amber-700 border-amber-200/50',
  },
  'Accepted': {
    label: 'Đã chốt',
    icon: CheckCircle2,
    className: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50',
  },
  'Expired': {
    label: 'Hết hạn',
    icon: Clock,
    className: 'bg-rose-100/80 text-rose-700 border-rose-200/50',
  },
  'Declined': {
    label: 'Đã từ chối',
    icon: CheckCircle2,
    className: 'bg-red-100/80 text-red-700 border-red-200/50',
  }
};

export function MyQuotationsTab() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<StoreMyQuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [hasNext, setHasNext] = useState(false);

  const paginationRef = useRef({
    lastId: undefined as string | undefined,
    lastValue: undefined as string | undefined,
    pageSize: 10
  });

  const filters: { id: string, label: string }[] = [
    { id: 'All', label: 'Tất cả' },
    { id: 'Pending', label: 'Chờ phản hồi' },
    { id: 'Accepted', label: 'Đã chốt' },
    { id: 'Declined', label: 'Đã từ chối' },
    { id: 'Expired', label: 'Hết hạn' }
  ];

  const fetchQuotes = useCallback(async (isLoadMore = false, status?: StatusCustomerCanSeeQuote | string, search?: string) => {
    try {
      setLoading(true);

      const response = await StoreQuoteService.getMyQuotes({
        pageSize: paginationRef.current.pageSize,
        status: status === 'All' ? undefined : status as StatusCustomerCanSeeQuote,
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
  }, []);

  useEffect(() => {
    setQuotes([]);
    const timer = setTimeout(() => {
      paginationRef.current.lastId = undefined;
      paginationRef.current.lastValue = undefined;
      fetchQuotes(false, activeFilter, searchTerm);
    }, searchTerm ? 400 : 0);

    return () => clearTimeout(timer);
  }, [activeFilter, searchTerm, fetchQuotes]);

  return (
    <div className="font-sans select-none">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm theo mã báo giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-stone-250 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-950 outline-none text-xs font-semibold transition-all uppercase focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] shadow-sm text-stone-900"
          />
        </div>
      </div>

      <div className="flex items-center border-b border-stone-200 dark:border-zinc-800 mb-6 bg-white dark:bg-zinc-950 sticky top-0 z-10">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "flex-1 py-4 text-[10px] font-extrabold tracking-widest uppercase transition-all border-b-2 text-center cursor-pointer",
              activeFilter === filter.id
                ? "border-[#0D9488] text-[#0D9488] dark:text-emerald-400"
                : "border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-white"
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
            {quotes.map((quote, idx) => {
              const config = statusConfig[quote.status] || { label: quote.status, icon: FileText, className: '' };
              const Icon = config.icon;
              const bgAccents = [
                'bg-emerald-500', 
                'bg-indigo-500',  
                'bg-teal-500',    
                'bg-violet-500',  
                'bg-amber-500',   
                'bg-cyan-500',    
              ];
              const bgAccent = bgAccents[idx % bgAccents.length];

              return (
                <div
                  key={quote.id}
                  className="glass-card group border border-stone-200 dark:border-stone-850 bg-[#F9F9FB] dark:bg-stone-900/60 backdrop-blur-md hover:bg-gray-150/20 dark:hover:bg-zinc-800/20 hover:-translate-y-0.5 transition-all duration-350 cursor-pointer shadow-sm overflow-hidden relative pl-2"
                  onClick={() => router.push(`/transactions/quotations/${quote.id}`)}
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${bgAccent}`} />

                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-4">
                          <span className="font-heading font-bold text-sm tracking-wide text-gray-900 dark:text-white">{quote.code}</span>
                          <span className={cn("px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border rounded flex items-center gap-1", config.className)}>
                            <Icon size={10} />
                            {config.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                          Giá trị: <span className="text-[#0D9488] font-bold">{quote.totalAmount?.toLocaleString()} VNĐ</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-12">
                      <div className="text-left sm:text-right">
                        <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400 mb-0.5">Ngày báo giá</p>
                        <p className="text-xs font-semibold text-stone-900 dark:text-gray-100 uppercase tracking-wider">
                          {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('vi-VN') : '---'}
                        </p>
                      </div>
                      <button className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-white group/btn hover:text-[#0D9488] transition-colors">
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
                  className="px-10 py-3.5 bg-[#0D9488] hover:bg-[#0F766E] text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  Xem thêm báo giá
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <FileText className="w-12 h-12 text-stone-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">Không tìm thấy báo giá nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}