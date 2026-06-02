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
    AdminContentCard,
    AdminHeaderBar
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
        <>
            <div className="shrink-0 mb-4">
                <StatGroup items={statsItems} />
            </div>

            <AdminContentCard className="min-h-0">
                <AdminHeaderBar>
                    {/* Search Input (Left) */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm mã NV, họ tên, email, điện thoại..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 shadow-sm rounded text-sm text-slate-700 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    {/* Action Buttons (Right) */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button className="h-10 admin-btn-primary gap-2 shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest text-[10px]">
                            <UserCircle className="w-4 h-4" />
                            Tạo nhân viên
                        </Button>
                    </div>
                </AdminHeaderBar>

                <div className="relative overflow-auto flex-1 min-h-0 custom-scrollbar">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    )}
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="sticky top-0 z-10 border-b-2 border-slate-200 bg-slate-100/95 backdrop-blur-sm shadow-sm">
                                <th className="text-left px-6 py-4 tracking-label uppercase">Mã NV</th>
                                <th className="text-left px-6 py-4 tracking-label uppercase">Họ tên</th>
                                <th className="text-left px-6 py-4 tracking-label uppercase">Email</th>
                                <th className="text-left px-6 py-4 tracking-label uppercase">Điện thoại</th>
                                <th className="text-left px-6 py-4 tracking-label uppercase">Phòng ban</th>
                                <th className="text-left px-6 py-4 tracking-label uppercase">Trạng thái</th>
                                <th className="text-center px-6 py-4 tracking-label uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((s) => {
                                const status = statusConfig[s.status] || { label: 'Không xác định', className: 'bg-gray-50 text-gray-400 border border-gray-100' };
                                return (
                                    <tr
                                        key={s.id}
                                        className="group cursor-pointer odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100"
                                        onClick={() => router.push(`/users/staff/${s.id}`)}
                                    >
                                        <td className="px-6 py-4 font-bold text-gray-900">{s.code}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{s.name}</td>
                                        <td className="px-6 py-4 text-gray-700">{s.email}</td>
                                        <td className="px-6 py-4 text-gray-700">{s.phone || '---'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${departmentColor[s.department] ?? 'bg-gray-50 text-gray-400'}`}>
                                                {s.department || '---'}
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

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
                        <span className="text-sm text-slate-500 font-medium">
                            Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} nhân viên
                        </span>
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0 rounded"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {Array.from({ length: totalPages }).map((_, idx) => {
                                const pageNum = idx + 1;
                                const isActive = currentPage === pageNum;
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={isActive ? "default" : "outline"}
                                        size="sm"
                                        className={`h-8 w-8 p-0 rounded ${isActive ? "bg-[var(--admin-primary)] text-white" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                                        onClick={() => goToPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 p-0 rounded"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </AdminContentCard>
        </>
    );
}
