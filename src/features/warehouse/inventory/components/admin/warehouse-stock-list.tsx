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
  { id: 'HH001', name: 'Camera an ninh 4K', sku: 'CAM-4K-001', category: 'Camera', qty: 45, location: 'A1-01' },
  { id: 'HH002', name: 'Đầu ghi hình 16 kênh', sku: 'DVR-16CH', category: 'Đầu ghi', qty: 12, location: 'A1-02' },
  { id: 'HH003', name: 'Cáp mạng Cat6 (cuộn 305m)', sku: 'CBL-CAT6', category: 'Phụ kiện', qty: 40, location: 'B2-05' },
  { id: 'HH004', name: 'Màn hình giám sát 27"', sku: 'MON-27-PRO', category: 'Màn hình', qty: 15, location: 'A2-01' },
  { id: 'HH005', name: 'Bộ nguồn UPS 1000VA', sku: 'UPS-1000', category: 'Nguồn điện', qty: 28, location: 'C1-03' },
];

export default function WarehouseStockPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 admin-btn-primary">
          <Warehouse className="w-4 h-4" /> Kiểm kê kho
        </button>
      </div>

      <Card className="border-none shadow-sm bg-white rounded">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 admin-table-th">Mã HH</th>
                <th className="text-left px-6 py-3 admin-table-th">Tên hàng hóa</th>
                <th className="text-left px-6 py-3 admin-table-th">SKU</th>
                <th className="text-left px-6 py-3 admin-table-th">Loại hàng</th>
                <th className="text-center px-6 py-3 admin-table-th">Tồn kho</th>
                <th className="text-left px-6 py-3 admin-table-th">Vị trí</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold admin-text-primary">{item.id}</td>
                  <td className="px-6 py-3 font-semibold">{item.name}</td>
                  <td className="px-6 py-3">{item.sku}</td>
                  <td className="px-6 py-3">{item.category}</td>
                  <td className="px-6 py-3 text-center font-bold">{item.qty}</td>
                  <td className="px-6 py-3">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
