'use client';

import { useEffect, useMemo, useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import { FilterFieldConfig, FilterPanel } from '@/shared/components/admin/filter-panel';
import { AdminContentCard, AdminPageContainer } from '@/shared/components/admin/layout';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';
import { Input } from '@/shared/components/shadcn-ui/input';
import { UnitOfQuantity, UnitOfQuantityPageListQuery } from '../../models';
import UnitOfQuantityService from '../../services/unit-of-quantity-services';
import { UnitOfQuantityForm } from './unit-of-quantity-form';
import { UnitOfQuantityTable } from './unit-of-quantity-table';

const DEFAULT_FILTERS = {
  name: '',
  description: '',
  createdFrom: '',
  createdTo: '',
};

type UnitFilterState = typeof DEFAULT_FILTERS;
type UnitFilterKey = keyof UnitFilterState;

const FILTER_FIELDS: Array<FilterFieldConfig & { id: UnitFilterKey }> = [
  {
    id: 'name',
    label: 'Tên đơn vị tính',
    type: 'search',
    placeholder: 'Nhập tên đơn vị tính',
  },
  {
    id: 'description',
    label: 'Mô tả',
    type: 'search',
    placeholder: 'Nhập nội dung mô tả',
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

function buildUnitQuery(
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  filters: UnitFilterState
): UnitOfQuantityPageListQuery {
  return {
    pageNumber,
    pageSize,
    searchTerm: searchTerm.trim() || undefined,
    name: filters.name.trim() || undefined,
    description: filters.description.trim() || undefined,
    createdFrom: filters.createdFrom || undefined,
    createdTo: filters.createdTo || undefined,
  };
}

export default function UnitOfQuantityManagement() {
  const [units, setUnits] = useState<UnitOfQuantity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitOfQuantity | null>(null);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const pageSize = 8;

  const refreshAll = async () => {
    setLoading(true);
    try {
      const pagedResponse = await UnitOfQuantityService.getPaged(
        buildUnitQuery(currentPage, pageSize, searchTerm, filters)
      );

      if (pagedResponse) {
        setUnits(pagedResponse.items);
        setTotalItems(pagedResponse.totalCount);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadUnits = async () => {
      setLoading(true);
      try {
        const response = await UnitOfQuantityService.getPaged(
          buildUnitQuery(currentPage, pageSize, searchTerm, filters)
        );

        if (isActive && response) {
          setUnits(response.items);
          setTotalItems(response.totalCount);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadUnits();

    return () => {
      isActive = false;
    };
  }, [currentPage, filters, searchTerm]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handleFilterChange = (fieldId: UnitFilterKey, value: string) => {
    setCurrentPage(1);
    setFilters(current => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const handleDraftFilterChange = (fieldId: UnitFilterKey, value: string) => {
    setDraftFilters(current => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleResetDraftFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const handleRemoveFilter = (fieldId: UnitFilterKey) => {
    handleFilterChange(
      fieldId,
      fieldId === 'name' ||
      fieldId === 'description' ||
      fieldId === 'createdFrom' ||
      fieldId === 'createdTo'
        ? ''
        : ''
    );
  };

  const openCreateModal = () => {
    setSelectedUnit(null);
    setIsFormOpen(true);
  };

  const openEditModal = (unit: UnitOfQuantity) => {
    setSelectedUnit(unit);
    setIsFormOpen(true);
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

  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter(value => value !== '' && value !== 'all').length +
      (searchTerm.trim() ? 1 : 0),
    [filters, searchTerm]
  );

  return (
    <AdminPageContainer>
      <AdminContentCard>
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-500 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[280px] flex-1 xl:max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={event => handleSearchChange(event.target.value)}
                placeholder="Tìm nhanh theo tên đơn vị tính hoặc mô tả..."
                className="h-11 rounded-md border-slate-200 bg-white pl-10"
              />
            </div>

            <Button
              variant="outline"
              className="rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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

          <div className="flex items-center gap-2">
            <Button className="admin-btn-primary rounded-md" onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo đơn vị tính
            </Button>
          </div>
        </div>

        {activeFilterCount > 0 ? (
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-6 py-3">
            {searchTerm.trim() ? (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
              >
                Tìm nhanh: {searchTerm}
              </button>
            ) : null}

            {FILTER_FIELDS.map(field => {
              const value = filters[field.id];
              if (!value || value === 'all') {
                return null;
              }

              const displayValue =
                field.type === 'select'
                  ? field.options.find(option => option.value === value)?.label ?? value
                  : field.type === 'date'
                    ? new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN')
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

        <div className="min-h-0 flex-1 overflow-y-auto">
          <UnitOfQuantityTable
            loading={loading}
            units={units}
            onEdit={openEditModal}
            onRefresh={refreshAll}
          />
        </div>

        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </AdminContentCard>

      <UnitOfQuantityForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        unit={selectedUnit}
        onSuccess={refreshAll}
      />

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[min(960px,calc(100vw-2rem))] max-w-none sm:max-w-none p-0">
          <DialogHeader className="border-b border-slate-100 px-6 py-5">
            <DialogTitle>Bộ lọc đơn vị tính</DialogTitle>
            <DialogDescription className="sr-only">
              Chọn các điều kiện để lọc danh sách đơn vị tính.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6">
            <FilterPanel
              fields={FILTER_FIELDS}
              values={draftFilters}
              onChange={(fieldId, value) =>
                handleDraftFilterChange(fieldId as UnitFilterKey, value)
              }
              onReset={handleResetDraftFilters}
              hideHeader
              gridClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-4"
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
