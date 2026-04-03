'use client';

import React from 'react';
import { Users, Mail, Phone, MapPin, Edit2, Trash2, Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';

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
      <Card className="border-none shadow-sm bg-white rounded">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 admin-table-th">Mã</th>
                <th className="text-left px-6 py-3 admin-table-th">Tên công ty</th>
                <th className="text-left px-6 py-3 admin-table-th">Người liên hệ</th>
                <th className="text-left px-6 py-3 admin-table-th">Email</th>
                <th className="text-left px-6 py-3 admin-table-th">Điện thoại</th>
                <th className="text-left px-6 py-3 admin-table-th">Địa chỉ</th>
                <th className="text-center px-6 py-3 admin-table-th">Hành động</th>
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
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50">
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
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
