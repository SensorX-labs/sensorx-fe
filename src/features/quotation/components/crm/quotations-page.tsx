'use client';

import React from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng báo giá', value: '318', icon: FileText, color: 'text-[#4318FF]' },
  { title: 'Chờ phản hồi', value: '54', icon: Clock, color: 'text-yellow-500' },
  { title: 'Đã chấp nhận', value: '201', icon: CheckCircle, color: 'text-green-500' },
  { title: 'Bị từ chối', value: '63', icon: XCircle, color: 'text-red-400' },
];

const quotations = [
  { id: 'BG001', customer: 'Cty TNHH Minh Phát', date: '01/03/2026', items: 5, total: '45,600,000', validUntil: '15/03/2026', status: 'Chờ phản hồi' },
  { id: 'BG002', customer: 'Doanh nghiệp Thiên Long', date: '28/02/2026', items: 3, total: '28,400,000', validUntil: '14/03/2026', status: 'Chấp nhận' },
  { id: 'BG003', customer: 'Cty CP Bình Minh', date: '27/02/2026', items: 8, total: '112,000,000', validUntil: '13/03/2026', status: 'Chờ phản hồi' },
  { id: 'BG004', customer: 'HTX Phú Thịnh', date: '25/02/2026', items: 2, total: '18,200,000', validUntil: '11/03/2026', status: 'Từ chối' },
  { id: 'BG005', customer: 'Cty TNHH Vĩnh Phúc', date: '24/02/2026', items: 6, total: '76,800,000', validUntil: '10/03/2026', status: 'Chấp nhận' },
];

const statusColor: Record<string, string> = {
  'Chờ phản hồi': 'bg-yellow-100 text-yellow-600',
  'Chấp nhận': 'bg-green-100 text-green-600',
  'Từ chối': 'bg-red-100 text-red-400',
};

export default function QuotationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Báo giá</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý các báo giá gửi cho khách hàng</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4318FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3311CC] transition-colors">
          <FileText className="w-4 h-4" /> Tạo báo giá
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
          <CardTitle className="text-base font-bold text-[#2B3674]">Danh sách báo giá</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Số BG</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Khách hàng</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Ngày tạo</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Số sản phẩm</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Tổng tiền</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Hạn hiệu lực</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-[#A3AED0] uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#4318FF]">{q.id}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{q.customer}</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{q.date}</td>
                  <td className="px-6 py-3 text-center text-[#A3AED0]">{q.items}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">{q.total} đ</td>
                  <td className="px-6 py-3 text-[#A3AED0]">{q.validUntil}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[q.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {q.status}
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
