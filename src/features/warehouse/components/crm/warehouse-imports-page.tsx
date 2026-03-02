'use client';

import React from 'react';
import { PackagePlus, Truck, DollarSign, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

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

export default function WarehouseImportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Phiếu nhập kho</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý hàng hóa nhập vào kho</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <PackagePlus className="w-4 h-4" /> Tạo phiếu nhập
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Danh sách phiếu nhập</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Số phiếu</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Nhà cung cấp</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Ngày nhập</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Số mặt hàng</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tổng tiền</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Kho</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {imports.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#4318FF]">{r.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{r.supplier}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{r.date}</td>
                  <td className="px-6 py-3 text-center text-[#A3AED0]">{r.items}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{r.total} đ</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{r.warehouse}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[r.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {r.status}
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
