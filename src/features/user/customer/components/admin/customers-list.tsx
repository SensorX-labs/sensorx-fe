'use client';

import React, { useState } from 'react';
import { Users, Mail, Phone, MapPin, Edit2, Trash2, Eye, Edit, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã, công ty, người liên hệ, email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Mã</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Tên công ty</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Người liên hệ</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Email</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Điện thoại</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Địa chỉ</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{c.id}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{c.name}</td>
                <td className="px-6 py-4 text-gray-700">{c.contact}</td>
                <td className="px-6 py-4 text-gray-700">{c.email}</td>
                <td className="px-6 py-4 text-gray-700">{c.phone}</td>
                <td className="px-6 py-4 text-gray-700">{c.address}</td>
                <td className="px-6 py-4">
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
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
