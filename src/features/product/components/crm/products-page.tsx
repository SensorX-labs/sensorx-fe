'use client';

import React from 'react';
import { Package, Tag, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng hàng hóa', value: '1,284', icon: Package, color: 'text-[#4318FF]' },
  { title: 'Loại hàng', value: '48', icon: Tag, color: 'text-purple-500' },
  { title: 'Sắp hết hàng', value: '23', icon: AlertTriangle, color: 'text-yellow-500' },
  { title: 'Bán chạy', value: '156', icon: TrendingUp, color: 'text-green-500' },
];

const products = [
  { id: 'HH001', name: 'Camera an ninh 4K', sku: 'CAM-4K-001', category: 'Camera', price: '2,450,000', stock: 45, status: 'Còn hàng' },
  { id: 'HH002', name: 'Đầu ghi hình 16 kênh', sku: 'DVR-16CH', category: 'Đầu ghi', price: '3,800,000', stock: 12, status: 'Còn hàng' },
  { id: 'HH003', name: 'Cáp mạng Cat6 (cuộn 305m)', sku: 'CBL-CAT6', category: 'Phụ kiện', price: '560,000', stock: 4, status: 'Sắp hết' },
  { id: 'HH004', name: 'Màn hình giám sát 27"', sku: 'MON-27-PRO', category: 'Màn hình', price: '5,200,000', stock: 0, status: 'Hết hàng' },
  { id: 'HH005', name: 'Bộ nguồn UPS 1000VA', sku: 'UPS-1000', category: 'Nguồn điện', price: '1,750,000', stock: 28, status: 'Còn hàng' },
];

const statusColor: Record<string, string> = {
  'Còn hàng': 'bg-green-100 text-green-600',
  'Sắp hết': 'bg-yellow-100 text-yellow-600',
  'Hết hàng': 'bg-red-100 text-red-400',
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Hàng hóa</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý danh mục sản phẩm & hàng hóa</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <Package className="w-4 h-4" /> Thêm hàng hóa
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Danh sách hàng hóa</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Mã HH</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tên hàng hóa</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">SKU</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Loại hàng</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Đơn giá</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tồn kho</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#4318FF]">{p.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{p.name}</td>
                  <td className="px-6 py-3 text-[#A3AED0] font-mono text-xs">{p.sku}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{p.category}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{p.price} đ</td>
                  <td className="px-6 py-3 text-center font-semibold text-[#2B3674]">{p.stock}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[p.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {p.status}
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
