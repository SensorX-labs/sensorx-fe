'use client';

import { useEffect, useMemo, useState } from 'react';
import { Filter, Mail, Phone, Search } from 'lucide-react';
import { FilterFieldConfig, FilterPanel } from '@/shared/components/admin/filter-panel';
import { AdminContentCard, AdminPageContainer } from '@/shared/components/admin/layout';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';
import { Input } from '@/shared/components/shadcn-ui/input';
import CustomerService, {
  Customer,
  CustomerPageListQuery,
} from '../../services/customer-service';

const DEFAULT_FILTERS = {
  code: '',
  name: '',
  taxCode: '',
  email: '',
  phone: '',
  address: '',
  createdFrom: '',
  createdTo: '',
};

type CustomerFilterState = typeof DEFAULT_FILTERS;
type CustomerFilterKey = keyof CustomerFilterState;

const FILTER_FIELDS: Array<FilterFieldConfig & { id: CustomerFilterKey }> = [
  {
    id: 'code',
    label: 'Mã khách hàng',
    type: 'search',
    placeholder: 'Nhập mã khách hàng',
  },
  {
    id: 'name',
    label: 'Tên công ty',
    type: 'search',
    placeholder: 'Nhập tên công ty',
  },
  {
    id: 'taxCode',
    label: 'Mã số thuế',
    type: 'search',
    placeholder: 'Nhập mã số thuế',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'search',
    placeholder: 'Nhập email',
  },
  {
    id: 'phone',
    label: 'Điện thoại',
    type: 'search',
    placeholder: 'Nhập số điện thoại',
  },
  {
    id: 'address',
    label: 'Địa chỉ',
    type: 'search',
    placeholder: 'Nhập địa chỉ',
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

function buildCustomerQuery(
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  filters: CustomerFilterState
): CustomerPageListQuery {
  return {
    pageNumber,
    pageSize,
    searchTerm: searchTerm.trim() || undefined,
    code: filters.code.trim() || undefined,
    name: filters.name.trim() || undefined,
    taxCode: filters.taxCode.trim() || undefined,
    email: filters.email.trim() || undefined,
    phone: filters.phone.trim() || undefined,
    address: filters.address.trim() || undefined,
    createdFrom: filters.createdFrom || undefined,
    createdTo: filters.createdTo || undefined,
  };
}

function CustomerTable({
  customers,
  loading,
}: {
  customers: Customer[];
  loading: boolean;
}) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[1080px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Khách hàng
            </th>

            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Mã số thuế
            </th>

            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Liên hệ
            </th>

            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Địa chỉ
            </th>

            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Tạo lúc
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : customers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                Không tìm thấy khách hàng nào
              </td>
            </tr>
          ) : (
            customers.map(customer => (
              <tr key={customer.id} className="hover:bg-emerald-50/30">
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">{customer.name}</div>

                    <div className="text-xs font-medium text-slate-500">
                      {customer.code || '--'}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-500">
                  {customer.taxCode || 'Chưa cập nhật'}
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-2 text-slate-500">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{customer.email || '---'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{customer.phone || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                </td>

                <td className="max-w-sm px-6 py-4 text-slate-500">
                  <p className="line-clamp-2">
                    {customer.address || 'Chưa cập nhật địa chỉ'}
                  </p>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                  {customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString('vi-VN')
                    : '---'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);

      try {
        const response = await CustomerService.getPagedCustomers(
          buildCustomerQuery(currentPage, pageSize, searchTerm, filters)
        );

        if (response) {
          setCustomers(response.items);
          setTotalItems(response.totalCount || 0);
        }
      } catch (error) {
        console.error('>>> Lỗi khi fetch khách hàng:', error);
        setCustomers([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    void loadCustomers();
  }, [currentPage, searchTerm, filters]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDraftFilterChange = (
    fieldId: CustomerFilterKey,
    value: string
  ) => {
    setDraftFilters(current => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const handleRemoveFilter = (fieldId: CustomerFilterKey) => {
    setFilters(current => ({
      ...current,
      [fieldId]: '',
    }));

    setCurrentPage(1);
  };

  const handleResetDraftFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const applyDraftFilters = () => {
    setFilters(draftFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter(
        value => value !== '' && value !== 'all'
      ).length + (searchTerm.trim() ? 1 : 0),
    [filters, searchTerm]
  );

  const totalPages = Math.ceil(totalItems / pageSize);

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
                placeholder="Tìm kiếm nhanh..."
                className="h-11 rounded-md border-slate-200 bg-white pl-10"
              />
            </div>

            <Button
              variant="outline"
              className="rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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
                field.type === 'date'
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
          <CustomerTable customers={customers} loading={loading} />
        </div>

        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </AdminContentCard>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[min(1080px,calc(100vw-2rem))] max-w-none p-0 sm:max-w-none">
          <DialogHeader className="border-b border-slate-100 px-6 py-5">
            <DialogTitle>Bộ lọc khách hàng</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-6">
            <FilterPanel
              fields={FILTER_FIELDS}
              values={draftFilters}
              onChange={(fieldId, value) =>
                handleDraftFilterChange(
                  fieldId as CustomerFilterKey,
                  value
                )
              }
              onReset={handleResetDraftFilters}
              hideHeader
              gridClassName="grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-3"
              className="border-0 bg-transparent p-0"
            />
          </div>

          <DialogFooter className="border-t border-slate-100 px-6 py-4">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(false)}
            >
              Đóng
            </Button>

            <Button
              variant="outline"
              onClick={handleResetDraftFilters}
            >
              Xóa bộ lọc
            </Button>

            <Button
              className="admin-btn-primary"
              onClick={applyDraftFilters}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageContainer>
  );
}