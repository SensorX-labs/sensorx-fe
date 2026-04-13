'use client';

import React, { useState, useMemo } from 'react';
import { PackageMinus, ShoppingBag, DollarSign, Hash, Eye, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';

const stats = [
  { title: 'Phiếu xuất tháng này', value: '218', icon: PackageMinus, color: 'text-[#4318FF]' },
  { title: 'Xuất bán hàng', value: '195', icon: ShoppingBag, color: 'text-blue-500' },
  { title: 'Tổng giá trị xuất', value: '3.4 tỷ', icon: DollarSign, color: 'text-green-500' },
  { title: 'Mặt hàng đã xuất', value: '4,120', icon: Hash, color: 'text-orange-500' },
];

const exports = [
  { id: 'PX001', recipient: 'Đơn hàng DH001', date: '02/03/2026', items: 3, total: '12,500,000', warehouse: 'Kho chính', type: 'Xuất bán', status: 'Hoàn thành' },
  { id: 'PX002', recipient: 'Đơn hàng DH002', date: '02/03/2026', items: 1, total: '4,200,000', warehouse: 'Kho chính', type: 'Xuất bán', status: 'Đang xử lý' },
  { id: 'PX003', recipient: 'Kho phụ Hà Nội', date: '01/03/2026', items: 10, total: '68,000,000', warehouse: 'Kho chính', type: 'Điều chuyển', status: 'Hoàn thành' },
  { id: 'PX004', recipient: 'Đơn hàng DH003', date: '01/03/2026', items: 5, total: '28,900,000', warehouse: 'Kho chính', type: 'Xuất bán', status: 'Đang xử lý' },
  { id: 'PX005', recipient: 'Thanh lý hàng cũ', date: '28/02/2026', items: 7, total: '15,400,000', warehouse: 'Kho phụ', type: 'Thanh lý', status: 'Hoàn thành' },
];

const statusColor: Record<string, string> = {
  'Hoàn thành': 'bg-green-100 text-green-600',
  'Đang xử lý': 'bg-yellow-100 text-yellow-600',
};

const typeColor: Record<string, string> = {
  'Xuất bán': 'bg-blue-100 text-blue-600',
  'Điều chuyển': 'bg-purple-100 text-purple-600',
  'Thanh lý': 'bg-orange-100 text-orange-500',
};

export default function StockOutList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredExports = useMemo(() => {
    return exports.filter(item => {
      const matchesSearch = 
        (item.id?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (item.recipient?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 admin-btn-primary">
          <PackageMinus className="w-4 h-4" /> Tạo phiếu xuất
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
              placeholder="Tìm số phiếu, đối tượng nhận..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white text-gray-600"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đang xử lý">Đang xử lý</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Số phiếu</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Đối tượng nhận</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Ngày xuất</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Số mặt hàng</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Giá trị</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Loại</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Trạng thái</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredExports.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{e.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{e.recipient}</td>
                <td className="px-6 py-4 text-gray-700">{e.date}</td>
                <td className="px-6 py-4 text-center text-gray-700">{e.items}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{e.total} đ</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${typeColor[e.type] ?? 'bg-gray-100 text-gray-500'}`}>
                    {e.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[e.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {e.status}
                  </span>
                </td>
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
            </tbody>
          </table>
        </div>
      </div>
  );
}

