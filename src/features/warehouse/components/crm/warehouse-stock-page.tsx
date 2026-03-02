'use client';

import React from 'react';
import { Warehouse, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng mặt hàng', value: '1,284', icon: Package, color: 'text-[#4318FF]' },
  { title: 'Tổng tồn kho', value: '18,420', icon: Warehouse, color: 'text-blue-500' },
  { title: 'Sắp hết hàng', value: '23', icon: AlertTriangle, color: 'text-yellow-500' },
  { title: 'Hết hàng', value: '8', icon: TrendingDown, color: 'text-red-400' },
];

const stock = [
  { id: 'HH001', name: 'Camera an ninh 4K', sku: 'CAM-4K-001', category: 'Camera', qty: 45, minQty: 10, location: 'A1-01', status: 'Bình thường' },
  { id: 'HH002', name: 'Đầu ghi hình 16 kênh', sku: 'DVR-16CH', category: 'Đầu ghi', qty: 12, minQty: 5, location: 'A1-02', status: 'Bình thường' },
  { id: 'HH003', name: 'Cáp mạng Cat6 (cuộn 305m)', sku: 'CBL-CAT6', category: 'Phụ kiện', qty: 4, minQty: 10, location: 'B2-05', status: 'Sắp hết' },
  { id: 'HH004', name: 'Màn hình giám sát 27"', sku: 'MON-27-PRO', category: 'Màn hình', qty: 0, minQty: 3, location: 'A2-01', status: 'Hết hàng' },
  { id: 'HH005', name: 'Bộ nguồn UPS 1000VA', sku: 'UPS-1000', category: 'Nguồn điện', qty: 28, minQty: 5, location: 'C1-03', status: 'Bình thường' },
];

const statusColor: Record<string, string> = {
  'Bình thường': 'bg-green-100 text-green-600',
  'Sắp hết': 'bg-yellow-100 text-yellow-600',
  'Hết hàng': 'bg-red-100 text-red-400',
};

export default function WarehouseStockPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Tồn kho</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Theo dõi số lượng hàng hóa trong kho</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <Warehouse className="w-4 h-4" /> Kiểm kê kho
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Danh sách tồn kho</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Mã HH</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tên hàng hóa</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">SKU</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Loại hàng</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tồn kho</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tồn tối thiểu</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Vị trí</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#4318FF]">{item.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{item.name}</td>
                  <td className="px-6 py-3 text-[#A3AED0] font-mono text-xs">{item.sku}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{item.category}</td>
                  <td className="px-6 py-3 text-center font-bold text-[#2B3674]">{item.qty}</td>
                  <td className="px-6 py-3 text-center text-[#A3AED0]">{item.minQty}</td>
                  <td className="px-6 py-3 text-[#A3AED0] font-mono text-xs">{item.location}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[item.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {item.status}
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
