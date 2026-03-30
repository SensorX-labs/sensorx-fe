'use client';

import React from 'react';
import { Target, DollarSign, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng cơ hội', value: '156', icon: Target, color: 'text-[#4318FF]' },
  { title: 'Giá trị dự kiến', value: '4.2 tỷ', icon: DollarSign, color: 'text-green-500' },
  { title: 'Đang đàm phán', value: '43', icon: Clock, color: 'text-yellow-500' },
  { title: 'Đã chốt', value: '89', icon: Award, color: 'text-purple-500' },
];

const opportunities = [
  { id: 'CH001', name: 'Dự án hệ thống CRM Bắc Bộ', company: 'Cty ABC', value: '350,000,000', probability: '80%', closeDate: '15/03/2026', stage: 'Thương lượng' },
  { id: 'CH002', name: 'Nâng cấp phần mềm kế toán', company: 'Cty XYZ', value: '120,000,000', probability: '60%', closeDate: '20/03/2026', stage: 'Báo giá' },
  { id: 'CH003', name: 'Triển khai ERP toàn quốc', company: 'Tập đoàn MNO', value: '1,200,000,000', probability: '40%', closeDate: '01/04/2026', stage: 'Đề xuất' },
  { id: 'CH004', name: 'Hệ thống quản lý kho', company: 'Kho vận PQR', value: '280,000,000', probability: '90%', closeDate: '10/03/2026', stage: 'Chốt hợp đồng' },
];

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Cơ hội bán hàng</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Theo dõi pipeline bán hàng và cơ hội</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <Target className="w-4 h-4" /> Thêm cơ hội
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Danh sách cơ hội</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Mã</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tên cơ hội</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Công ty</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Giá trị</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Xác suất</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Ngày chốt</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Giai đoạn</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#4318FF]">{o.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{o.name}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{o.company}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{o.value} đ</td>
                  <td className="px-6 py-3">
                    <span className="font-bold text-green-600">{o.probability}</span>
                  </td>
                  <td className="px-6 py-3 text-[#A3AED0]">{o.closeDate}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-600">{o.stage}</span>
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
