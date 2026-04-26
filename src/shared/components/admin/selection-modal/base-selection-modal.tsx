'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/shadcn-ui/dialog';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Search, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

interface BaseSelectionModalProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  searchPlaceholder?: string;
  icon: LucideIcon;
  onSelect: (item: T) => void;
  fetchData: (params: {
    searchTerm: string;
    lastValue?: string;
    lastId?: string;
  }) => Promise<{
    isSuccess: boolean;
    value?: {
      items: T[];
      hasNext: boolean;
      lastValue?: string;
      lastId?: string;
    };
    message?: string;
  }>;
  renderItem: (item: T, onSelect: (item: T) => void) => React.ReactNode;
  itemKey: (item: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

export function BaseSelectionModal<T>({
  isOpen,
  onOpenChange,
  title,
  description,
  searchPlaceholder = "Tìm kiếm...",
  icon: Icon,
  onSelect,
  fetchData,
  renderItem,
  itemKey,
  emptyTitle = "Không tìm thấy kết quả",
  emptyDescription = "Vui lòng thử từ khóa khác",
  pageSize = 10
}: BaseSelectionModalProps<T>) {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  const [pagination, setPagination] = useState<{
    hasNext: boolean;
    lastValue?: string;
    lastId?: string;
  }>({ hasNext: false });

  const loadData = async (isLoadMore = false) => {
    if (isLoadMore && (!pagination.hasNext || isFetchingRef.current)) return;

    isFetchingRef.current = true;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await fetchData({
        searchTerm: search,
        lastValue: isLoadMore ? pagination.lastValue : undefined,
        lastId: isLoadMore ? pagination.lastId : undefined,
      });

      if (response.isSuccess && response.value) {
        const { items: newItems, hasNext, lastValue, lastId } = response.value;

        if (isLoadMore) {
          setItems(prev => {
            const filteredNewItems = newItems.filter(
              newItem => !prev.some(p => itemKey(p) === itemKey(newItem))
            );
            return [...prev, ...filteredNewItems];
          });
        } else {
          setItems(newItems);
        }

        setPagination({ hasNext, lastValue, lastId });
      } else {
        toast.error(response.message || "Lỗi khi tải dữ liệu");
      }
    } catch (error) {
      toast.error("Không thể kết nối máy chủ");
    } finally {
      setLoading(false);
      setTimeout(() => {
        isFetchingRef.current = false;
        setLoadingMore(false);
      }, 200);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      loadData(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isScrollingDown = scrollTop > lastScrollTopRef.current;
    lastScrollTopRef.current = scrollTop;

    if (!isScrollingDown) return;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 20;

    if (isAtBottom && items.length > 0 && pagination.hasNext && !isFetchingRef.current) {
      loadData(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-slate-100 shadow-2xl rounded bg-white flex flex-col h-[80vh] max-h-[700px]">
        
        <DialogHeader className="p-6 pb-5 bg-white border-b border-slate-100 shrink-0 z-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-800 tracking-tight uppercase">
                {title}
              </DialogTitle>
              {description && <p className="text-slate-500 text-sm mt-0.5">{description}</p>}
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-12 h-12 bg-slate-50/80 border-slate-200 hover:border-emerald-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-bold rounded shadow-inner shadow-slate-100/50 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar p-3 scroll-smooth"
          onScroll={handleScroll}
        >
          {loading && !loadingMore ? (
            <div className="h-full flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded animate-spin mb-3" />
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="flex flex-col gap-2 w-full">
              {items.map(item => renderItem(item, onSelect))}
              
              {loadingMore && (
                <div className="py-6 flex flex-col items-center justify-center bg-white/50 rounded-b">
                  <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded animate-spin mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang tải thêm...</p>
                </div>
              )}
            </div>
          ) : !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-20">
              <div className="w-20 h-20 bg-white border border-slate-100 shadow-sm rounded flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-700 uppercase tracking-tight">{emptyTitle}</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-[250px] font-medium italic">{emptyDescription}</p>
            </div>
          ) : null}
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center px-6 shrink-0 z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị <span className="text-slate-700">{items.length}</span> kết quả</p>
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
            <span className="flex items-center justify-center w-4 h-4 rounded bg-white border shadow-sm text-[10px] font-bold">↵</span>
            <span>Click để chọn nhanh</span>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
