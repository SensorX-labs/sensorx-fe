'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Filter, Search, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { QuoteStatus } from '../../constants/quote-status';
import { ActionType } from '@/shared/constants/action-type';
import { QuoteListItem, QuoteService, QuoteResponseStatus } from '../../services/quote.service';
import { useUser } from '@/shared/hooks/use-user';
import { cn } from '@/shared/utils/cn';
import { QuotationStats } from './quotation-stats';
import { toast } from 'sonner';
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
import { AdminContentCard } from '@/shared/components/admin/layout';

type CombinedStatus = QuoteStatus | QuoteResponseStatus;

const DEFAULT_FILTERS = {
  code: '',
  companyName: '',
  customerEmail: '',
  customerPhone: '',
  senderName: '',
  totalFrom: '',
  totalTo: '',
  quoteDateFrom: '',
  quoteDateTo: '',
  createdFrom: '',
  createdTo: '',
};

type QuoteFilterState = typeof DEFAULT_FILTERS;
type QuoteFilterKey = keyof QuoteFilterState;

const FILTER_FIELDS: Array<FilterFieldConfig & { id: QuoteFilterKey }> = [
  {
    id: 'code',
    label: 'Mã báo giá',
    type: 'search',
    placeholder: 'Nhập mã báo giá',
  },
  {
    id: 'companyName',
    label: 'Công ty',
    type: 'search',
    placeholder: 'Nhập tên công ty',
  },
  {
    id: 'customerEmail',
    label: 'Email khách hàng',
    type: 'search',
    placeholder: 'Nhập email khách hàng',
  },
  {
    id: 'customerPhone',
    label: 'Số điện thoại',
    type: 'search',
    placeholder: 'Nhập số điện thoại',
  },
  {
    id: 'senderName',
    label: 'Người gửi',
    type: 'search',
    placeholder: 'Nhập tên người gửi',
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
    id: 'quoteDateFrom',
    label: 'Ngày báo giá từ',
    type: 'date',
  },
  {
    id: 'quoteDateTo',
    label: 'Ngày báo giá đến',
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

const statusStyles: Record<CombinedStatus, string> = {
  [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-500 border-gray-200',
  [QuoteStatus.PENDING]: 'bg-blue-50 text-blue-600 border-blue-100',
  [QuoteStatus.APPROVED]: 'bg-green-50 text-green-600 border-green-100',
  [QuoteStatus.RETURNED]: 'bg-red-50 text-red-600 border-red-100',
  [QuoteStatus.SENT]: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  [QuoteStatus.ORDERED]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  [QuoteStatus.CANCELLED]: 'bg-gray-50 text-gray-400 border-gray-200',
  [QuoteStatus.EXPIRED]: 'bg-orange-50 text-orange-600 border-orange-100',
  [QuoteResponseStatus.Accepted]: 'bg-green-50 text-green-600 border-green-100',
  [QuoteResponseStatus.Declined]: 'bg-red-50 text-red-600 border-red-100',
};

const statusLabels: Record<CombinedStatus, string> = {
  [QuoteStatus.DRAFT]: 'Nháp',
  [QuoteStatus.PENDING]: 'Chờ duyệt',
  [QuoteStatus.APPROVED]: 'Đã phê duyệt',
  [QuoteStatus.RETURNED]: 'Từ chối',
  [QuoteStatus.SENT]: 'Đã gửi khách',
  [QuoteStatus.ORDERED]: 'Đã sinh đơn',
  [QuoteStatus.CANCELLED]: 'Đã huỷ',
  [QuoteStatus.EXPIRED]: 'Đã hết hạn',
  [QuoteResponseStatus.Accepted]: 'Khách đã chốt',
  [QuoteResponseStatus.Declined]: 'Khách từ chối',
};

function buildDateStart(value: string) {
  return value ? `${value}T00:00:00` : undefined;
}

function buildDateEnd(value: string) {
  return value ? `${value}T23:59:59.999` : undefined;
}

function buildQuoteQuery(
  pageNumber: number,
  pageSize: number,
  status: string,
  searchTerm: string,
  filters: QuoteFilterState
) {
  let queryStatus: QuoteStatus | undefined;
  let responseType: QuoteResponseStatus | undefined;
  let isExpired: boolean | undefined;

  if (status !== 'ALL') {
    if (status === QuoteResponseStatus.Accepted) {
      responseType = QuoteResponseStatus.Accepted;
    } else if (status === QuoteResponseStatus.Declined) {
      responseType = QuoteResponseStatus.Declined;
    } else if (status === QuoteStatus.EXPIRED) {
      isExpired = true;
    } else {
      queryStatus = status as QuoteStatus;
    }
  }

  return {
    pageNumber,
    pageSize,
    status: queryStatus,
    responseType,
    isExpired,
    searchTerm: searchTerm.trim() || undefined,
    code: filters.code.trim() || undefined,
    companyName: filters.companyName.trim() || undefined,
    customerEmail: filters.customerEmail.trim() || undefined,
    customerPhone: filters.customerPhone.trim() || undefined,
    senderName: filters.senderName.trim() || undefined,
    totalFrom: filters.totalFrom ? Number(filters.totalFrom) : undefined,
    totalTo: filters.totalTo ? Number(filters.totalTo) : undefined,
    quoteDateFrom: buildDateStart(filters.quoteDateFrom),
    quoteDateTo: buildDateEnd(filters.quoteDateTo),
    createdFrom: buildDateStart(filters.createdFrom),
    createdTo: buildDateEnd(filters.createdTo),
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function QuotationList() {
  const router = useRouter();
  const { user } = useUser();

  const [quotes, setQuotes] = useState<QuoteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(searchTerm, 400);
  const pageSize = 12;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await QuoteService.getListQuotes(
          buildQuoteQuery(currentPage, pageSize, statusFilter, debouncedSearch, filters)
        );

        if (res) {
          setQuotes(res.items);
          setTotalItems(res.totalCount);
        }
      } catch (error: unknown) {
        console.error('>>> Lỗi khi tải báo giá:', error);
        toast.error('Không thể tải danh sách báo giá');

        setQuotes([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [currentPage, debouncedSearch, statusFilter, filters, refreshKey]);

  const goTo = (id: string, action: ActionType) => {
    router.push(`/sales/quotations/${id}?action=${action}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá báo giá này?')) {
      return;
    }

    try {
      await QuoteService.deleteQuote(id);

      toast.success('Đã xoá báo giá');

      setCurrentPage(1);
      setRefreshKey(current => current + 1);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Lỗi khi xoá báo giá'));
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDraftFilterChange = (fieldId: QuoteFilterKey, value: string) => {
    setDraftFilters(current => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const handleResetDraftFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const handleRemoveFilter = (fieldId: QuoteFilterKey) => {
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
    () => Object.values(filters).filter(value => value !== '' && value !== 'all').length,
    [filters]
  );

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
      <div className="shrink-0">
        <QuotationStats
          statusFilter={statusFilter}
          onFilter={value => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
          role={user?.role}
        />
      </div>

      <AdminContentCard className="min-h-0">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-500 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[280px] flex-1 xl:max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={searchTerm}
                onChange={event => handleSearchChange(event.target.value)}
                placeholder="Tìm nhanh theo mã báo giá, công ty, email, điện thoại..."
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
            {FILTER_FIELDS.map(field => {
              const value = filters[field.id];

              if (!value || value === 'all') {
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

        <div className="relative overflow-auto flex-1 min-h-0 custom-scrollbar">
          <table className="w-full min-w-[1160px] text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b-2 border-slate-200 bg-slate-100/95 backdrop-blur-sm shadow-sm">
                <th className="px-6 py-4 text-left uppercase tracking-label">Số BG</th>
                <th className="px-6 py-4 text-left uppercase tracking-label">Khách hàng</th>
                <th className="px-6 py-4 text-left uppercase tracking-label">Ngày báo giá</th>
                <th className="px-6 py-4 text-center uppercase tracking-label">Số lượng SP</th>
                <th className="px-6 py-4 text-right uppercase tracking-label">Tổng tiền</th>
                <th className="px-6 py-4 text-center uppercase tracking-label">Trạng thái</th>
                <th className="px-6 py-4 text-center uppercase tracking-label">Ngày tạo</th>
                <th className="px-6 py-4 text-right uppercase tracking-label">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center font-medium italic text-slate-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center font-medium italic text-slate-400">
                    Không tìm thấy báo giá nào
                  </td>
                </tr>
              ) : (
                quotes.map(q => (
                  <tr
                    key={q.id}
                    className="group cursor-pointer odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100"
                    onClick={() => goTo(q.id, ActionType.DETAIL)}
                  >
                    <td className="px-6 py-4 font-bold tracking-tight text-gray-900">
                      {q.code}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{q.companyName}</div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {q.quoteDate
                        ? new Date(q.quoteDate).toLocaleDateString('vi-VN')
                        : '---'}
                    </td>

                    <td className="px-6 py-4 text-center">{q.itemCount}</td>

                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {q.grandTotal?.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="px-6 py-4 text-center">
                      {(() => {
                        const displayStatus =
                          q.responseType === QuoteResponseStatus.Declined
                            ? QuoteResponseStatus.Declined
                            : q.responseType === QuoteResponseStatus.Accepted
                              ? QuoteResponseStatus.Accepted
                              : q.status;

                        return (
                          <span
                            className={cn(
                              'rounded border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest',
                              statusStyles[displayStatus] ??
                                'bg-gray-100 text-gray-500 border-gray-200'
                            )}
                          >
                            {statusLabels[displayStatus]}
                          </span>
                        );
                      })()}
                    </td>

                    <td className="px-6 py-4 text-center text-xs text-slate-500">
                      {q.createdAt
                        ? new Date(q.createdAt).toLocaleDateString('vi-VN')
                        : '---'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            goTo(q.id, ActionType.DETAIL);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-yellow-600 hover:bg-yellow-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            goTo(q.id, ActionType.UPDATE);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {q.status === QuoteStatus.DRAFT ||
                        q.status === QuoteStatus.RETURNED ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleDelete(q.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : null}
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
      </AdminContentCard>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[min(1080px,calc(100vw-2rem))] max-w-none p-0 sm:max-w-none">
          <DialogHeader className="border-b border-slate-100 px-6 py-5">
            <DialogTitle>Bộ lọc báo giá</DialogTitle>

            <DialogDescription className="sr-only">
              Chọn các điều kiện để lọc danh sách báo giá.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6">
            <FilterPanel
              fields={FILTER_FIELDS}
              values={draftFilters}
              onChange={(fieldId, value) =>
                handleDraftFilterChange(fieldId as QuoteFilterKey, value)
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
              Xoá bộ lọc
            </Button>

            <Button className="admin-btn-primary" onClick={applyDraftFilters}>
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
