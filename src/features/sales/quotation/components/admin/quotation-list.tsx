'use client';

import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { MOCK_QUOTES } from '../../mocks/quote-mocks';
import { QuoteStatus } from '../../constants/quote-status';
import QuotationDetail from './quotation-detail';

const stats = [
  { title: 'Tổng báo giá', value: MOCK_QUOTES.length.toString(), icon: FileText, color: 'text-[#4318FF]' },
  { title: 'Chờ duyệt', value: MOCK_QUOTES.filter(q => q.status === QuoteStatus.PENDING).length.toString(), icon: Clock, color: 'text-yellow-500' },
  { title: 'Đã duyệt', value: MOCK_QUOTES.filter(q => q.status === QuoteStatus.APPROVED).length.toString(), icon: CheckCircle, color: 'text-green-500' },
  { title: 'Bị từ chối', value: MOCK_QUOTES.filter(q => q.status === QuoteStatus.RETURNED).length.toString(), icon: XCircle, color: 'text-red-400' },
];

const statusStyles: Record<string, string> = {
  [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-600',
  [QuoteStatus.PENDING]: 'bg-yellow-100 text-yellow-600',
  [QuoteStatus.APPROVED]: 'bg-green-100 text-green-600',
  [QuoteStatus.RETURNED]: 'bg-red-100 text-red-600',
  [QuoteStatus.SENT]: 'bg-blue-100 text-blue-600',
  [QuoteStatus.ORDERED]: 'bg-purple-100 text-purple-600',
  [QuoteStatus.EXPIRED]: 'bg-gray-100 text-gray-400',
};

const statusLabels: Record<string, string> = {
  [QuoteStatus.DRAFT]: 'Nháp',
  [QuoteStatus.PENDING]: 'Chờ duyệt',
  [QuoteStatus.APPROVED]: 'Đã phê duyệt',
  [QuoteStatus.RETURNED]: 'Từ chối',
  [QuoteStatus.SENT]: 'Đã gửi khách',
  [QuoteStatus.ORDERED]: 'Đã sinh đơn',
  [QuoteStatus.EXPIRED]: 'Hết hạn',
};

export default function QuotationList() {
  const [viewDetailId, setViewDetailId] = useState<string | null>(null);

  if (viewDetailId) {
    return (
      <QuotationDetail 
        id={viewDetailId} 
        onBack={() => setViewDetailId(null)} 
      />
    );
  }

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
                <th className="text-left px-6 py-3 admin-table-th text-center">Loại</th>
                <th className="text-left px-6 py-3 admin-table-th">Tổng tiền</th>
                <th className="text-left px-6 py-3 admin-table-th text-center">Trạng thái</th>
                <th className="text-left px-6 py-3 admin-table-th text-right pr-10">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_QUOTES.map((q) => (
                <tr 
                  key={q.id} 
                  className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors cursor-pointer"
                  onClick={() => setViewDetailId(q.id)}
                >
                  <td className="px-6 py-3 font-semibold admin-text-primary">{q.code}</td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">
                    <div>
                      {q.customerInfo.companyName}
                      <p className="text-[10px] text-gray-400 font-normal">LH: {q.customerInfo.recipientName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 ">{new Date(q.quoteDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${q.parentId ? 'border-purple-200 text-purple-600' : 'border-blue-200 text-blue-600'}`}>
                      {q.parentId ? 'Cập nhật' : 'Mới'}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-semibold text-[#2B3674]">- đ</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[q.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {statusLabels[q.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2 pr-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50" title="Chi tiết">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {q.status === QuoteStatus.DRAFT && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50" title="Gửi duyệt">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {q.status === QuoteStatus.PENDING && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50" title="Phê duyệt">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-50" title="Chỉnh sửa">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
