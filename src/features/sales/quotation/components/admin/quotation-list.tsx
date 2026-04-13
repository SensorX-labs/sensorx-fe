'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Clock, CheckCircle, XCircle, Eye, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { MOCK_QUOTES } from '../../mocks/quote-mocks';
import { QuoteStatus } from '../../constants/quote-status';
import { ActionType } from '@/shared/constants/action-type';

const stats = [
  { title: 'Tổng báo giá', value: MOCK_QUOTES.length.toString(), icon: FileText, color: 'text-[#4318FF]' },
  { title: 'Chờ duyệt', value: MOCK_QUOTES.filter(q => q.status === QuoteStatus.PENDING).length.toString(), icon: Clock, color: 'text-yellow-500' },
  { title: 'Đã duyệt', value: MOCK_QUOTES.filter(q => q.status === QuoteStatus.APPROVED).length.toString(), icon: CheckCircle, color: 'text-green-500' },
  { title: 'Bị từ chối', value: MOCK_QUOTES.filter(q => q.status === QuoteStatus.RETURNED).length.toString(), icon: XCircle, color: 'text-red-400' },
];

const statusStyles: Record<string, string> = {
  [QuoteStatus.DRAFT]:   'bg-gray-100 text-gray-600',
  [QuoteStatus.PENDING]: 'bg-yellow-100 text-yellow-600',
  [QuoteStatus.APPROVED]:'bg-green-100 text-green-600',
  [QuoteStatus.RETURNED]:'bg-red-100 text-red-600',
  [QuoteStatus.SENT]:    'bg-blue-100 text-blue-600',
  [QuoteStatus.ORDERED]: 'bg-purple-100 text-purple-600',
  [QuoteStatus.EXPIRED]: 'bg-gray-100 text-gray-400',
};

const statusLabels: Record<string, string> = {
  [QuoteStatus.DRAFT]:   'Nháp',
  [QuoteStatus.PENDING]: 'Chờ duyệt',
  [QuoteStatus.APPROVED]:'Đã phê duyệt',
  [QuoteStatus.RETURNED]:'Từ chối',
  [QuoteStatus.SENT]:    'Đã gửi khách',
  [QuoteStatus.ORDERED]: 'Đã sinh đơn',
  [QuoteStatus.EXPIRED]: 'Hết hạn',
};

export default function QuotationList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredQuotes = MOCK_QUOTES.filter(q => {
    const matchesSearch = 
      q.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerInfo.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerInfo.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const goTo = (id: string, action: ActionType) => {
    router.push(`/sales/quotations/${id}?action=${action}`);
  };

  const goToCreate = () => {
    router.push(`/sales/quotations/new?action=${ActionType.CREATE}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#2B3674]">Quản lý Báo giá</h2>
        <button onClick={goToCreate} className="flex items-center gap-2 admin-btn-primary">
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

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm số BG, công ty, người liên hệ..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white text-gray-600"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Số BG</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Khách hàng</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Ngày tạo</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Loại</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Tổng tiền</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Trạng thái</th>
              <th className="text-right px-6 py-4 tracking-label uppercase pr-10">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map((q) => (
              <tr
                key={q.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors"
              >
                <td className="px-6 py-4 font-bold text-gray-900">{q.code}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{q.customerInfo.companyName}</div>
                  <p className="text-[10px] text-gray-500 font-normal mt-0.5">LH: {q.customerInfo.recipientName}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">{new Date(q.quoteDate).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${q.parentId ? 'border-purple-200 text-purple-600' : 'border-blue-200 text-blue-600'}`}>
                    {q.parentId ? 'Cập nhật' : 'Mới'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">- đ</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[q.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {statusLabels[q.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 pr-4">
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      title="Chi tiết"
                      onClick={() => goTo(q.id, ActionType.DETAIL)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      title="Chỉnh sửa"
                      onClick={() => goTo(q.id, ActionType.UPDATE)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}