'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    UserCircle,
    UserCheck,
    UserMinus,
    Shield,
    Eye,
    Edit,
    Trash2,
    Search
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { StaffService, StaffListStats, StaffStatus, StaffListItem } from '../../services/staff.service';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatGroup } from '@/shared/components/admin/stat-card/stat-group';
import {
    AdminPageContainer,
    AdminContentCard,
    AdminHeaderBar
} from '@/shared/components/admin/layout';

const departmentColor: Record<string, string> = {
    'Giám đốc': 'bg-red-50 text-red-600 border border-red-100',
    'Kho vận': 'bg-blue-50 text-blue-600 border border-blue-100',
    'Kinh doanh': 'bg-green-50 text-green-600 border border-green-100',
    'Kế toán': 'bg-orange-50 text-orange-600 border border-orange-100',
    'Mua hàng': 'bg-indigo-50 text-indigo-600 border border-indigo-100'
};

const statusConfig: Record<StaffStatus, { label: string; className: string }> = {
    [StaffStatus.Active]: { label: 'Đang hoạt động', className: 'bg-green-50 text-green-600 border border-green-100' },
    [StaffStatus.OnLeave]: { label: 'Vắng mặt', className: 'bg-amber-50 text-amber-600 border border-amber-100' },
    [StaffStatus.Resigned]: { label: 'Đã nghỉ việc', className: 'bg-red-50 text-red-600 border border-red-100' }
};

export default function StaffList() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StaffStatus | undefined>(undefined);
    const [staffList, setStaffList] = useState<StaffListItem[]>([]);
    const [statsData, setStatsData] = useState<StaffListStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchStats = async () => {
        try {
            const stats = await StaffService.getStaffListStats();
            if (stats) {
                setStatsData(stats);
            }
        } catch (error) {
            console.error('>>> Lỗi khi fetch thống kê:', error);
        }
    };

    const fetchStaffs = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await StaffService.getPagedStaffs({
                pageNumber: currentPage,
                pageSize: pageSize,
                searchTerm: searchTerm,
                status: statusFilter
            });

            if (response) {
                setStaffList(response.items);
                setTotalCount(response.totalCount || 0);
            }
        } catch (error: any) {
            console.error('>>> Lỗi khi fetch nhân viên:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, statusFilter]);

    React.useEffect(() => {
        fetchStaffs();
        fetchStats();
    }, [fetchStaffs]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const statsItems = useMemo(() => [
        {
            label: 'Tổng nhân viên',
            value: statsData?.totalCount ?? 0,
            icon: UserCircle,
            colorTheme: 'blue' as any,
            isActive: statusFilter === undefined,
            onClick: () => {
                setStatusFilter(undefined);
                setCurrentPage(1);
            }
        }, {
            label: 'Đang làm việc',
            value: statsData?.activeCount ?? 0,
            icon: UserCheck,
            colorTheme: 'green' as any,
            isActive: statusFilter === StaffStatus.Active,
            onClick: () => {
                setStatusFilter(StaffStatus.Active);
                setCurrentPage(1);
            }
        }, {
            label: 'Vắng mặt',
            value: statsData?.onLeaveCount ?? 0,
            icon: UserMinus,
            colorTheme: 'yellow' as any,
            isActive: statusFilter === StaffStatus.OnLeave,
            onClick: () => {
                setStatusFilter(StaffStatus.OnLeave);
                setCurrentPage(1);
            }
        }, {
            label: 'Đã nghỉ việc',
            value: statsData?.resignedCount ?? 0,
            icon: Shield,
            colorTheme: 'red' as any,
            isActive: statusFilter === StaffStatus.Resigned,
            onClick: () => {
                setStatusFilter(StaffStatus.Resigned);
                setCurrentPage(1);
            }
        },
    ], [statsData, statusFilter]);

    return (
        <AdminPageContainer>
            <div className="shrink-0">
                <StatGroup items={statsItems} />
            </div>

            <AdminContentCard>
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

                <div className="relative overflow-x-auto flex-1 min-h-0 custom-scrollbar">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    )}
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
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
                                    <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
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
                                                    onClick={() => router.push(`/users/staff/${s.id}`)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
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
        </AdminPageContainer>
    );
}
