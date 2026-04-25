'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Plus,
  Search,
  ChevronLast,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { StatCards } from './internal-price-stats';
import { InternalPriceTable } from './internal-price-table';
import { PriceTierTable } from './price-tier-table';
import { InternalPrice, InternalPriceStats, InternalPriceStatus } from '../../models';
import InternalPriceService from '../../services/internal-price-services';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/shared/components/shadcn-ui/sheet';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';

interface InternalPriceListProps {
  onViewDetail: (price: InternalPrice) => void;
}

export function InternalPriceList({ onViewDetail }: InternalPriceListProps) {
  const [quickViewPrice, setQuickViewPrice] = useState<InternalPrice | null>(null);
  const [prices, setPrices] = useState<InternalPrice[]>([]);
  const [stats, setStats] = useState<InternalPriceStats | undefined>();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [currentPage, searchTerm, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const fetchStats = async () => {
    const result = await InternalPriceService.getStats();
    if (result.isSuccess && result.value) {
      setStats(result.value);
    }
    else {
      toast.error(result.message ?? "Thất bại khi thống kê số lượng");
    }
  };

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const statusMap: Record<string, InternalPriceStatus | undefined> = {
        'active': 'Active',
        'expiring': 'ExpiringSoon',
        'expired': 'Expired',
        'all': undefined
      };

      const result = await InternalPriceService.getList({
        searchTerm,
        status: statusMap[activeTab],
        pageNumber: currentPage,
        pageSize: 10
      });
      if (result.isSuccess && result.value) {
        setPrices(result.value.items);
        setTotalPages(result.value.totalPages);
      }
      else {
        toast.error(result.message ?? "Thất bại khi tải danh sách bảng giá");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-left-4 duration-1200" style={{ height: `calc(100vh - ${LAYOUT_CONSTANTS.HEADER_HEIGHT + LAYOUT_CONSTANTS.FOOTER_HEIGHT}px)` }}>
      <StatCards stats={stats} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col min-h-0">

        {/* Unified Header Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-50 p-4 shrink-0 z-10">
          <div className="flex items-center gap-4">

            {/* Search Input (Left) */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm mã giá, tên sản phẩm..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm text-slate-700 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>

            {/* Action Buttons (Right) */}
            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" className="h-9 admin-btn-primary gap-2 shadow-lg shadow-emerald-500/20">
                <Plus className="w-4 h-4" />
                Tạo bảng giá
              </Button>
            </div>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="relative overflow-x-auto flex-1 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <InternalPriceTable
              prices={prices}
              onViewDetail={onViewDetail}
              onQuickView={(price) => setQuickViewPrice(price)}
            />
          )}
        </div>

        {/* Local Pagination UI */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 text-gray-600 sticky bottom-0 z-20">
            <span className="text-xs font-medium">
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = currentPage;
                  if (totalPages > 5) {
                    if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                  } else {
                    pageNum = i + 1;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 p-0 rounded-lg text-xs font-bold ${currentPage === pageNum ? 'admin-btn-primary' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Drawer */}
      <Sheet open={!!quickViewPrice} onOpenChange={() => setQuickViewPrice(null)}>
        <SheetContent className="sm:max-w-md border-l-emerald-100 overflow-y-auto p-0 gap-0">
          {quickViewPrice && (
            <div className="flex flex-col h-full">
              {/* Header with Background Pattern */}
              <div className="relative p-6 bg-slate-50 border-b border-slate-100 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <BadgeDollarSign className="w-24 h-24" />
                </div>

                <SheetHeader className="relative z-10">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <div className="p-1 bg-emerald-100 rounded-md">
                      <BadgeDollarSign className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Quick View</span>
                  </div>
                  <SheetTitle className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                    {quickViewPrice.productName}
                  </SheetTitle>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded">
                      ID: {quickViewPrice.id}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100/50 px-1.5 py-0.5 rounded">
                      {quickViewPrice.productCode}
                    </span>
                  </div>
                </SheetHeader>
              </div>

              <div className="flex-1 p-6 space-y-6">
                {/* Price Matrix Section */}
                <div className="space-y-3">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                    Bảng giá cơ sở
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Giá đề xuất</p>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-black text-slate-900">{quickViewPrice.suggestedPrice.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">₫</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-[9px] font-bold text-rose-400 uppercase mb-1">Giá sàn</p>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-black text-rose-700">{quickViewPrice.floorPrice.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-rose-400 uppercase">₫</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tiers Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                      Phân tầng (Tiers)
                    </h4>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                      {quickViewPrice.priceTiers.length} Tiers
                    </span>
                  </div>
                  <div className="scale-95 origin-top-left w-[105.26%]">
                    <PriceTierTable tiers={quickViewPrice.priceTiers} compact={true} />
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 bg-white border-t border-slate-100 mt-auto flex gap-3">
                <Button className="flex-[1.5] h-10 rounded-lg text-xs font-bold admin-btn-primary shadow-lg shadow-emerald-500/20" onClick={() => onViewDetail(quickViewPrice)}>
                  Xem chi tiết
                </Button>
                <Button variant="outline" className="flex-1 h-10 rounded-lg text-xs font-bold border-slate-200 text-slate-600 shadow-sm" onClick={() => setQuickViewPrice(null)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Helpers
function BadgeDollarSign(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
