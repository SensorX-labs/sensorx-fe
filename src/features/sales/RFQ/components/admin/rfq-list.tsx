'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Check, X, UserCheck, Search, UserPlus, Filter } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { cn } from '@/shared/utils/cn';
import { toast } from 'sonner';
import { useDebounce } from '../../../../../shared/hooks/use-debounce';
import { RfqStatus, statusLabels, statusStyles } from '../../constants/rfq-status';
import { useRouter } from 'next/navigation';
import { AdminRFQService, RfqFilter, RfqListItem } from '../../services/admin-rfq.service';
import { CanAccess } from '@/shared/components/common/can-access';
import { RfqStatsSection } from './rfq-stats';
import { RfqDeclineDialog } from './rfq-decline-dialog';
import { SaleStaffSelectionDialog } from '@/shared/components/admin/selection-modal';
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

const DEFAULT_FILTERS = {
  code: '',
  companyName: '',
  recipientName: '',
  recipientPhone: '',
  staffName: '',
  createdFrom: '',
  createdTo: '',
};

type RfqFilterState = typeof DEFAULT_FILTERS;
type RfqFilterKey = keyof RfqFilterState;

const FILTER_FIELDS: Array<FilterFieldConfig & { id: RfqFilterKey }> = [
  { id: 'code', label: 'Mã RFQ', type: 'search', placeholder: 'Nhập mã RFQ' },
  { id: 'companyName', label: 'Công ty', type: 'search', placeholder: 'Nhập tên công ty' },
  {
    id: 'recipientName',
    label: 'Người liên hệ',
    type: 'search',
    placeholder: 'Nhập tên người liên hệ',
  },
  {
    id: 'recipientPhone',
    label: 'Số điện thoại',
    type: 'search',
    placeholder: 'Nhập số điện thoại',
  },
  {
    id: 'staffName',
    label: 'Người xử lý',
    type: 'search',
    placeholder: 'Nhập tên nhân viên',
  },
  { id: 'createdFrom', label: 'Từ ngày', type: 'date' },
  { id: 'createdTo', label: 'Đến ngày', type: 'date' },
];

const getStatusStyle = (status: string) => {
  const key = Object.values(RfqStatus).find(s => s.toLowerCase() === status?.toLowerCase());
  return key ? statusStyles[key] : 'bg-gray-50 text-gray-400 border-gray-100';
};

const getStatusLabel = (status: string) => {
  const key = Object.values(RfqStatus).find(s => s.toLowerCase() === status?.toLowerCase());
  return key ? statusLabels[key] : status;
};

function buildRfqQuery(
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  statusFilter: string,
  filters: RfqFilterState
): RfqFilter {
  return {
    pageNumber,
    pageSize,
    searchTerm: searchTerm.trim() || undefined,
    status: statusFilter === 'all' ? undefined : (statusFilter as RfqStatus),
    code: filters.code.trim() || undefined,
    companyName: filters.companyName.trim() || undefined,
    recipientName: filters.recipientName.trim() || undefined,
    recipientPhone: filters.recipientPhone.trim() || undefined,
    staffName: filters.staffName.trim() || undefined,
    createdFrom: filters.createdFrom || undefined,
    createdTo: filters.createdTo || undefined,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function RequestForQuotationList() {
  const [leads, setLeads] = useState<RfqListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const router = useRouter();

  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningRfqId, setAssigningRfqId] = useState<string | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const listResponse = await AdminRFQService.getListRFQ(
          buildRfqQuery(currentPage, pageSize, debouncedSearch, statusFilter, filters)
        );

        if (listResponse) {
          setLeads(listResponse.items);
          setTotalItems(listResponse.totalCount ?? 0);
        }
      } catch (error: unknown) {
        console.error('>>> Lỗi khi tải danh sách RFQ:', error);
        toast.error('Không thể tải danh sách RFQ');
        setLeads([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [currentPage, pageSize, debouncedSearch, statusFilter, filters, refreshKey]);

  const handleAccept = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    try {
      await AdminRFQService.acceptRFQ(id);
      toast.success('Đã tiếp nhận yêu cầu thành công');
      setRefreshKey(prev => prev + 1);
      setCurrentPage(1);
    } catch (error: unknown) {
      console.error('>>> Lỗi khi tiếp nhận RFQ:', error);
      toast.error('Đã xảy ra lỗi khi tiếp nhận yêu cầu');
    }
  };

  const handleDecline = async () => {
    if (!selectedRfqId) return;

    try {
      await AdminRFQService.rejectRFQ(selectedRfqId, declineReason);
      setIsDeclineDialogOpen(false);
      setSelectedRfqId(null);
      setDeclineReason('');
      setRefreshKey(prev => prev + 1);
      toast.success('Đã từ chối yêu cầu');
    } catch (error: unknown) {
      console.error('>>> Lỗi khi từ chối RFQ:', error);
      toast.error(getErrorMessage(error, 'Không thể từ chối yêu cầu'));
    }
  };

  const handleAssignStaff = async (rfqId: string, staffId: string) => {
    if (!rfqId || !staffId) {
      toast.error('Vui lòng chọn nhân viên');
      return;
    }

    setAssignLoading(true);

    try {
      await AdminRFQService.assignStaff(rfqId, staffId);
      toast.success('Đã chỉ định nhân viên thành công');
      setRefreshKey(prev => prev + 1);
    } catch (error: unknown) {
      console.error('>>> Lỗi khi chỉ định nhân viên:', error);
      toast.error(getErrorMessage(error, 'Đã xảy ra lỗi khi chỉ định nhân viên'));
    } finally {
      setAssignLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleDraftFilterChange = (fieldId: RfqFilterKey, value: string) => {
    setDraftFilters(current => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const handleRemoveFilter = (fieldId: RfqFilterKey) => {
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
    () => Object.values(filters).filter(value => value !== '' && value !== 'all').length,
    [filters]
  );

  const totalPages = Math.ceil(totalItems / pageSize);

  const openDeclineDialog = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedRfqId(id);
    setIsDeclineDialogOpen(true);
  };

  const openAssignDialog = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAssigningRfqId(id);
    setIsAssignDialogOpen(true);
  };

  return (
    <>
      <div className="shrink-0">
        <RfqStatsSection
          refreshKey={refreshKey}
          statusFilter={statusFilter}
          setStatusFilter={value => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        />
      </div>

      <AdminContentCard className="min-h-0">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-500 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[280px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={searchQuery}
                onChange={event => handleSearchChange(event.target.value)}
                placeholder="Tìm nhanh theo mã RFQ, công ty, người liên hệ..."
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

        <div className="relative overflow-auto flex-1 min-h-0 custom-scrollbar">
          <table className="w-full min-w-[1180px] text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b-2 border-slate-200 bg-slate-100/95 backdrop-blur-sm shadow-sm">
                <th className="px-6 py-4 text-left uppercase tracking-label">Mã RFQ</th>
                <th className="px-6 py-4 text-left uppercase tracking-label">Khách hàng</th>
                <th className="px-6 py-4 text-left uppercase tracking-label">Người xử lý</th>
                <th className="px-6 py-4 text-center uppercase tracking-label">Trạng thái</th>
                <th className="px-6 py-4 text-center uppercase tracking-label">
                  Ngày yêu cầu
                </th>
                <th className="px-6 py-4 text-center uppercase tracking-label">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center font-medium italic text-slate-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center font-medium italic text-slate-400">
                    Không tìm thấy yêu cầu nào
                  </td>
                </tr>
              ) : (
                leads.map(item => (
                  <tr
                    key={item.id}
                    className="group cursor-pointer odd:bg-white even:bg-slate-100 transition-colors hover:bg-blue-50"
                    onClick={() => router.push(`/sales/RFQ/${item.id}`)}
                  >
                    <td className="px-6 py-4 font-bold tracking-tight text-gray-900">
                      {item.code}
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-semibold leading-tight text-gray-800">
                          {item.companyName}
                        </div>

                        <div className="text-xs text-gray-500">
                          {item.recipientName || '--'}
                          {item.recipientPhone ? ` • ${item.recipientPhone}` : ''}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-left text-xs text-gray-500">
                      {item.staffId ? (
                        <span className="flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5" />
                          {item.staffName || `Nhân viên ${item.staffId.slice(0, 4)}`}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          'rounded border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest',
                          getStatusStyle(item.status)
                        )}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center text-xs text-slate-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        : '—'}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {(!item.status ||
                          item.status.toLowerCase() === 'pending' ||
                          item.status.toLowerCase() ===
                          RfqStatus.REJECTED.toLowerCase()) && (
                            <>
                              <CanAccess roles={['Manager']}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 cursor-pointer border border-indigo-100 bg-indigo-50/50 px-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
                                  onClick={e => openAssignDialog(item.id, e)}
                                  disabled={assignLoading}
                                >
                                  <UserPlus className="mr-1.5 h-3.5 w-3.5 opacity-70" />
                                </Button>
                              </CanAccess>

                              <CanAccess roles={['SaleStaff']}>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Tiếp nhận"
                                    className="h-8 w-8 border border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                                    onClick={e => handleAccept(item.id, e)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Từ chối"
                                    className="h-8 w-8 border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
                                    onClick={e => openDeclineDialog(item.id, e)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CanAccess>
                            </>
                          )}

                        {item.status?.toLowerCase() ===
                          RfqStatus.ACCEPTED.toLowerCase() && (
                            <CanAccess roles={['Manager', 'SaleStaff']}>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Xem chi tiết"
                                className="h-8 w-8 border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                onClick={e => {
                                  e.stopPropagation();
                                  router.push(`/sales/RFQ/${item.id}`);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </CanAccess>
                          )}
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

      <RfqDeclineDialog
        isOpen={isDeclineDialogOpen}
        onOpenChange={setIsDeclineDialogOpen}
        declineReason={declineReason}
        setDeclineReason={setDeclineReason}
        onConfirm={handleDecline}
      />

      <SaleStaffSelectionDialog
        isOpen={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onSelect={staff => {
          if (assigningRfqId) {
            void handleAssignStaff(assigningRfqId, staff.id);
            setIsAssignDialogOpen(false);
          }
        }}
      />

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[min(1080px,calc(100vw-2rem))] max-w-none p-0 sm:max-w-none">
          <DialogHeader className="border-b border-slate-100 px-6 py-5">
            <DialogTitle>Bộ lọc yêu cầu báo giá</DialogTitle>

            <DialogDescription className="sr-only">
              Chọn các điều kiện để lọc danh sách yêu cầu báo giá.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6">
            <FilterPanel
              fields={FILTER_FIELDS}
              values={draftFilters}
              onChange={(fieldId, value) =>
                handleDraftFilterChange(fieldId as RfqFilterKey, value)
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
    </ >
  );
}
