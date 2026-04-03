'use client';

import React from 'react';
import { PackageMinus, ShoppingBag, DollarSign, Hash, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 admin-btn-primary">
          <PackageMinus className="w-4 h-4" /> Tạo phiếu xuất
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <th className="text-left px-6 py-3 admin-table-th">Số phiếu</th>
                <th className="text-left px-6 py-3 admin-table-th">Đối tượng nhận</th>
                <th className="text-left px-6 py-3 admin-table-th">Ngày xuất</th>
                <th className="text-left px-6 py-3 admin-table-th">Số mặt hàng</th>
                <th className="text-left px-6 py-3 admin-table-th">Giá trị</th>
                <th className="text-left px-6 py-3 admin-table-th">Loại</th>
                <th className="text-left px-6 py-3 admin-table-th">Trạng thái</th>
                <th className="text-center px-6 py-3 admin-table-th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {exports.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold admin-text-primary">{e.id}</td>
                  <td className="px-6 py-3 font-semibold">{e.recipient}</td>
                  <td className="px-6 py-3">{e.date}</td>
                  <td className="px-6 py-3 text-center">{e.items}</td>
                  <td className="px-6 py-3 font-semibold">{e.total} đ</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${typeColor[e.type] ?? 'bg-gray-100 text-gray-500'}`}>
                      {e.type}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[e.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {e.status}
                    </span>
                  </td>
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
