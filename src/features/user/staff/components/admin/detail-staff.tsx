import React from 'react';
import { Mail, Phone, Briefcase, Edit, Key, Ban, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import Link from 'next/link';

export type StaffData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
};

const statusColor: Record<string, string> = {
  'Làm việc': 'bg-green-100 text-green-600',
  'Nghỉ phép': 'bg-yellow-100 text-yellow-600',
  'Nghỉ việc': 'bg-red-100 text-red-400',
};

const roleColor: Record<string, string> = {
  'Quản lý': 'bg-purple-100 text-purple-600',
  'Trưởng phòng': 'bg-blue-100 text-blue-600',
  'Nhân viên': 'bg-gray-100 text-gray-500',
};

interface DetailStaffProps {
  id?: string;
}

const mockStaff = [
  { id: 'NV001', name: 'Nguyễn Thanh Hùng', email: 'hung.nt@axetic.vn', phone: '0901 111 222', role: 'Quản lý', department: 'Kinh doanh', status: 'Làm việc' },
  { id: 'NV002', name: 'Trần Thị Kim Loan', email: 'loan.ttk@axetic.vn', phone: '0912 222 333', role: 'Nhân viên', department: 'Kế toán', status: 'Làm việc' },
  { id: 'NV003', name: 'Lê Văn Phong', email: 'phong.lv@axetic.vn', phone: '0923 333 444', role: 'Nhân viên', department: 'Kho vận', status: 'Nghỉ phép' },
  { id: 'NV004', name: 'Phạm Minh Quân', email: 'quan.pm@axetic.vn', phone: '0934 444 555', role: 'Trưởng phòng', department: 'Kinh doanh', status: 'Làm việc' },
  { id: 'NV005', name: 'Hoàng Thị Lan', email: 'lan.ht@axetic.vn', phone: '0945 555 666', role: 'Nhân viên', department: 'CSKH', status: 'Làm việc' },
];

export function DetailStaff({ id }: DetailStaffProps) {
  const staff = mockStaff.find(s => s.id === id) || mockStaff[0];

  if (!staff) return <div>Không tìm thấy nhân viên</div>;

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
          <p className="text-sm text-[#A3AED0] mt-1">Xem và quản lý thông tin của {staff.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile */}
        <div className="md:col-span-1 bg-white p-6 rounded shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-[#4318FF]/10 text-[#4318FF] flex items-center justify-center text-4xl font-bold">
              {staff.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2B3674]">{staff.name}</h3>
              <p className="text-sm font-semibold text-[#A3AED0]">{staff.id}</p>
            </div>
            <div className="flex gap-2 justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleColor[staff.role] ?? 'bg-gray-100 text-gray-500'}`}>
                {staff.role}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[staff.status] ?? 'bg-gray-100 text-gray-500'}`}>
                {staff.status}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-3">
             <h4 className="text-sm font-bold text-[#2B3674] mb-4">Thao tác hệ thống</h4>
             <Button variant="outline" className="w-full justify-start text-[#2B3674] border-gray-200 hover:bg-[#F4F7FE]">
               <Edit className="w-4 h-4 mr-2 text-[#4318FF]" />
               Cập nhật thông tin
             </Button>
             <Button variant="outline" className="w-full justify-start text-[#2B3674] border-gray-200 hover:bg-[#F4F7FE]">
               <Key className="w-4 h-4 mr-2 text-yellow-500" />
               Cấp lại mật khẩu
             </Button>
             <Button variant="outline" className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
               <Ban className="w-4 h-4 mr-2" />
               Ngừng hoạt động
             </Button>
          </div>
        </div>

        {/* Right Column: Information Data */}
        <div className="md:col-span-2 bg-white p-6 rounded shadow-sm border border-gray-100">
           <h4 className="text-lg font-bold text-[#2B3674] mb-6">Thông tin liên hệ & Công việc</h4>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="flex items-start gap-4 p-4 rounded bg-[#F4F7FE]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-[#4318FF]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#A3AED0]">Email</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5">{staff.email}</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded bg-[#F4F7FE]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 text-[#4318FF]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#A3AED0]">Số điện thoại</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5">{staff.phone}</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded bg-[#F4F7FE]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Briefcase className="w-5 h-5 text-[#4318FF]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#A3AED0]">Phòng ban</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5">{staff.department}</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}