'use client';

import React from 'react';
import { Users, Mail, Phone, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng khách hàng', value: '1,245', icon: Users, color: 'admin-text-primary' },
  { title: 'Hoạt động', value: '987', icon: Users, color: 'text-green-500' },
  { title: 'Không hoạt động', value: '258', icon: Users, color: 'text-red-400' },
];

const customers = [
  { id: 'KH001', name: 'Công ty TNHH Minh Phát', contact: 'Nguyễn Hùng', email: 'hung@minhphat.vn', phone: '0987654321', address: 'Hà Nội', status: 'Hoạt động' },
  { id: 'KH002', name: 'Doanh nghiệp Thiên Long', contact: 'Trần Linh', email: 'linh@thienlong.vn', phone: '0912345678', address: 'TP.HCM', status: 'Hoạt động' },
  { id: 'KH003', name: 'Cty CP Bình Minh', contact: 'Lê Tuấn', email: 'tuan@binhminh.vn', phone: '0901234567', address: 'Đà Nẵng', status: 'Hoạt động' },
  { id: 'KH004', name: 'HTX Phú Thịnh', contact: 'Phạm Hà', email: 'ha@phuthiodnh.vn', phone: '0898765432', address: 'Hải Phòng', status: 'Không hoạt động' },
  { id: 'KH005', name: 'Cty TNHH Vĩnh Phúc', contact: 'Hoàng Nam', email: 'nam@vinhphuc.vn', phone: '0856789012', address: 'Hà Nội', status: 'Hoạt động' },
];

const statusColor: Record<string, string> = {
  'Hoạt động': 'bg-green-100 text-green-600',
  'Không hoạt động': 'bg-red-100 text-red-600',
};

export default function CustomersList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Khách hàng</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý danh sách khách hàng của bạn</p>
        </div>
        <button className="flex items-center gap-2 admin-btn-primary">
          <Users className="w-4 h-4" /> Thêm khách hàng
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="border-none shadow-sm bg-white rounded">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-[#2B3674]">{s.value}</p>
                <p className="text-xs font-semibold text-[#A3AED0] mt-0.5">{s.title}</p>
              </div>
              <div className="w-10 h-10 rounded bg-[#F4F7FE] flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-white rounded">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Mã</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tên công ty</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Người liên hệ</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Điện thoại</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Địa chỉ</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold admin-text-primary">{c.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{c.name}</td>
                  <td className="px-6 py-3">{c.contact}</td>
                  <td className="px-6 py-3">{c.email}</td>
                  <td className="px-6 py-3">{c.phone}</td>
                  <td className="px-6 py-3">{c.address}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[c.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-[#E9EDF7] rounded transition-colors">
                        <Edit2 className="w-4 h-4 admin-text-primary" />
                      </button>
                      <button className="p-1.5 hover:bg-[#FFE5E5] rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
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
