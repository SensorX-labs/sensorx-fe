'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Edit,
  Eye,
  Filter,
  Loader2,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserCircle,
  UserMinus,
  X,
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';
import { FilterFieldConfig, FilterPanel } from '@/shared/components/admin/filter-panel';
import { StatGroup } from '@/shared/components/admin/stat-card';
import { AdminContentCard } from '@/shared/components/admin/layout';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import {
  StaffService,
  StaffListItem,
  StaffListStats,
  StaffStatus,
  StaffFilter,
} from '../../services/staff.service';

const DEFAULT_FILTERS = {
  code: '',
  name: '',
  email: '',
  phone: '',
  citizenId: '',
  department: 'all',
  joinFrom: '',
  joinTo: '',
  createdFrom: '',
  createdTo: '',
};

type StaffFilterState = typeof DEFAULT_FILTERS;
type StaffFilterKey = keyof StaffFilterState;

const departmentColor: Record<string, string> = {
  Director: 'bg-red-50 text-red-600 border border-red-100',
  Warehouse: 'bg-blue-50 text-blue-600 border border-blue-100',
  Sale: 'bg-green-50 text-green-600 border border-green-100',
  Accounting: 'bg-orange-50 text-orange-600 border border-orange-100',
  Purchasing: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
};

const departmentLabel: Record<string, string> = {
  Director: 'Giám đốc',
  Warehouse: 'Kho vận',
  Sale: 'Kinh doanh',
  Accounting: 'Kế toán',
  Purchasing: 'Mua hàng',
};

const statusConfig: Record<StaffStatus, { label: string; className: string }> = {
  [StaffStatus.Active]: {
    label: 'Đang hoạt động',
    className: 'bg-green-50 text-green-600 border border-green-100',
  },
  [StaffStatus.OnLeave]: {
    label: 'Vắng mặt',
    className: 'bg-amber-50 text-amber-600 border border-amber-100',
  },
  [StaffStatus.Resigned]: {
    label: 'Đã nghỉ việc',
    className: 'bg-red-50 text-red-600 border border-red-100',
  },
};

const FILTER_FIELDS: Array<FilterFieldConfig & { id: StaffFilterKey }> = [
  { id: 'code', label: 'Mã nhân viên', type: 'search', placeholder: 'Nhập mã nhân viên' },
  { id: 'name', label: 'Họ tên', type: 'search', placeholder: 'Nhập họ tên' },
  { id: 'email', label: 'Email', type: 'search', placeholder: 'Nhập email' },
  { id: 'phone', label: 'Điện thoại', type: 'search', placeholder: 'Nhập số điện thoại' },
  { id: 'citizenId', label: 'CCCD', type: 'search', placeholder: 'Nhập CCCD' },
  {
    id: 'department',
    label: 'Phòng ban',
    type: 'select',
    options: [
      { label: 'Tất cả phòng ban', value: 'all' },
      { label: 'Giám đốc', value: 'Director' },
      { label: 'Kho vận', value: 'Warehouse' },
      { label: 'Kinh doanh', value: 'Sale' },
      { label: 'Kế toán', value: 'Accounting' },
      { label: 'Mua hàng', value: 'Purchasing' },
    ],
  },
  { id: 'joinFrom', label: 'Vào làm từ', type: 'date' },
  { id: 'joinTo', label: 'Vào làm đến', type: 'date' },
  { id: 'createdFrom', label: 'Tạo từ', type: 'date' },
  { id: 'createdTo', label: 'Tạo đến', type: 'date' },
];

function buildQuery(
  currentPage: number,
  pageSize: number,
  searchTerm: string,
  statusFilter: StaffStatus | undefined,
  filters: StaffFilterState
): StaffFilter {
  return {
    pageNumber: currentPage,
    pageSize,
    searchTerm: searchTerm.trim() || undefined,
    status: statusFilter,
    code: filters.code.trim() || undefined,
    name: filters.name.trim() || undefined,
    email: filters.email.trim() || undefined,
    phone: filters.phone.trim() || undefined,
    citizenId: filters.citizenId.trim() || undefined,
    department: filters.department !== 'all' ? filters.department : undefined,
    joinFrom: filters.joinFrom || undefined,
    joinTo: filters.joinTo || undefined,
    createdFrom: filters.createdFrom || undefined,
    createdTo: filters.createdTo || undefined,
  };
}

function StaffStats({
  statsData,
  statusFilter,
  onFilter,
}: {
  statsData: StaffListStats | null;
  statusFilter: StaffStatus | undefined;
  onFilter: (status: StaffStatus | undefined) => void;
}) {
  const items = useMemo(
    () => [
      {
        key: 'all',
        label: 'Tổng nhân viên',
        value: statsData?.totalCount ?? 0,
        icon: UserCircle,
        colorTheme: 'dark' as const,
        isActive: statusFilter === undefined,
        onClick: () => onFilter(undefined),
      },
      {
        key: 'active',
        label: 'Đang làm việc',
        value: statsData?.activeCount ?? 0,
        icon: UserCheck,
        colorTheme: 'green' as const,
        isActive: statusFilter === StaffStatus.Active,
        onClick: () => onFilter(StaffStatus.Active),
      },
      {
        key: 'leave',
        label: 'Vắng mặt',
        value: statsData?.onLeaveCount ?? 0,
        icon: UserMinus,
        colorTheme: 'yellow' as const,
        isActive: statusFilter === StaffStatus.OnLeave,
        onClick: () => onFilter(StaffStatus.OnLeave),
      },
      {
        key: 'resigned',
        label: 'Đã nghỉ việc',
        value: statsData?.resignedCount ?? 0,
        icon: Shield,
        colorTheme: 'red' as const,
        isActive: statusFilter === StaffStatus.Resigned,
        onClick: () => onFilter(StaffStatus.Resigned),
      },
    ],
    [statsData, statusFilter, onFilter]
  );

  return <StatGroup items={items} variant="pill" />;
}

function StaffTable({
  staffList,
  loading,
}: {
  staffList: StaffListItem[];
  loading: boolean;
}) {
  const router = useRouter();

  return (
    <div className="relative overflow-x-auto">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Mã NV</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Họ tên</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Email</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Điện thoại</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Phòng ban</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Trạng thái</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {staffList.map((s) => {
            const status = statusConfig[s.status] ?? {
              label: 'Không xác định',
              className: 'bg-gray-50 text-gray-400 border border-gray-100',
            };
            return (
              <tr
                key={s.id}
                className="cursor-pointer odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100"
                onClick={() => router.push(`/users/staff/${s.id}`)}
              >
                <td className="px-6 py-4 font-bold text-gray-900">{s.code}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{s.name}</td>
                <td className="px-6 py-4 text-gray-700">{s.email}</td>
                <td className="px-6 py-4 text-gray-700">{s.phone || '---'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${departmentColor[s.department] ?? 'bg-gray-50 text-gray-400'}`}>
                    {departmentLabel[s.department] ?? s.department ?? '---'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/users/staff/${s.id}`);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
          {!loading && staffList.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-20 text-center text-gray-500">
                Không có nhân viên nào được tìm thấy.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function StaffList() {
  const [staffList, setStaffList] = useState<StaffListItem[]>([]);
  const [statsData, setStatsData] = useState<StaffListStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StaffFilterState>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<StaffFilterState>(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StaffStatus | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const activeFilterChips = useMemo(
    () =>
      FILTER_FIELDS.map((field) => {
        const value = filters[field.id];
        if (!value || value === 'all') return null;
        if (field.type === 'select') {
          const option = field.options?.find((o) => o.value === value);
          return { id: field.id, label: `${field.label}: ${option?.label ?? value}` };
        }
        if (field.type === 'date') {
          return {
            id: field.id,
            label: `${field.label}: ${new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN')}`,
          };
        }
        return { id: field.id, label: `${field.label}: ${value}` };
      }).filter(Boolean) as Array<{ id: StaffFilterKey; label: string }>,
    [filters]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const query = buildQuery(currentPage, pageSize, searchTerm, statusFilter, filters);
        const result = await StaffService.getPagedStaffs(query);
        setStaffList(result.items ?? []);
        setTotalItems(result.totalCount ?? 0);
      } catch (error) {
        console.error('Failed to load staff list', error);
        setStaffList([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [currentPage, searchTerm, filters, statusFilter]);

  useEffect(() => {
    StaffService.getStaffListStats()
      .then(setStatsData)
      .catch((error) => console.error('Failed to load staff stats', error));
  }, []);

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const handleRemoveFilter = (fieldId: StaffFilterKey) => {
    const reset = fieldId === 'department' ? 'all' : '';
    setFilters((prev) => ({ ...prev, [fieldId]: reset }));
    setDraftFilters((prev) => ({ ...prev, [fieldId]: reset }));
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <StaffStats
        statsData={statsData}
        statusFilter={statusFilter}
        onFilter={(status) => {
          setStatusFilter(status);
          setCurrentPage(1);
        }}
      />

      <AdminContentCard className="overflow-hidden">
        <div className="space-y-4 border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm mã NV, họ tên, email, điện thoại..."
                className="h-11 rounded-md border-slate-200 bg-white pl-10"
              />
            </div>

            <div className="flex items-center gap-3 xl:shrink-0">
              <Button
                type="button"
                variant="outline"
                className="h-11 min-w-[140px] justify-center rounded-md border-slate-200 bg-white px-4"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Bộ lọc
                {activeFilterChips.length > 0 && (
                  <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {activeFilterChips.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  {chip.label}
                  <button
                    type="button"
                    onClick={() => handleRemoveFilter(chip.id)}
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-blue-200"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <StaffTable staffList={staffList} loading={loading} />

        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </AdminContentCard>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[min(960px,calc(100vw-2rem))] max-w-none sm:max-w-none">
          <DialogHeader>
            <DialogTitle>Bộ lọc nhân viên</DialogTitle>
            <DialogDescription className="sr-only">
              Bộ lọc danh sách nhân viên theo các tiêu chí.
            </DialogDescription>
          </DialogHeader>

          <FilterPanel
            title="Bộ lọc"
            fields={FILTER_FIELDS}
            values={draftFilters}
            onChange={(fieldId, value) =>
              setDraftFilters((prev) => ({ ...prev, [fieldId as StaffFilterKey]: value }))
            }
            onReset={handleResetFilters}
            hideHeader
            gridClassName="md:grid-cols-2 xl:grid-cols-3"
            className="border-0 bg-transparent p-0 shadow-none"
          />

          <DialogFooter className="gap-2 border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsFilterOpen(false)}>
              Đóng
            </Button>
            <Button type="button" variant="outline" onClick={handleResetFilters}>
              Xóa bộ lọc
            </Button>
            <Button
              type="button"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleApplyFilters}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
