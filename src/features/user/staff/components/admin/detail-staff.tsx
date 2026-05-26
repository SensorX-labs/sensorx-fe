'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Phone, Briefcase, ArrowLeft, Loader2, CreditCard, Calendar, FileText } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import Link from 'next/link';
import StaffService, { ProfileStaff, StaffStatus } from '../../services/staff.service';

const formatDate = (dateString?: string) => {
    if (!dateString) return '---';
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(dateString));
};

const renderStatusBadge = (status?: StaffStatus) => {
    switch (status) {
        case StaffStatus.Active:
            return <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold rounded-full">Đang làm việc</span>;
        case StaffStatus.Resigned:
            return <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-full">Đã nghỉ việc</span>;
        case StaffStatus.OnLeave:
            return <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold rounded-full">Vắng mặt</span>;
        default:
            return <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-500 text-xs font-bold rounded-full">Chưa xác định</span>;
    }
};

interface DetailStaffProps {
  id?: string;
}

export function DetailStaff({ id }: DetailStaffProps) {
  const [staff, setStaff] = useState<ProfileStaff | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const data = await StaffService.getStaffById(id);
        if (data) {
          setStaff(data);
        }
      } catch (error) {
        console.error('Error fetching staff details:', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchStaff();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="text-slate-500 font-medium text-sm">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/users/staff">
            <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-[#2B3674]">Chi tiết nhân viên</h2>
          </div>
        </div>
        <div className="text-center py-12 text-slate-500">Không tìm thấy nhân viên</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Back Action */}
      <div className="flex items-center gap-4">
        <Link href="/users/staff">
          <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Chi tiết nhân viên</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Xem thông tin của {staff.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6 h-fit shrink-0">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
              {staff.avatarUrl ? (
                <img
                    src={staff.avatarUrl}
                    alt={staff.name}
                    className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-slate-400 uppercase tracking-wider">
                    {(staff.name || '').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2) || 'NV'}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2B3674]">{staff.name}</h3>
              <p className="text-sm font-semibold text-[#A3AED0] mt-1">Mã NV: {staff.code}</p>
            </div>
            <div className="flex gap-2 justify-center">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-50 border border-slate-200 text-slate-600">
                {staff.department || 'Chưa cập nhật'}
              </span>
              {renderStatusBadge(staff.status)}
            </div>
          </div>
        </div>

        {/* Right Column: Information Data */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
           <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Thông tin liên hệ & Công việc</h4>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F4F7FE]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Mail className="w-5 h-5 text-[#4318FF]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#A3AED0]">Email</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5 break-all">{staff.email || '---'}</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F4F7FE]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Phone className="w-5 h-5 text-[#4318FF]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#A3AED0]">Số điện thoại</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5">{staff.phone || '---'}</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F4F7FE]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Briefcase className="w-5 h-5 text-[#4318FF]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#A3AED0]">Phòng ban</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5">{staff.department || '---'}</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F4F7FE]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <CreditCard className="w-5 h-5 text-[#4318FF]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#A3AED0]">Số CCCD</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5">{staff.citizenId || '---'}</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F4F7FE]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Calendar className="w-5 h-5 text-[#4318FF]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#A3AED0]">Ngày gia nhập</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5">{formatDate(staff.joinDate)}</p>
                </div>
             </div>
             
             <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F4F7FE] sm:col-span-2">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <FileText className="w-5 h-5 text-[#4318FF]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#A3AED0]">Tiểu sử chuyên môn</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5 whitespace-pre-wrap leading-relaxed">{staff.biography || '---'}</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}