'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/shadcn-ui/dialog';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Search, FolderTree, Layers, CheckCircle2, FileText } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/shadcn-ui/tooltip";
import CategoryService from '@/features/catalog/category/services/category-services';
import { toast } from 'sonner';
import { LoadMoreCategoriesForModalResponse } from '@/features/catalog/category/models';

interface CategorySelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (category: LoadMoreCategoriesForModalResponse) => void;
}

export function CategorySelectionDialog({
  isOpen,
  onOpenChange,
  onSelect
}: CategorySelectionDialogProps) {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<LoadMoreCategoriesForModalResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Refs for DOM manipulation and concurrency control
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  const [pagination, setPagination] = useState<{
    hasNext: boolean;
    lastValue?: string;
    lastId?: string;
  }>({ hasNext: false });

  /**
   * Core data fetching logic with concurrency locking
   */
  const fetchData = async (isLoadMore = false) => {
    // Prevent redundant requests or fetching if no more data is available
    if (isLoadMore && (!pagination.hasNext || isFetchingRef.current)) return;

    // Acquire lock immediately
    isFetchingRef.current = true;

    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await CategoryService.loadMoreForModal({
        searchTerm: search,
        pageSize: 6,
        isDescending: true,
        lastValue: isLoadMore ? pagination.lastValue : undefined,
        lastId: isLoadMore ? pagination.lastId : undefined,
      });

      if (response.isSuccess && response.value) {
        const { items, hasNext, lastValue, lastId } = response.value;

        if (isLoadMore) {
          setCategories(prev => {
            // Lọc bỏ những danh mục đã tồn tại trong danh sách để tránh trùng key
            const newItems = items.filter(item => !prev.some(c => c.id === item.id));
            return [...prev, ...newItems];
          });
        } else {
          setCategories(items);
        }

        setPagination({ hasNext, lastValue, lastId });
      } else {
        toast.error(response.message || "Lỗi khi tải danh mục");
      }
    } catch (error) {
      toast.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
      // Cooldown period
      setTimeout(() => {
        isFetchingRef.current = false;
        setLoadingMore(false);
      }, 200);
    }
  };

  /**
   * Effect to handle search debouncing
   */
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      fetchData(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, isOpen]);

  /**
   * Scroll event handler to trigger infinite loading
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    const isScrollingDown = scrollTop > lastScrollTopRef.current;
    lastScrollTopRef.current = scrollTop;

    if (!isScrollingDown) return;

    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 20;

    if (isAtBottom && categories.length > 0 && pagination.hasNext && !isFetchingRef.current) {
      fetchData(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-slate-100 shadow-2xl rounded bg-white flex flex-col h-[70vh] max-h-[600px]">

        {/* Modal Header */}
        <DialogHeader className="p-6 pb-5 bg-white border-b border-slate-100 shrink-0 z-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded flex items-center justify-center shrink-0">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-800 tracking-tight uppercase">
                Chọn danh mục
              </DialogTitle>
              <p className="text-slate-500 text-sm mt-0.5">Tìm kiếm và chọn danh mục phù hợp cho sản phẩm</p>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Nhập tên danh mục cần tìm..."
              className="pl-12 h-12 bg-slate-50/80 border-slate-200 hover:border-emerald-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-bold rounded shadow-inner shadow-slate-100/50 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </DialogHeader>

        {/* Category List Container */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar p-3 scroll-smooth"
          onScroll={handleScroll}
        >
          {loading && !loadingMore ? (
            <div className="h-full flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-3" />
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Đang tải danh mục...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="flex flex-col gap-2 w-full">
              {categories.map(c => (
                <div
                  key={c.id}
                  onClick={() => onSelect(c)}
                  className="group bg-white p-4 rounded border border-slate-200/60 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 cursor-pointer transition-all duration-200 flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-slate-50 rounded flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                      <Layers className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-base font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors uppercase tracking-tight">
                        {c.name}
                      </h4>
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 cursor-help">
                              <FileText className="w-3 h-3" />
                              <span className="truncate max-w-[300px]">
                                {c.description || 'Chưa có mô tả'}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 text-white border-slate-700 rounded text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-xl">
                            <p>{c.description || 'Không có mô tả chi tiết'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="shrink-0 pl-4 border-l border-slate-100 group-hover:border-emerald-100 transition-colors flex items-center h-full">
                    <Button variant="ghost" className="h-9 px-4 rounded font-black text-[10px] uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Chọn
                    </Button>
                  </div>
                </div>
              ))}

              {loadingMore && (
                <div className="py-6 flex flex-col items-center justify-center bg-white/50 rounded-b">
                  <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang tải thêm...</p>
                </div>
              )}
            </div>
          ) : !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-20">
              <div className="w-20 h-20 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-700 uppercase tracking-tight">Không tìm thấy danh mục</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-[250px] font-medium italic">Không có danh mục nào khớp với "{search}"</p>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center px-6 shrink-0 z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị <span className="text-slate-700">{categories.length}</span> danh mục</p>
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
            <span className="flex items-center justify-center w-4 h-4 rounded bg-white border shadow-sm text-[10px] font-bold">↵</span>
            <span>Click để chọn nhanh</span>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
