'use client';

import React from 'react';
import { ShoppingBag, Users, Package, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Đơn hàng tháng này', value: '248', icon: ShoppingBag, color: 'text-[#4318FF]' },
  { title: 'Khách hàng mới', value: '42', icon: Users, color: 'text-blue-500' },
  { title: 'Sản phẩm bán ra', value: '1,340', icon: Package, color: 'text-green-500' },
  { title: 'SP bán chạy nhất', value: 'CAM-4K', icon: Award, color: 'text-yellow-500' },
];

const topProducts = [
  { rank: 1, name: 'Camera an ninh 4K', sku: 'CAM-4K-001', sold: 245, revenue: '600,250,000', trend: '+18%' },
  { rank: 2, name: 'Đầu ghi hình 16 kênh', sku: 'DVR-16CH', sold: 186, revenue: '706,800,000', trend: '+12%' },
  { rank: 3, name: 'Bộ nguồn UPS 1000VA', sku: 'UPS-1000', sold: 154, revenue: '269,500,000', trend: '+5%' },
  { rank: 4, name: 'Cáp mạng Cat6 (cuộn)', sku: 'CBL-CAT6', sold: 132, revenue: '73,920,000', trend: '-3%' },
  { rank: 5, name: 'Màn hình giám sát 27"', sku: 'MON-27-PRO', sold: 98, revenue: '509,600,000', trend: '+22%' },
];

export default function ReportsSalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2B3674]">Báo cáo bán hàng</h2>
        <p className="text-sm text-[#A3AED0] mt-1">Phân tích hiệu quả bán hàng và sản phẩm bán chạy</p>
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Top sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">#</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Sản phẩm</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">SKU</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Đã bán</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Doanh thu</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tăng trưởng</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.rank} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${p.rank === 1 ? 'bg-yellow-100 text-yellow-600' : p.rank === 2 ? 'bg-gray-100 text-gray-500' : p.rank === 3 ? 'bg-orange-100 text-orange-500' : 'bg-[#F4F7FE] text-[#A3AED0]'}`}>
                      {p.rank}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{p.name}</td>
                  <td className="px-6 py-3 text-[#A3AED0] font-mono text-xs">{p.sku}</td>
                  <td className="px-6 py-3 text-right font-bold text-[#2B3674]">{p.sold}</td>
                  <td className="px-6 py-3 text-right text-[#2B3674]">{p.revenue} đ</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`font-bold text-xs ${p.trend.startsWith('+') ? 'text-green-600' : 'text-red-400'}`}>
                      {p.trend}
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
