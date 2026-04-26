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
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import {
  AdminPageContainer,
  AdminContentCard,
  AdminHeaderBar
} from '@/shared/components/admin/layout';
import { QuickViewDrawer } from './internal-price-quick-view-drawer';

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
    <AdminPageContainer offsetBottom={40}>
      <div className="shrink-0">
        <StatCards stats={stats} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <AdminContentCard>
        <AdminHeaderBar>
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
        </AdminHeaderBar>

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

        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="py-3"
        />
      </AdminContentCard>

      <QuickViewDrawer
        price={quickViewPrice}
        onClose={() => setQuickViewPrice(null)}
        onViewDetail={(price) => {
          setQuickViewPrice(null);
          onViewDetail(price);
        }}
      />
    </AdminPageContainer>
  );
}
