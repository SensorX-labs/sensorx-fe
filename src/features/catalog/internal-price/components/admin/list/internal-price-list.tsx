'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { StatCards } from './internal-price-stats';
import { InternalPriceTable } from './internal-price-table';
import { InternalPrice, InternalPriceStats, InternalPriceStatus } from '../../../models';
import InternalPriceService from '../../../services/internal-price-services';
import { QuickViewDrawer } from './internal-price-quick-view-drawer';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';

interface InternalPriceListProps {
  onViewDetail: (price: InternalPrice) => void;
  onCreate: () => void;
}

export function InternalPriceList({ onViewDetail, onCreate }: InternalPriceListProps) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col space-y-4 animate-in fade-in slide-in-from-left-4 duration-1000 -mt-2 overflow-hidden"
      style={{ height: `calc(100vh - ${LAYOUT_CONSTANTS.HEADER_HEIGHT + LAYOUT_CONSTANTS.FOOTER_HEIGHT + 40}px)` }}
    >
      <div className="shrink-0">
        <StatCards stats={stats} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

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
              <Button onClick={onCreate} size="sm" className="h-9 admin-btn-primary gap-2 shadow-lg shadow-emerald-500/20 font-bold">
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
              onQuickView={(price) => setQuickViewPrice(price)}
            />
          )}
        </div>

        {/* Local Pagination UI */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 text-gray-600 sticky bottom-0 z-20">
            <span className="text-xs font-bold text-slate-500">
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

      <QuickViewDrawer
        price={quickViewPrice}
        onClose={() => setQuickViewPrice(null)}
        onViewDetail={(price) => {
          setQuickViewPrice(null);
          onViewDetail(price);
        }}
      />
    </div>
  );
}
