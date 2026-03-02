'use client';

import React from 'react';
import { Megaphone, Users, MousePointerClick, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng chiến dịch', value: '34', icon: Megaphone, color: 'text-[#4318FF]' },
  { title: 'Đang chạy', value: '8', icon: TrendingUp, color: 'text-green-500' },
  { title: 'Lượt tiếp cận', value: '124K', icon: Users, color: 'text-blue-500' },
  { title: 'Tỷ lệ chuyển đổi', value: '3.8%', icon: MousePointerClick, color: 'text-purple-500' },
];

const campaigns = [
  { id: 'CD001', name: 'Khuyến mãi Tết 2026', channel: 'Email + SMS', startDate: '15/01/2026', endDate: '10/02/2026', budget: '50,000,000', reach: '45,200', status: 'Kết thúc' },
  { id: 'CD002', name: 'Ra mắt sản phẩm mới Q1', channel: 'Facebook Ads', startDate: '01/03/2026', endDate: '31/03/2026', budget: '30,000,000', reach: '18,400', status: 'Đang chạy' },
  { id: 'CD003', name: 'Upsell khách hàng VIP', channel: 'Email', startDate: '20/02/2026', endDate: '20/03/2026', budget: '10,000,000', reach: '3,240', status: 'Đang chạy' },
  { id: 'CD004', name: 'Tái kích hoạt khách cũ', channel: 'SMS', startDate: '01/04/2026', endDate: '30/04/2026', budget: '15,000,000', reach: '—', status: 'Chưa bắt đầu' },
];

const statusColor: Record<string, string> = {
  'Đang chạy': 'bg-green-100 text-green-600',
  'Kết thúc': 'bg-gray-100 text-gray-500',
  'Chưa bắt đầu': 'bg-blue-100 text-blue-600',
  'Tạm dừng': 'bg-yellow-100 text-yellow-600',
};

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Chiến dịch Marketing</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý và theo dõi hiệu quả các chiến dịch</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <Megaphone className="w-4 h-4" /> Tạo chiến dịch
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Danh sách chiến dịch</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Mã</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tên chiến dịch</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Kênh</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Bắt đầu</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Kết thúc</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Ngân sách</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tiếp cận</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#4318FF]">{c.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{c.name}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{c.channel}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{c.startDate}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{c.endDate}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{c.budget} đ</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{c.reach}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[c.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {c.status}
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
