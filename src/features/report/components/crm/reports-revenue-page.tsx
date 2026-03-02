'use client';

import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Doanh thu tháng này', value: '1.24 tỷ', icon: DollarSign, color: 'text-[#4318FF]' },
  { title: 'So tháng trước', value: '+12.4%', icon: TrendingUp, color: 'text-green-500' },
  { title: 'Chi phí', value: '320 tr', icon: TrendingDown, color: 'text-red-400' },
  { title: 'Lợi nhuận', value: '920 tr', icon: BarChart3, color: 'text-purple-500' },
];

const months = [
  { month: 'Tháng 10/2025', revenue: '980,000,000', cost: '290,000,000', profit: '690,000,000', growth: '+5.2%' },
  { month: 'Tháng 11/2025', revenue: '1,050,000,000', cost: '310,000,000', profit: '740,000,000', growth: '+7.1%' },
  { month: 'Tháng 12/2025', revenue: '1,380,000,000', cost: '380,000,000', profit: '1,000,000,000', growth: '+31.4%' },
  { month: 'Tháng 1/2026', revenue: '890,000,000', cost: '265,000,000', profit: '625,000,000', growth: '-35.5%' },
  { month: 'Tháng 2/2026', revenue: '1,100,000,000', cost: '305,000,000', profit: '795,000,000', growth: '+23.6%' },
  { month: 'Tháng 3/2026', revenue: '1,240,000,000', cost: '320,000,000', profit: '920,000,000', growth: '+12.7%' },
];

export default function ReportsRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2B3674]">Báo cáo doanh thu</h2>
        <p className="text-sm text-[#A3AED0] mt-1">Theo dõi doanh thu, chi phí và lợi nhuận theo tháng</p>
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tháng</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Doanh thu</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Chi phí</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Lợi nhuận</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tăng trưởng</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.month} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{m.month}</td>
                  <td className="px-6 py-3 text-right text-[#2B3674]">{m.revenue} đ</td>
                  <td className="px-6 py-3 text-right text-[#A3AED0]">{m.cost} đ</td>
                  <td className="px-6 py-3 text-right font-bold text-[#2B3674]">{m.profit} đ</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`font-bold text-xs ${m.growth.startsWith('+') ? 'text-green-600' : 'text-red-400'}`}>
                      {m.growth}
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
