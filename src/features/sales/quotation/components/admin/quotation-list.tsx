'use client';

import React from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';

const stats = [
  { title: 'Tổng báo giá', value: '318', icon: FileText, color: 'text-[#4318FF]' },
  { title: 'Chờ phản hồi', value: '54', icon: Clock, color: 'text-yellow-500' },
  { title: 'Đã chấp nhận', value: '201', icon: CheckCircle, color: 'text-green-500' },
  { title: 'Bị từ chối', value: '63', icon: XCircle, color: 'text-red-400' },
];

const quotations = [
  { id: 'QT001', customer: 'Cty TNHH Minh Phát', date: '01/03/2026', items: 5, total: '45,600,000', validUntil: '15/03/2026', status: 'Nháp', type: 'Tự động' },
  { id: 'QT002', customer: 'Doanh nghiệp Thiên Long', date: '28/02/2026', items: 3, total: '28,400,000', validUntil: '14/03/2026', status: 'Đã phê duyệt', type: 'Thủ công' },
  { id: 'QT003', customer: 'Cty CP Bình Minh', date: '27/02/2026', items: 8, total: '112,000,000', validUntil: '13/03/2026', status: 'Chờ duyệt', type: 'Tự động' },
  { id: 'QT004', customer: 'HTX Phú Thịnh', date: '25/02/2026', items: 2, total: '18,200,000', validUntil: '11/03/2026', status: 'Từ chối', type: 'Thủ công' },
  { id: 'QT005', customer: 'Cty TNHH Vĩnh Phúc', date: '24/02/2026', items: 6, total: '76,800,000', validUntil: '10/03/2026', status: 'Đã phê duyệt', type: 'Tự động' },
];

const statusStyles: Record<string, string> = {
  'Nháp': 'bg-gray-100 text-gray-600',
  'Chờ duyệt': 'bg-yellow-100 text-yellow-600',
  'Đã phê duyệt': 'bg-green-100 text-green-600',
  'Từ chối': 'bg-red-100 text-red-600',
};

export default function QuotationList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-[#2B3674]">Quản lý Báo giá</h2>
        </div>
        <button className="flex items-center gap-2 admin-btn-primary">
          <FileText className="w-4 h-4" /> Tạo báo giá mới
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="border-none shadow-sm bg-white rounded">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-[#2B3674]">{s.value}</p>
                <p className="text-xs font-semibold text-[#A3AED0] mt-0.5">{s.title}</p>
              </div>
              <div className="w-10 h-10 rounded bg-[#F4F7FE] flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-white rounded">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 admin-table-th">Số BG</th>
                <th className="text-left px-6 py-3 admin-table-th">Khách hàng</th>
                <th className="text-left px-6 py-3 admin-table-th">Ngày tạo</th>
                <th className="text-left px-6 py-3 admin-table-th">Loại phê duyệt</th>
                <th className="text-left px-6 py-3 admin-table-th text-center">Sản phẩm</th>
                <th className="text-left px-6 py-3 admin-table-th">Tổng tiền</th>
                <th className="text-left px-6 py-3 admin-table-th">Hạn hiệu lực</th>
                <th className="text-left px-6 py-3 admin-table-th">Trạng thái</th>
                <th className="text-left px-6 py-3 admin-table-th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold admin-text-primary">{q.id}</td>
                  <td className="px-6 py-3 font-semibold ">{q.customer}</td>
                  <td className="px-6 py-3 ">{q.date}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${q.type === 'Tự động' ? 'border-blue-200 text-blue-600' : 'border-purple-200 text-purple-600'}`}>
                      {q.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center ">{q.items}</td>
                  <td className="px-6 py-3 font-semibold ">{q.total} đ</td>
                  <td className="px-6 py-3 ">{q.validUntil}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[q.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50" title="Chi tiết">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {q.status === 'Nháp' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50" title="Gửi duyệt">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {q.status === 'Chờ duyệt' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50" title="Phê duyệt">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
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
