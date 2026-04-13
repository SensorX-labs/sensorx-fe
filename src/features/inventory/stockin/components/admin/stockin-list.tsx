'use client';

import React from 'react';
import { PackagePlus, Truck, DollarSign, Hash, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';

const stats = [
  { title: 'Phiếu nhập tháng này', value: '143', icon: PackagePlus, color: 'text-[#4318FF]' },
  { title: 'Nhà cung cấp', value: '28', icon: Truck, color: 'text-blue-500' },
  { title: 'Tổng giá trị nhập', value: '2.8 tỷ', icon: DollarSign, color: 'text-green-500' },
  { title: 'Mặt hàng đã nhập', value: '3,241', icon: Hash, color: 'text-purple-500' },
];

const imports = [
  { id: 'PN001', supplier: 'Cty CP Minh Toàn', date: '02/03/2026', items: 8, total: '45,200,000', warehouse: 'Kho chính', status: 'Hoàn thành' },
  { id: 'PN002', supplier: 'NCC Thiên Bình', date: '01/03/2026', items: 3, total: '18,600,000', warehouse: 'Kho chính', status: 'Đang xử lý' },
  { id: 'PN003', supplier: 'Cty TNHH Hải Long', date: '28/02/2026', items: 12, total: '92,400,000', warehouse: 'Kho phụ', status: 'Hoàn thành' },
  { id: 'PN004', supplier: 'Cty CP Minh Toàn', date: '27/02/2026', items: 5, total: '34,800,000', warehouse: 'Kho chính', status: 'Hoàn thành' },
  { id: 'PN005', supplier: 'NCC Đông Á', date: '25/02/2026', items: 6, total: '56,100,000', warehouse: 'Kho chính', status: 'Chờ xác nhận' },
];

const statusColor: Record<string, string> = {
  'Hoàn thành': 'bg-green-100 text-green-600',
  'Đang xử lý': 'bg-yellow-100 text-yellow-600',
  'Chờ xác nhận': 'bg-orange-100 text-orange-500',
};

export default function StockInList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 admin-btn-primary">
          <PackagePlus className="w-4 h-4" /> Tạo phiếu nhập
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
                <th className="text-left px-6 py-3 admin-table-th">Nhà cung cấp</th>
                <th className="text-left px-6 py-3 admin-table-th">Ngày nhập</th>
                <th className="text-left px-6 py-3 admin-table-th">Số mặt hàng</th>
                <th className="text-left px-6 py-3 admin-table-th">Tổng tiền</th>
                <th className="text-left px-6 py-3 admin-table-th">Kho</th>
                <th className="text-left px-6 py-3 admin-table-th">Trạng thái</th>
                <th className="text-center px-6 py-3 admin-table-th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {imports.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold admin-text-primary">{r.id}</td>
                  <td className="px-6 py-3 font-semibold">{r.supplier}</td>
                  <td className="px-6 py-3">{r.date}</td>
                  <td className="px-6 py-3 text-center">{r.items}</td>
                  <td className="px-6 py-3 font-semibold">{r.total} đ</td>
                  <td className="px-6 py-3">{r.warehouse}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[r.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {r.status}
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
