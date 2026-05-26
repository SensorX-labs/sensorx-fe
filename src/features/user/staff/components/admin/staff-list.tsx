'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Edit,
  Eye,
  Filter,
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
import {
  AdminPageContainer,
  AdminContentCard,
} from '@/shared/components/admin/layout';
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
  {
    id: 'code',
    label: 'Mã nhân viên',
    type: 'search',
    placeholder: 'Nhập mã nhân viên',
  },
  {
    id: 'name',
    label: 'Họ tên',
    type: 'search',
    placeholder: 'Nhập họ tên',
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
    id: 'citizenId',
    label: 'CCCD',
    type: 'search',
    placeholder: 'Nhập CCCD',
  },
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
  {
    id: 'joinFrom',
    label: 'Vào làm từ',
    type: 'date',
  },
  {
    id: 'joinTo',
    label: 'Vào làm đến',
    type: 'date',
  },
  {
    id: 'createdFrom',
    label: 'Tạo từ',
    type: 'date',
  },
  {
    id: 'createdTo',
    label: 'Tạo đến',
    type: 'date',
  },
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
      <table className="w-full min-w-[1180px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Nhân viên
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Email
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Điện thoại
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Phòng ban
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Tạo lúc
            </th>
            <th className="px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : staffList.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                Không tìm thấy nhân viên nào
              </td>
            </tr>
          ) : (
            staffList.map(staff => {
              const status = statusConfig[staff.status];
              const departmentText = departmentLabel[staff.department] ?? staff.department ?? '---';
              const departmentClassName =
                departmentColor[staff.department] ?? 'bg-slate-50 text-slate-500 border border-slate-100';

              return (
                <tr key={staff.id} className="hover:bg-emerald-50/30">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900">{staff.name}</div>
                      <div className="text-xs font-medium text-slate-500">{staff.code}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">{staff.email}</td>

                  <td className="px-6 py-4 text-slate-500">{staff.phone || 'Chưa cập nhật'}</td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${departmentClassName}`}>
                      {departmentText}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {new Date(staff.createdAt).toLocaleDateString('vi-VN')}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => router.push(`/users/staff/${staff.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-orange-500 hover:bg-orange-50 hover:text-orange-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function StaffList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StaffStatus | undefined>(undefined);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [staffList, setStaffList] = useState<StaffListItem[]>([]);
  const [statsData, setStatsData] = useState<StaffListStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    StaffService.getStaffListStats()
      .then(setStatsData)
      .catch(error => console.error('Failed to load staff stats', error));
  }, []);

  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);

      try {
        const response = await StaffService.getPagedStaffs(
          buildQuery(currentPage, pageSize, searchTerm, statusFilter, filters)
        );

        setStaffList(response.items ?? []);
        setTotalCount(response.totalCount ?? 0);
      } catch (error) {
        console.error('Failed to load staffs', error);
        setStaffList([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    void fetchStaffs();
  }, [currentPage, searchTerm, statusFilter, filters]);

  const activeFilterChips = useMemo(
    () =>
      FILTER_FIELDS.map(field => {
        const value = filters[field.id];
        if (!value || value === 'all') {
          return null;
        }

        if (field.type === 'select') {
          const option = field.options.find(item => item.value === value);
          return { id: field.id, label: `${field.label}: ${option?.label ?? value}` };
        }

        if (field.type === 'date') {
          return {
            id: field.id,
            label: `${field.label}: ${new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN')}`,
          };
        }

        return {
          id: field.id,
          label: `${field.label}: ${value}`,
        };
      }).filter(Boolean) as Array<{ id: StaffFilterKey; label: string }>,
    [filters]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDraftFilterChange = (fieldId: StaffFilterKey, value: string) => {
    setDraftFilters(current => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const handleRemoveFilter = (fieldId: StaffFilterKey) => {
    setFilters(current => ({
      ...current,
      [fieldId]: fieldId === 'department' ? 'all' : '',
    }));
    setDraftFilters(current => ({
      ...current,
      [fieldId]: fieldId === 'department' ? 'all' : '',
    }));
    setCurrentPage(1);
  };

  const applyDraftFilters = () => {
    setFilters(draftFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleResetDraftFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  return (
    <AdminPageContainer>
      <StaffStats
        statsData={statsData}
        statusFilter={statusFilter}
        onFilter={status => {
          setStatusFilter(status);
          setCurrentPage(1);
        }}
      />

      <AdminContentCard className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-500 xl:flex-row xl:items-center">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[280px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={event => handleSearchChange(event.target.value)}
                placeholder="Tìm nhanh theo mã nhân viên, họ tên, email hoặc điện thoại..."
                className="h-11 rounded-md border-slate-200 bg-white pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 xl:shrink-0">
            <Button
              variant="outline"
              className="h-11 min-w-[140px] justify-center rounded-md border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Bộ lọc
            </Button>

            <Button className="h-11 min-w-[140px] rounded-md bg-emerald-600 px-4 text-white hover:bg-emerald-700">
              <UserCircle className="mr-2 h-4 w-4" />
              Tạo nhân viên
            </Button>
          </div>
        </div>

        {activeFilterChips.length > 0 ? (
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-6 py-4">
            {activeFilterChips.map(chip => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleRemoveFilter(chip.id)}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <span>{chip.label}</span>
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        ) : null}

        <StaffTable staffList={staffList} loading={loading} />

        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </AdminContentCard>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[min(1040px,calc(100vw-2rem))] max-w-none sm:max-w-none">
          <DialogHeader>
            <DialogTitle>Bộ lọc nhân viên</DialogTitle>
            <DialogDescription className="sr-only">
              Bộ lọc danh sách nhân viên theo từng trường dữ liệu và thời gian.
            </DialogDescription>
          </DialogHeader>

          <FilterPanel
            title="Bộ lọc"
            fields={FILTER_FIELDS}
            values={draftFilters}
            onChange={(fieldId, value) =>
              handleDraftFilterChange(fieldId as StaffFilterKey, value)
            }
            onReset={handleResetDraftFilters}
            hideHeader
            gridClassName="md:grid-cols-2 xl:grid-cols-3"
            className="border-0 bg-transparent p-0 shadow-none"
          />

          <DialogFooter className="gap-2 border-t border-slate-200 pt-4">
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
