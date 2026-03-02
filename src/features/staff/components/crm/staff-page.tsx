'use client';

import React from 'react';
import { UserCircle, UserCheck, UserMinus, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng nhân viên', value: '48', icon: UserCircle, color: 'text-[#4318FF]' },
  { title: 'Đang làm việc', value: '44', icon: UserCheck, color: 'text-green-500' },
  { title: 'Nghỉ phép', value: '4', icon: UserMinus, color: 'text-yellow-500' },
  { title: 'Vai trò', value: '6', icon: Shield, color: 'text-purple-500' },
];

const staff = [
  { id: 'NV001', name: 'Nguyễn Thanh Hùng', email: 'hung.nt@axetic.vn', phone: '0901 111 222', role: 'Quản lý', department: 'Kinh doanh', status: 'Làm việc' },
  { id: 'NV002', name: 'Trần Thị Kim Loan', email: 'loan.ttk@axetic.vn', phone: '0912 222 333', role: 'Nhân viên', department: 'Kế toán', status: 'Làm việc' },
  { id: 'NV003', name: 'Lê Văn Phong', email: 'phong.lv@axetic.vn', phone: '0923 333 444', role: 'Nhân viên', department: 'Kho vận', status: 'Nghỉ phép' },
  { id: 'NV004', name: 'Phạm Minh Quân', email: 'quan.pm@axetic.vn', phone: '0934 444 555', role: 'Trưởng phòng', department: 'Kinh doanh', status: 'Làm việc' },
  { id: 'NV005', name: 'Hoàng Thị Lan', email: 'lan.ht@axetic.vn', phone: '0945 555 666', role: 'Nhân viên', department: 'CSKH', status: 'Làm việc' },
];

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

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Nhân viên</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý thông tin và phân quyền nhân viên</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <UserCircle className="w-4 h-4" /> Thêm nhân viên
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="border-none shadow-sm bg-white rounded-lg">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-[#2B3674]">{s.value}</p>
                <p className="text-xs font-semibold text-[#A3AED0] mt-0.5">{s.title}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#F4F7FE] flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-white rounded-lg">
        <CardHeader className="px-6 py-4 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-[#2B3674]">Danh sách nhân viên</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Mã NV</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Họ tên</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Điện thoại</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Vai trò</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Phòng ban</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#4318FF]">{s.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{s.name}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{s.email}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{s.phone}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${roleColor[s.role] ?? 'bg-gray-100 text-gray-500'}`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[#A3AED0]">{s.department}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[s.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
