'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { FilterFieldConfig, FilterPanel } from '@/shared/components/admin/filter-panel';
import { StatCards } from './product-stats';
import { ProductTable } from './product-table';
import { ProductPageList, ProductStats } from '../../../models';
import { ProductService } from '../../../services/product-service';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import {
  AdminPageContainer,
  AdminContentCard,
  AdminHeaderBar,
} from '@/shared/components/admin/layout';
import { toast } from 'sonner';
import { ProductStatus } from '../../../enums/product-status';
import { ConfirmDialog } from '@/shared/components/admin/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';
import { Input } from '@/shared/components/shadcn-ui/input';

interface ProductListProps {
  onViewDetail: (product: ProductPageList) => void;
  onCreate: () => void;
  onEdit: (product: ProductPageList) => void;
}

const DEFAULT_FILTERS = {
  code: '',
  name: '',
  supplierName: '',
  categoryName: '',
  unitOfQuantityName: '',
  retailPriceFrom: '',
  retailPriceTo: '',
  createdFrom: '',
  createdTo: '',
};

type ProductFilterState = typeof DEFAULT_FILTERS;
type ProductFilterKey = keyof ProductFilterState;

const FILTER_FIELDS: Array<FilterFieldConfig & { id: ProductFilterKey }> = [
  {
    id: 'code',
    label: 'Mã hàng hóa',
    type: 'search',
    placeholder: 'Nhập mã hàng hóa',
  },
  {
    id: 'name',
    label: 'Tên hàng hóa',
    type: 'search',
    placeholder: 'Nhập tên hàng hóa',
  },
  {
    id: 'supplierName',
    label: 'Nhà cung cấp',
    type: 'search',
    placeholder: 'Nhập tên nhà cung cấp',
  },
  {
    id: 'categoryName',
    label: 'Danh mục',
    type: 'search',
    placeholder: 'Nhập tên danh mục',
  },
  {
    id: 'unitOfQuantityName',
    label: 'Đơn vị tính',
    type: 'search',
    placeholder: 'Nhập tên đơn vị tính',
  },
  {
    id: 'retailPriceFrom',
    label: 'Giá bán lẻ từ',
    type: 'number',
    placeholder: 'Nhập giá bán lẻ từ',
  },
  {
    id: 'retailPriceTo',
    label: 'Giá bán lẻ đến',
    type: 'number',
    placeholder: 'Nhập giá bán lẻ đến',
  },
  {
    id: 'createdFrom',
    label: 'Từ ngày',
    type: 'date',
  },
  {
    id: 'createdTo',
    label: 'Đến ngày',
    type: 'date',
  },
];

function buildProductQuery(
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  activeTab: string,
  filters: ProductFilterState
) {
  return {
    pageNumber,
    pageSize,
    searchTerm: searchTerm.trim() || undefined,
    code: filters.code.trim() || undefined,
    name: filters.name.trim() || undefined,
    supplierName: filters.supplierName.trim() || undefined,
    categoryName: filters.categoryName.trim() || undefined,
    unitOfQuantityName: filters.unitOfQuantityName.trim() || undefined,
    retailPriceFrom: filters.retailPriceFrom ? Number(filters.retailPriceFrom) : undefined,
    retailPriceTo: filters.retailPriceTo ? Number(filters.retailPriceTo) : undefined,
    createdFrom: filters.createdFrom || undefined,
    createdTo: filters.createdTo || undefined,
    status:
      activeTab !== 'all'
        ? activeTab === 'active'
          ? ProductStatus.ACTIVE
          : ProductStatus.INACTIVE
        : undefined,
  };
}

export function ProductList({ onViewDetail, onCreate, onEdit }: ProductListProps) {
  const [products, setProducts] = useState<ProductPageList[]>([]);
  const [stats, setStats] = useState<ProductStats | undefined>();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    product: ProductPageList | null;
  }>({
    isOpen: false,
    product: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const statsRes = await ProductService.getStats();
      if (statsRes) {
        setStats(statsRes);
      }
    };

    void loadStats();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const listRes = await ProductService.getProducts(
          buildProductQuery(currentPage, itemsPerPage, searchTerm, activeTab, filters)
        );

        if (listRes) {
          setProducts(listRes.items);
          setTotalItems(listRes.totalCount);
        }
      } catch (error) {
        console.error('>>> Error fetching products:', error);
        toast.error('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [currentPage, searchTerm, activeTab, filters]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDraftFilterChange = (fieldId: ProductFilterKey, value: string) => {
    setDraftFilters(current => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const handleResetDraftFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const handleRemoveFilter = (fieldId: ProductFilterKey) => {
    setFilters(current => ({
      ...current,
      [fieldId]: '',
    }));
    setCurrentPage(1);
  };

  const openFilterModal = () => {
    setDraftFilters(filters);
    setIsFilterOpen(true);
  };

  const applyDraftFilters = () => {
    setFilters(draftFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm.product) return;

    setIsDeleting(true);
    try {
      const res = await ProductService.deleteProduct(deleteConfirm.product.id);
      if (res) {
        setDeleteConfirm({ isOpen: false, product: null });

        const statsRes = await ProductService.getStats();
        if (statsRes) {
          setStats(statsRes);
        }

        setLoading(true);
        try {
          const listRes = await ProductService.getProducts(
            buildProductQuery(currentPage, itemsPerPage, searchTerm, activeTab, filters)
          );

          if (listRes) {
            setProducts(listRes.items);
            setTotalItems(listRes.totalCount);
          }
        } catch (error) {
          console.error('>>> Error fetching products:', error);
          toast.error('Không thể tải danh sách sản phẩm');
        } finally {
          setLoading(false);
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(value => value !== '' && value !== 'all').length,
    [filters]
  );

  return (
    <AdminPageContainer>
      <div className="shrink-0">
        <StatCards stats={stats} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <AdminContentCard>
        <AdminHeaderBar>
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[280px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={event => handleSearchChange(event.target.value)}
                placeholder="Tìm kiếm nhanh..."
                className="h-11 rounded-md border-slate-200 bg-white pl-10"
              />
            </div>

            <Button
              variant="outline"
              className="h-11 min-w-[140px] justify-center rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              onClick={openFilterModal}
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
            <Button
              onClick={onCreate}
              size="sm"
              className="h-10 admin-btn-primary gap-2 shadow-lg shadow-emerald-500/20 font-black uppercase tracking-widest text-[10px]"
            >
              <Plus className="w-4 h-4" />
              Tạo hàng hóa
            </Button>
          </div>
        </AdminHeaderBar>

        {activeFilterCount > 0 ? (
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-6 py-3">

            {FILTER_FIELDS.map(field => {
              const value = filters[field.id];
              if (!value || value === 'all') {
                return null;
              }

              const displayValue =
                field.type === 'date'
                  ? new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN')
                  : Number.isNaN(Number(value))
                    ? value
                    : Number(value).toLocaleString('vi-VN');

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

        <div className="relative overflow-x-auto flex-1 min-h-0 custom-scrollbar">
          <ProductTable
            products={products}
            onViewDetail={onViewDetail}
            onEdit={onEdit}
            onDelete={p => setDeleteConfirm({ isOpen: true, product: p })}
          />

          {loading ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] animate-in fade-in duration-300">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 animate-pulse">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="py-3"
        />
      </AdminContentCard>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onOpenChange={open => setDeleteConfirm({ ...deleteConfirm, isOpen: open })}
        title="Xác nhận xóa hàng hóa"
        description={`Bạn có chắc chắn muốn xóa sản phẩm "${deleteConfirm.product?.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        confirmText="Xác nhận xóa"
        type="danger"
        loading={isDeleting}
      />

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[min(1080px,calc(100vw-2rem))] max-w-none p-0 sm:max-w-none">
          <DialogHeader className="border-b border-slate-100 px-6 py-5">
            <DialogTitle>Bộ lọc hàng hóa</DialogTitle>
            <DialogDescription className="sr-only">
              Chọn các điều kiện để lọc danh sách hàng hóa.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6">
            <FilterPanel
              fields={FILTER_FIELDS}
              values={draftFilters}
              onChange={(fieldId, value) =>
                handleDraftFilterChange(fieldId as ProductFilterKey, value)
              }
              onReset={handleResetDraftFilters}
              hideHeader
              gridClassName="grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-3"
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
