'use client';

import React from 'react';
import { TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng leads', value: '842', icon: TrendingUp, color: 'text-[#4318FF]' },
  { title: 'Đang xử lý', value: '213', icon: Clock, color: 'text-yellow-500' },
  { title: 'Đã chuyển đổi', value: '445', icon: CheckCircle, color: 'text-green-500' },
  { title: 'Thất bại', value: '184', icon: XCircle, color: 'text-red-400' },
];

const leads = [
  { id: 'LD001', name: 'Công ty TNHH Minh Phát', contact: 'Nguyễn Hùng', source: 'Website', value: '45,000,000', stage: 'Liên hệ lần đầu', status: 'Mới' },
  { id: 'LD002', name: 'Doanh nghiệp Thiên Long', contact: 'Trần Linh', source: 'Giới thiệu', value: '120,000,000', stage: 'Đang tư vấn', status: 'Đang xử lý' },
  { id: 'LD003', name: 'Cty CP Bình Minh', contact: 'Lê Tuấn', source: 'Zalo', value: '78,000,000', stage: 'Báo giá', status: 'Đang xử lý' },
  { id: 'LD004', name: 'HTX Phú Thịnh', contact: 'Phạm Hà', source: 'Facebook', value: '32,000,000', stage: 'Thương lượng', status: 'Đang xử lý' },
  { id: 'LD005', name: 'Cty TNHH Vĩnh Phúc', contact: 'Hoàng Nam', source: 'Email', value: '95,000,000', stage: 'Chốt hợp đồng', status: 'Chuyển đổi' },
];

const stageColor: Record<string, string> = {
  'Mới': 'bg-blue-100 text-blue-600',
  'Đang xử lý': 'bg-yellow-100 text-yellow-600',
  'Chuyển đổi': 'bg-green-100 text-green-600',
};

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Tiềm năng (Leads)</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Theo dõi và chuyển đổi khách hàng tiềm năng</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <TrendingUp className="w-4 h-4" /> Thêm lead
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Danh sách leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Mã</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Doanh nghiệp</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Người liên hệ</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Nguồn</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Giá trị</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Giai đoạn</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#4318FF]">{l.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{l.name}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{l.contact}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{l.source}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{l.value} đ</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{l.stage}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stageColor[l.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {l.status}
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
