'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Filter, Search } from 'lucide-react';

import { Button } from '@/shared/components/shadcn-ui/button';
import { cn } from '@/shared/utils/cn';

import { InvoiceStatus } from '../../enums/invoice-status';
import { InvoiceListItem } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';

import { InvoiceStats } from './invoice-stats';

import { useDebounce } from '@/shared/hooks/use-debounce';

import { FilterFieldConfig, FilterPanel } from '@/shared/components/admin/filter-panel';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';

import { Input } from '@/shared/components/shadcn-ui/input';

import { LocalPagination } from '@/shared/components/admin/local-pagination';

import { toast } from 'sonner';

const DEFAULT_FILTERS = {
  code: '',
  orderCode: '',
  companyName: '',
  taxCode: '',
  address: '',
  totalFrom: '',
  totalTo: '',
  amountPaidFrom: '',
  amountPaidTo: '',
  issueFrom: '',
  issueTo: '',
  createdFrom: '',
  createdTo: '',
};

type InvoiceFilterState = typeof DEFAULT_FILTERS;

type InvoiceFilterKey = keyof InvoiceFilterState;

const FILTER_FIELDS: Array<FilterFieldConfig & { id: InvoiceFilterKey }> = [
  {
    id: 'code',
    label: 'Mã hoá đơn',
    type: 'search',
    placeholder: 'Nhập mã hoá đơn',
  },

  {
    id: 'orderCode',
    label: 'Mã đơn hàng',
    type: 'search',
    placeholder: 'Nhập mã đơn hàng',
  },

  {
    id: 'companyName',
    label: 'Công ty',
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
    id: 'address',
    label: 'Địa chỉ',
    type: 'search',
    placeholder: 'Nhập địa chỉ',
  },

  {
    id: 'totalFrom',
    label: 'Tổng tiền từ',
    type: 'number',
    placeholder: 'Nhập tổng tiền từ',
  },

  {
    id: 'totalTo',
    label: 'Tổng tiền đến',
    type: 'number',
    placeholder: 'Nhập tổng tiền đến',
  },

  {
    id: 'amountPaidFrom',
    label: 'Đã thu từ',
    type: 'number',
    placeholder: 'Nhập số đã thu từ',
  },

  {
    id: 'amountPaidTo',
    label: 'Đã thu đến',
    type: 'number',
    placeholder: 'Nhập số đã thu đến',
  },

  {
    id: 'issueFrom',
    label: 'Ngày lập từ',
    type: 'date',
  },

  {
    id: 'issueTo',
    label: 'Ngày lập đến',
    type: 'date',
  },

  {
    id: 'createdFrom',
    label: 'Ngày tạo từ',
    type: 'date',
  },

  {
    id: 'createdTo',
    label: 'Ngày tạo đến',
    type: 'date',
  },
];

const statusStyles: Record<string, string> = {
  [InvoiceStatus.Unpaid]: 'bg-yellow-50 text-yellow-700 border-yellow-200',

  [InvoiceStatus.PartiallyPaid]:
    'bg-orange-50 text-orange-700 border-orange-200',

  [InvoiceStatus.Paid]:
    'bg-emerald-50 text-emerald-700 border-emerald-200',

  [InvoiceStatus.Issued]:
    'bg-blue-50 text-blue-700 border-blue-200',

  [InvoiceStatus.Cancelled]:
    'bg-red-50 text-red-700 border-red-200',
};

const statusLabels: Record<string, string> = {
  [InvoiceStatus.Unpaid]: 'Chờ thanh toán',

  [InvoiceStatus.PartiallyPaid]: 'Thanh toán một phần',

  [InvoiceStatus.Paid]: 'Đã thanh toán',

  [InvoiceStatus.Issued]: 'Đã phát hành',

  [InvoiceStatus.Cancelled]: 'Đã huỷ',
};

const formatMoney = (value?: number) =>
  `${(value ?? 0).toLocaleString('vi-VN')} đ`;

function buildDateStart(value: string) {
  return value ? `${value}T00:00:00` : undefined;
}

function buildDateEnd(value: string) {
  return value ? `${value}T23:59:59.999` : undefined;
}

function buildInvoiceQuery(
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  statusFilter: string,
  filters: InvoiceFilterState
) {
  return {
    pageNumber,

    pageSize,

    searchTerm: searchTerm.trim() || undefined,

    status: statusFilter === 'ALL' ? undefined : statusFilter,

    code: filters.code.trim() || undefined,

    orderCode: filters.orderCode.trim() || undefined,

    companyName: filters.companyName.trim() || undefined,

    taxCode: filters.taxCode.trim() || undefined,

    address: filters.address.trim() || undefined,

    totalFrom: filters.totalFrom
      ? Number(filters.totalFrom)
      : undefined,

    totalTo: filters.totalTo
      ? Number(filters.totalTo)
      : undefined,

    amountPaidFrom: filters.amountPaidFrom
      ? Number(filters.amountPaidFrom)
      : undefined,

    amountPaidTo: filters.amountPaidTo
      ? Number(filters.amountPaidTo)
      : undefined,

    issueFrom: buildDateStart(filters.issueFrom),

    issueTo: buildDateEnd(filters.issueTo),

    createdFrom: buildDateStart(filters.createdFrom),

    createdTo: buildDateEnd(filters.createdTo),
  };
}

export default function InvoiceList() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalItems, setTotalItems] = useState(0);

  const [refreshKey] = useState(0);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const pageSize = 12;

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);

      try {
        const response = await InvoiceService.getListInvoices(
          buildInvoiceQuery(
            currentPage,
            pageSize,
            debouncedSearch,
            statusFilter,
            filters
          )
        );

        setInvoices(response?.items ?? []);

        setTotalItems(response?.totalCount ?? 0);
      } catch (error) {
        console.error('>>> Lỗi khi tải hoá đơn:', error);

        toast.error('Không thể tải danh sách hoá đơn');

        setInvoices([]);

        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    void fetchInvoices();
  }, [
    currentPage,
    debouncedSearch,
    statusFilter,
    filters,
    refreshKey,
  ]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    setCurrentPage(1);
  };

  const handleDraftFilterChange = (
    fieldId: InvoiceFilterKey,
    value: string
  ) => {
    setDraftFilters(current => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const handleResetDraftFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const handleRemoveFilter = (fieldId: InvoiceFilterKey) => {
    setFilters(current => ({
      ...current,
      [fieldId]: '',
    }));

    setCurrentPage(1);
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
      ).length,
    [filters]
  );

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-4">
      <InvoiceStats
        refreshKey={refreshKey}
        statusFilter={statusFilter}
        onFilter={value => {
          setStatusFilter(value);

          setCurrentPage(1);
        }}
      />

      <div className="flex flex-col overflow-hidden rounded border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-500 xl:flex-row xl:items-center">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[280px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={searchTerm}
                onChange={event =>
                  handleSearchChange(event.target.value)
                }
                placeholder="Tìm nhanh theo mã hoá đơn, công ty, đơn hàng..."
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
        </div>

        {activeFilterCount > 0 ? (
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-6 py-3">
            {FILTER_FIELDS.map(field => {
              const value = filters[field.id];

              if (!value || value === 'all') {
                return null;
              }

              const displayValue =
                field.type === 'date'
                  ? new Date(
                      `${value}T00:00:00`
                    ).toLocaleDateString('vi-VN')
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

        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[1260px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-left uppercase tracking-label">
                  Mã HĐ
                </th>

                <th className="px-6 py-4 text-left uppercase tracking-label">
                  Đơn hàng
                </th>

                <th className="px-6 py-4 text-left uppercase tracking-label">
                  Công ty
                </th>

                <th className="px-6 py-4 text-left uppercase tracking-label">
                  Ngày lập
                </th>

                <th className="px-6 py-4 text-center uppercase tracking-label">
                  Sản phẩm
                </th>

                <th className="px-6 py-4 text-right uppercase tracking-label">
                  Đã thu
                </th>

                <th className="px-6 py-4 text-right uppercase tracking-label">
                  Tổng tiền
                </th>

                <th className="px-6 py-4 text-center uppercase tracking-label">
                  Trạng thái
                </th>

                <th className="px-6 py-4 text-right uppercase tracking-label">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center font-medium italic text-slate-400"
                  >
                    Đang tải hoá đơn...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center font-medium italic text-slate-400"
                  >
                    Không tìm thấy hoá đơn nào
                  </td>
                </tr>
              ) : (
                invoices.map(inv => (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50/80"
                  >
                    <td className="px-6 py-4 font-bold tracking-tight text-gray-900">
                      {inv.code}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {inv.orderId}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {inv.companyName}
                      </div>

                      <div className="mt-0.5 text-xs text-gray-500">
                        {inv.taxCode}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {new Date(inv.issueAt).toLocaleDateString(
                        'vi-VN'
                      )}
                    </td>

                    <td className="px-6 py-4 text-center font-semibold text-gray-700">
                      {inv.itemCount}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {formatMoney(inv.amountPaid)}
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {formatMoney(inv.grandTotal)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          'rounded border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest',
                          statusStyles[inv.status] ??
                            'bg-gray-100 text-gray-500 border-gray-200'
                        )}
                      >
                        {statusLabels[inv.status] ?? inv.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            router.push(`/sales/invoices/${inv.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="py-3"
        />
      </div>

      <Dialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
      >
        <DialogContent className="w-[min(1080px,calc(100vw-2rem))] max-w-none p-0 sm:max-w-none">
          <DialogHeader className="border-b border-slate-100 px-6 py-5">
            <DialogTitle>Bộ lọc hoá đơn</DialogTitle>

            <DialogDescription className="sr-only">
              Chọn các điều kiện để lọc danh sách hoá đơn.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6">
            <FilterPanel
              fields={FILTER_FIELDS}
              values={draftFilters}
              onChange={(fieldId, value) =>
                handleDraftFilterChange(
                  fieldId as InvoiceFilterKey,
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
              Xoá bộ lọc
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
    </div>
  );
}
