'use client';

import React from 'react';
import { PackageMinus, ShoppingBag, DollarSign, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

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

export default function WarehouseExportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Phiếu xuất kho</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý hàng hóa xuất ra khỏi kho</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <PackageMinus className="w-4 h-4" /> Tạo phiếu xuất
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Danh sách phiếu xuất</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Số phiếu</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Đối tượng nhận</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Ngày xuất</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Số mặt hàng</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Giá trị</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Loại</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {exports.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#4318FF]">{e.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{e.recipient}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{e.date}</td>
                  <td className="px-6 py-3 text-center text-[#A3AED0]">{e.items}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{e.total} đ</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
