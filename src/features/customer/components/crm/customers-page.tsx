'use client';

import React from 'react';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng khách hàng', value: '3,240', icon: Users, color: 'text-[#4318FF]' },
  { title: 'Khách mới tháng này', value: '128', icon: UserPlus, color: 'text-green-500' },
  { title: 'Đang hoạt động', value: '2,891', icon: UserCheck, color: 'text-blue-500' },
  { title: 'Ngừng hoạt động', value: '349', icon: UserX, color: 'text-red-400' },
];

const customers = [
  { id: 'KH001', name: 'Nguyễn Văn An', phone: '0901 234 567', email: 'an.nguyen@email.com', group: 'VIP', status: 'Hoạt động' },
  { id: 'KH002', name: 'Trần Thị Bình', phone: '0912 345 678', email: 'binh.tran@email.com', group: 'Thường', status: 'Hoạt động' },
  { id: 'KH003', name: 'Lê Minh Châu', phone: '0923 456 789', email: 'chau.le@email.com', group: 'VIP', status: 'Hoạt động' },
  { id: 'KH004', name: 'Phạm Đức Dũng', phone: '0934 567 890', email: 'dung.pham@email.com', group: 'Thường', status: 'Tạm dừng' },
  { id: 'KH005', name: 'Hoàng Thị Ema', phone: '0945 678 901', email: 'ema.hoang@email.com', group: 'Tiềm năng', status: 'Hoạt động' },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Khách hàng</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý danh sách khách hàng</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <UserPlus className="w-4 h-4" /> Thêm khách hàng
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Danh sách khách hàng</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Mã KH</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Họ tên</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Điện thoại</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Nhóm</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#4318FF]">{c.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{c.name}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{c.phone}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{c.email}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.group === 'VIP' ? 'bg-purple-100 text-purple-600' : c.group === 'Tiềm năng' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                      {c.group}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.status === 'Hoạt động' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-400'}`}>
                      {c.status}
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
