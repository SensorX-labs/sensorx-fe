'use client';

import React from 'react';
import { Warehouse, PackagePlus, PackageMinus, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng tồn kho', value: '18,420', icon: Warehouse, color: 'text-[#4318FF]' },
  { title: 'Nhập tháng này', value: '3,241', icon: PackagePlus, color: 'text-green-500' },
  { title: 'Xuất tháng này', value: '4,120', icon: PackageMinus, color: 'text-red-400' },
  { title: 'Giá trị tồn kho', value: '4.8 tỷ', icon: DollarSign, color: 'text-purple-500' },
];

const warehouseData = [
  { category: 'Camera', totalItems: 450, inStock: 312, imported: 120, exported: 158, value: '764,400,000' },
  { category: 'Đầu ghi', totalItems: 180, inStock: 124, imported: 48, exported: 62, value: '471,200,000' },
  { category: 'Màn hình', totalItems: 90, inStock: 42, imported: 18, exported: 24, value: '218,400,000' },
  { category: 'Phụ kiện', totalItems: 2400, inStock: 1845, imported: 800, exported: 1200, value: '369,000,000' },
  { category: 'Nguồn điện', totalItems: 320, inStock: 218, imported: 96, exported: 102, value: '381,500,000' },
];

export default function ReportsWarehousePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2B3674]">Báo cáo kho hàng</h2>
        <p className="text-sm text-[#A3AED0] mt-1">Tổng quan tình trạng và biến động hàng tồn kho</p>
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Tồn kho theo danh mục</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Danh mục</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tổng SP</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tồn kho</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Đã nhập</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Đã xuất</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Giá trị tồn</th>
              </tr>
            </thead>
            <tbody>
              {warehouseData.map((w) => (
                <tr key={w.category} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{w.category}</td>
                  <td className="px-6 py-3 text-right text-[#A3AED0]">{w.totalItems}</td>
                  <td className="px-6 py-3 text-right font-bold text-[#2B3674]">{w.inStock}</td>
                  <td className="px-6 py-3 text-right text-green-600 font-semibold">+{w.imported}</td>
                  <td className="px-6 py-3 text-right text-red-400 font-semibold">-{w.exported}</td>
                  <td className="px-6 py-3 text-right font-semibold text-[#2B3674]">{w.value} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
