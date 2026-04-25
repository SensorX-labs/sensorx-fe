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
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { StaffService } from '../../services/staff-service';
import { StaffListItem } from '../../models/staff-list-response';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const stats = [
    {
        title: 'Tổng nhân viên',
        value: '48',
        icon: UserCircle,
        color: 'text-[#4318FF]'
    }, {
        title: 'Đang làm việc',
        value: '44',
        icon: UserCheck,
        color: 'text-green-500'
    }, {
        title: 'Nghỉ phép',
        value: '4',
        icon: UserMinus,
        color: 'text-yellow-500'
    }, {
        title: 'Vai trò',
        value: '6',
        icon: Shield,
        color: 'text-purple-500'
    },
];

const departmentColor: Record<string,
    string> = {
    'Giám đốc': 'bg-red-50 text-red-600 border border-red-100',
    'Kho vận': 'bg-blue-50 text-blue-600 border border-blue-100',
    'Kinh doanh': 'bg-green-50 text-green-600 border border-green-100',
    'Kế toán': 'bg-orange-50 text-orange-600 border border-orange-100',
    'Mua hàng': 'bg-indigo-50 text-indigo-600 border border-indigo-100'
};

export default function StaffList() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [staffList, setStaffList] = useState<StaffListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchStaffs = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await StaffService.getPagedStaffs({
                pageNumber: currentPage,
                pageSize: pageSize,
                searchTerm: searchTerm
            });

            if (response.isSuccess && response.value) {
                setStaffList(response.value.items);
                setTotalCount(response.value.totalCount || 0);
            } else {
                toast.warning(response.message);
            }
        } catch (error: any) {
            console.error('>>> Lỗi khi fetch nhân viên:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm]);

    React.useEffect(() => {
        fetchStaffs();
    }, [fetchStaffs]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <button className="admin-btn-primary flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    Tạo nhân viên
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((s) => (
                    <Card key={s.title} className="border-none shadow-sm bg-white rounded">
                        <CardContent className="p-2.5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-[#2B3674]">{s.value}</p>
                                <p className="text-xs font-semibold text-[#A3AED0]">{s.title}</p>
                            </div>
                            <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
                                <s.icon className={`w-4 h-4 ${s.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
                {/* Filter Section */}
                <div className="flex flex-col md:flex-row gap-4 items-center p-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm mã NV, họ tên, email, điện thoại..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center min-h-[200px]">
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
                                <th className="text-center px-6 py-4 tracking-label uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((s) => (
                                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">{s.id}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">{s.name}</td>
                                    <td className="px-6 py-4 text-gray-700">{s.email}</td>
                                    <td className="px-6 py-4 text-gray-700">{s.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${departmentColor[s.department] ?? 'bg-gray-50 text-gray-400'}`}>
                                            {s.department || '---'}
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
                            ))}
                            {!loading && staffList.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
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
                        <span className="text-sm">
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
            </div>
        </div>
    );
}
