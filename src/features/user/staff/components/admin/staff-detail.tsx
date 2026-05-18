'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, Phone, Mail, FileText, Calendar, Building2,
    Loader2, ArrowLeft, ShieldAlert, BadgeCheck,
    Briefcase, Fingerprint, History, LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { toast } from 'sonner';
import StaffService, { StaffListItem, StaffStatus } from '../../services/staff.service';
import { AdminPageContainer } from '@/shared/components/admin/layout';

interface StaffDetailProps {
    id: string;
}

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
    [StaffStatus.Active]: { label: 'Đang hoạt động', className: 'bg-green-50 text-green-600 border-green-100', icon: BadgeCheck },
    [StaffStatus.OnLeave]: { label: 'Vắng mặt', className: 'bg-amber-50 text-amber-600 border-amber-100', icon: ShieldAlert },
    [StaffStatus.Resigned]: { label: 'Đã nghỉ việc', className: 'bg-red-50 text-red-600 border-red-100', icon: Fingerprint }
};

export default function StaffDetail({ id }: StaffDetailProps) {
    const router = useRouter();
    const [staff, setStaff] = useState<StaffListItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchStaff = async () => {
        try {
            const data = await StaffService.getStaffById(id);
            if (data) {
                setStaff(data);
            }
        } catch (error) {
            console.error('>>> Lỗi khi fetch thông tin nhân viên:', error);
            toast.error('Không thể tải thông tin nhân viên.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [id]);

    const handleStatusChange = async (newStatus: StaffStatus) => {
        if (!staff) return;
        setUpdatingStatus(true);
        try {
            await StaffService.changeStaffStatus(staff.id, newStatus);
            toast.success('Cập nhật trạng thái nhân viên thành công!');
            await fetchStaff();
        } catch (error) {
            console.error('>>> Lỗi cập nhật trạng thái:', error);
            toast.error('Cập nhật trạng thái thất bại.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <span className="text-gray-500 font-medium tracking-wide">Đang tải hồ sơ nhân sự...</span>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="p-4 bg-red-50 rounded-full">
                    <ShieldAlert className="w-12 h-12 text-red-500" />
                </div>
                <span className="text-slate-900 font-black text-xl uppercase tracking-tighter">Không tìm thấy nhân viên!</span>
                <Button variant="outline" onClick={() => router.push('/users/staff')} className="flex items-center gap-2 rounded-xl">
                    <ArrowLeft size={16} /> Quay lại danh sách
                </Button>
            </div>
        );
    }

    const status = statusConfig[staff.status] || { label: 'Không xác định', className: 'bg-slate-50 text-slate-400 border-slate-100', icon: User };
    const StatusIcon = status.icon;

    return (
        <AdminPageContainer>
            <div className="w-full max-w-7xl mx-auto space-y-8">
                {/* Top Navigation & Quick Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/users/staff')}
                            className="h-10 w-10 p-0 rounded-xl bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-blue-500" />
                                Chi Tiết Nhân Sự
                            </h1>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Staff Management System</p>
                        </div>
                    </div>

                    {/* Status Changer Actions */}
                    <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1 w-fit">
                        <Button
                            size="sm"
                            disabled={updatingStatus}
                            onClick={() => handleStatusChange(StaffStatus.Active)}
                            className={`h-9 text-[10px] font-black uppercase tracking-widest px-4 rounded-xl transition-all ${staff.status === StaffStatus.Active
                                ? "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200"
                                : "bg-transparent text-slate-400 hover:text-green-600 hover:bg-green-50"
                                }`}
                        >
                            Hoạt động
                        </Button>
                        <Button
                            size="sm"
                            disabled={updatingStatus}
                            onClick={() => handleStatusChange(StaffStatus.OnLeave)}
                            className={`h-9 text-[10px] font-black uppercase tracking-widest px-4 rounded-xl transition-all ${staff.status === StaffStatus.OnLeave
                                ? "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-200"
                                : "bg-transparent text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                }`}
                        >
                            Vắng mặt
                        </Button>
                        <Button
                            size="sm"
                            disabled={updatingStatus}
                            onClick={() => handleStatusChange(StaffStatus.Resigned)}
                            className={`h-9 text-[10px] font-black uppercase tracking-widest px-4 rounded-xl transition-all ${staff.status === StaffStatus.Resigned
                                ? "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200"
                                : "bg-transparent text-slate-400 hover:text-red-600 hover:bg-red-50"
                                }`}
                        >
                            Nghỉ việc
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Essential Info Widget */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 relative">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]" />
                            </div>
                            <CardContent className="pt-0 pb-8 text-center relative px-8">
                                <div className="w-28 h-28 rounded-3xl bg-white p-1 shadow-2xl mx-auto -mt-14 flex items-center justify-center overflow-hidden border border-slate-50">
                                    <div className="w-full h-full rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                        <span className="text-3xl font-black tracking-tighter text-blue-600 uppercase">
                                            {(staff.name || '').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2) || 'NV'}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-1">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{staff.name}</h2>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {staff.code}
                                        </span>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${status.className}`}>
                                            <StatusIcon size={12} />
                                            {status.label}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-6 text-left">
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] flex items-center gap-2">
                                            <Briefcase size={12} />
                                            Bộ phận
                                        </span>
                                        <p className="text-sm font-bold text-slate-800">{staff.department || '---'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] flex items-center gap-2">
                                            <Calendar size={12} />
                                            Ngày tham gia
                                        </span>
                                        <p className="text-sm font-bold text-slate-800">
                                            {staff.joinDate ? new Date(staff.joinDate).toLocaleDateString('vi-VN') : '---'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Contact Widget */}
                        <Card className="border-none shadow-sm bg-white rounded-2xl p-6">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Liên hệ nhanh</h3>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Công việc</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{staff.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <Phone size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</p>
                                        <p className="text-sm font-bold text-slate-700">{staff.phone || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Detailed Data Tabs/Cards */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Personal Identity Card */}
                        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
                                <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                    <Fingerprint className="w-5 h-5 text-indigo-500" />
                                    Thông Tin Định Danh
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <User size={12} className="text-slate-400" />
                                            Họ và tên
                                        </label>
                                        <div className="px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-800">
                                            {staff.name}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <FileText size={12} className="text-slate-400" />
                                            Số CCCD / CMND
                                        </label>
                                        <div className="px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-800">
                                            {staff.citizenId || '---'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Briefcase size={12} className="text-slate-400" />
                                        Tiểu sử / Giới thiệu chuyên môn
                                    </label>
                                    <div className="px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm text-slate-700 font-medium leading-relaxed min-h-[120px] whitespace-pre-line italic">
                                        "{staff.biography || 'Nhân viên này chưa cập nhật tiểu sử giới thiệu bản thân.'}"
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity Placeholder Widget */}
                        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden opacity-80">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
                                <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                    <History className="w-5 h-5 text-slate-400" />
                                    Nhật Ký & Phân Quyền
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-full">
                                        <Loader2 className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Dữ liệu đang được đồng bộ</p>
                                        <p className="text-[11px] text-slate-300 font-medium italic">Tính năng quản lý nhật ký thao tác và bảng phân quyền chi tiết đang được cập nhật...</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminPageContainer>
    );
}
