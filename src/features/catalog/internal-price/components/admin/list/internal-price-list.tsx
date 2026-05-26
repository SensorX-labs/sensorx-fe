'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { StatCards } from './internal-price-stats';
import { InternalPriceTable } from './internal-price-table';
import { FilterFieldConfig, FilterPanel } from '@/shared/components/admin/filter-panel';
import { InternalPrice, InternalPriceStats, InternalPriceStatus } from '../../../models';
import InternalPriceService from '../../../services/internal-price-services';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import {
  AdminPageContainer,
  AdminContentCard,
} from '@/shared/components/admin/layout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';
import { QuickViewDrawer } from './internal-price-quick-view-drawer';

interface InternalPriceListProps {
  onViewDetail: (price: InternalPrice) => void;
  onCreate: () => void;
}

const DEFAULT_FILTERS = {
  productCode: '',
  productName: '',
  expiresFrom: '',
  expiresTo: '',
  suggestedPriceFrom: '',
  suggestedPriceTo: '',
  floorPriceFrom: '',
  floorPriceTo: '',
};

type InternalPriceFilterState = typeof DEFAULT_FILTERS;
type InternalPriceFilterKey = keyof InternalPriceFilterState;

const FILTER_FIELDS: Array<FilterFieldConfig & { id: InternalPriceFilterKey }> = [
  {
    id: 'productCode',
    label: 'Mã sản phẩm',
    type: 'search',
    placeholder: 'Nhập mã sản phẩm',
  },
  {
    id: 'productName',
    label: 'Tên sản phẩm',
    type: 'search',
    placeholder: 'Nhập tên sản phẩm',
  },
  {
    id: 'expiresFrom',
    label: 'Hết hạn từ',
    type: 'date',
  },
  {
    id: 'expiresTo',
    label: 'Hết hạn đến',
    type: 'date',
  },
  {
    id: 'suggestedPriceFrom',
    label: 'Giá đề xuất từ',
    type: 'number',
    placeholder: '0',
  },
  {
    id: 'suggestedPriceTo',
    label: 'Giá đề xuất đến',
    type: 'number',
    placeholder: '0',
  },
  {
    id: 'floorPriceFrom',
    label: 'Giá sàn từ',
    type: 'number',
    placeholder: '0',
  },
  {
    id: 'floorPriceTo',
    label: 'Giá sàn đến',
    type: 'number',
    placeholder: '0',
  },
];

function buildInternalPriceQuery(
  pageNumber: number,
  searchTerm: string,
  status: string,
  filters: InternalPriceFilterState
) {
  const statusMap: Record<string, InternalPriceStatus | undefined> = {
    active: 'Active',
    expiring: 'ExpiringSoon',
    expired: 'Expired',
    all: undefined,
  };

  return {
    pageNumber,
    pageSize: 10,
    searchTerm: searchTerm.trim() || undefined,
    productCode: filters.productCode.trim() || undefined,
    productName: filters.productName.trim() || undefined,
    expiresFrom: filters.expiresFrom || undefined,
    expiresTo: filters.expiresTo || undefined,
    suggestedPriceFrom: filters.suggestedPriceFrom ? Number(filters.suggestedPriceFrom) : undefined,
    suggestedPriceTo: filters.suggestedPriceTo ? Number(filters.suggestedPriceTo) : undefined,
    floorPriceFrom: filters.floorPriceFrom ? Number(filters.floorPriceFrom) : undefined,
    floorPriceTo: filters.floorPriceTo ? Number(filters.floorPriceTo) : undefined,
    status: statusMap[status],
  };
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
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const resetPage = () => {
    setCurrentPage(current => (current === 1 ? current : 1));
  };

  useEffect(() => {
    const fetchStats = async () => {
      const result = await InternalPriceService.getStats();
      if (result) {
        setStats(result);
      }
    };

    void fetchStats();
  }, []);

  useEffect(() => {
    let isActive = true;

    const fetchPrices = async () => {
      setLoading(true);
      try {
        const result = await InternalPriceService.getList(
          buildInternalPriceQuery(currentPage, searchTerm, activeTab, filters)
        );
        if (isActive && result) {
          setPrices(result.items);
          setTotalPages(result.totalPages);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchPrices();

    return () => {
      isActive = false;
    };
  }, [currentPage, searchTerm, activeTab, filters]);

  const handleDraftFilterChange = (fieldId: InternalPriceFilterKey, value: string) => {
    setDraftFilters(current => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const handleResetDraftFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const handleRemoveFilter = (fieldId: InternalPriceFilterKey) => {
    resetPage();
    setFilters(current => ({
      ...current,
      [fieldId]: '',
    }));
  };

  const applyDraftFilters = () => {
    resetPage();
    setFilters(draftFilters);
    setIsFilterOpen(false);
  };

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(value => value !== '').length,
    [filters]
  );

  const hasActiveChips = activeFilterCount > 0 || activeTab !== 'all';

  return (
    <AdminPageContainer>
      <div className="shrink-0">
        <StatCards stats={stats} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <AdminContentCard>
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-500 xl:flex-row xl:items-center">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[280px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={event => {
                  resetPage();
                  setSearchTerm(event.target.value);
                }}
                placeholder="Tìm nhanh theo mã sản phẩm, tên sản phẩm..."
                className="h-11 rounded-md border-slate-200 bg-white pl-10"
              />
            </div>

            <Button
              variant="outline"
              className="h-11 min-w-[140px] justify-center rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setDraftFilters(filters);
                setIsFilterOpen(true);
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Bộ lọc
              {activeFilterCount > 0 ? (
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={onCreate} size="sm" className="h-10 admin-btn-primary rounded-md gap-2 shadow-lg shadow-emerald-500/20 font-bold">
              <Plus className="w-4 h-4" />
              Tạo bảng giá
            </Button>
          </div>
        </div>

        {hasActiveChips ? (
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-6 py-3">
            {activeTab !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  resetPage();
                  setActiveTab('all');
                }}
                className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
              >
                Trạng thái: {activeTab === 'active' ? 'Đang hiệu lực' : activeTab === 'expiring' ? 'Sắp hết hạn' : 'Đã hết hạn'}
              </button>
            ) : null}

            {FILTER_FIELDS.map(field => {
              const value = filters[field.id];
              if (!value) {
                return null;
              }

              const displayValue =
                field.type === 'date'
                  ? new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN')
                  : field.type === 'number'
                    ? Number(value).toLocaleString('vi-VN')
                  : value;

              return (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => handleRemoveFilter(field.id)}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  {field.label}: {displayValue}
                </button>
              );
            })}
          </div>
        ) : null}

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

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[min(960px,calc(100vw-2rem))] max-w-none sm:max-w-none p-0">
          <DialogHeader className="border-b border-slate-100 px-6 py-5">
            <DialogTitle>Bộ lọc bảng giá nội bộ</DialogTitle>
            <DialogDescription className="sr-only">
              Chọn các điều kiện để lọc danh sách bảng giá nội bộ.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6">
            <FilterPanel
              fields={FILTER_FIELDS}
              values={draftFilters}
              onChange={(fieldId, value) =>
                handleDraftFilterChange(fieldId as InternalPriceFilterKey, value)
              }
              onReset={handleResetDraftFilters}
              hideHeader
              gridClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-x-5 gap-y-4"
              className="border-0 bg-transparent p-0"
            />
          </div>

          <DialogFooter className="border-t border-slate-100 px-6 py-4">
            <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
              Đóng
            </Button>
            <Button variant="outline" onClick={handleResetDraftFilters}>
              Xóa bộ lọc
            </Button>
            <Button className="admin-btn-primary" onClick={applyDraftFilters}>
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageContainer>
  );
}
