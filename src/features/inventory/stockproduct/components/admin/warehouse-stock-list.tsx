'use client';

import React, { useState, useMemo } from 'react';
import { Warehouse, Package, AlertTriangle, TrendingDown, Search } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng mặt hàng', value: '1,284', icon: Package, color: 'text-[#4318FF]' },
  { title: 'Tổng tồn kho', value: '18,420', icon: Warehouse, color: 'text-blue-500' },
  { title: 'Sắp hết hàng', value: '23', icon: AlertTriangle, color: 'text-yellow-500' },
  { title: 'Hết hàng', value: '8', icon: TrendingDown, color: 'text-red-400' },
];

const stock = [
  { id: 'HH001', name: 'Camera an ninh 4K', sku: 'CAM-4K-001', category: 'Camera', qty: 45, location: 'A1-01' },
  { id: 'HH002', name: 'Đầu ghi hình 16 kênh', sku: 'DVR-16CH', category: 'Đầu ghi', qty: 12, location: 'A1-02' },
  { id: 'HH003', name: 'Cáp mạng Cat6 (cuộn 305m)', sku: 'CBL-CAT6', category: 'Phụ kiện', qty: 40, location: 'B2-05' },
  { id: 'HH004', name: 'Màn hình giám sát 27"', sku: 'MON-27-PRO', category: 'Màn hình', qty: 15, location: 'A2-01' },
  { id: 'HH005', name: 'Bộ nguồn UPS 1000VA', sku: 'UPS-1000', category: 'Nguồn điện', qty: 28, location: 'C1-03' },
];

export default function WarehouseStockPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStock = useMemo(() => {
    return stock.filter(item => {
      const matchesSearch = 
        (item.id?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (item.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (item.sku?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 admin-btn-primary">
          <Warehouse className="w-4 h-4" /> Kiểm kê kho
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
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã HH, tên hàng hóa, SKU..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Mã HH</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Tên hàng hóa</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">SKU</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Loại hàng</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Tồn kho</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Vị trí</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{item.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-gray-700">{item.sku}</td>
                <td className="px-6 py-4 text-gray-700">{item.category}</td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">{item.qty}</td>
                <td className="px-6 py-4 text-gray-700">{item.location}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
