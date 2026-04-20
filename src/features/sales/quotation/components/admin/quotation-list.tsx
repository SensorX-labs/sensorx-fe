'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Eye, Edit, Trash2, Search, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { QuoteStatus } from '../../constants/quote-status';
import { ActionType } from '@/shared/constants/action-type';
import { QuoteService } from '../../services/quote-service';
import { QuoteListItem } from '../../models/quote-list-response';
import { cn } from '@/shared/utils/cn';

const statusStyles: Record<string, string> = {
  [QuoteStatus.DRAFT]:   'bg-gray-100 text-gray-500 border-gray-200',
  [QuoteStatus.PENDING]: 'bg-blue-50 text-blue-600 border-blue-100',
  [QuoteStatus.APPROVED]:'bg-green-50 text-green-600 border-green-100',
  [QuoteStatus.RETURNED]:'bg-red-50 text-red-600 border-red-100',
  [QuoteStatus.SENT]:    'bg-indigo-50 text-indigo-600 border-indigo-100',
  [QuoteStatus.ORDERED]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  [QuoteStatus.EXPIRED]: 'bg-gray-50 text-gray-400 border-gray-200',
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
  const [quotes, setQuotes] = useState<QuoteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const quoteService = new QuoteService();
      const result = await quoteService.getListQuotes({ PageIndex: 1, PageSize: 50 });
      setQuotes(result.items);
    } catch (error) {
      console.error(">>> Lỗi khi fetch báo giá:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const stats = useMemo(() => [
    { title: 'Tổng báo giá', value: quotes.length.toString(), icon: FileText, color: 'text-[#4318FF]' },
    { title: 'Chờ duyệt', value: quotes.filter(q => q.status === QuoteStatus.PENDING).length.toString(), icon: FileText, color: 'text-yellow-500' },
    { title: 'Đã duyệt', value: quotes.filter(q => q.status === QuoteStatus.APPROVED).length.toString(), icon: FileText, color: 'text-green-500' },
    { title: 'Bị từ chối', value: quotes.filter(q => q.status === QuoteStatus.RETURNED).length.toString(), icon: FileText, color: 'text-red-400' },
  ], [quotes]);

  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
        const matchesSearch = 
            q.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
  }, [quotes, searchTerm, statusFilter]);

  const goTo = (id: string, action: ActionType) => {
    router.push(`/sales/quotations/${id}?action=${action}`);
  };

  const goToCreate = () => {
    router.push(`/sales/quotations/new?action=${ActionType.CREATE}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold admin-title uppercase">Quản lý Báo giá</h2>
        <Button onClick={goToCreate} className="admin-btn-primary rounded h-10 px-6">
          <FileText className="w-4 h-4 mr-2" /> Tạo báo giá mới
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.title} className="border-none shadow-sm bg-white rounded">
            <CardContent className="p-2.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#2B3674]">{s.value}</p>
                <p className="text-xs font-semibold text-[#A3AED0]">{s.title}</p>
              </div>
              <div className="w-8 h-8 rounded bg-[#F4F7FE] flex items-center justify-center">
                <s.icon className={`w-4 h-4 ${s.color}`} />
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

        <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left px-6 py-4 tracking-label uppercase">Số BG</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Khách hàng</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Ngày tạo</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">Kiểu</th>
                <th className="text-right px-6 py-4 tracking-label uppercase">Tổng tiền</th>
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
                    <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">{q.code}</td>
                    <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{q.companyName}</div>
                    <p className="text-[10px] text-gray-500 font-normal mt-0.5 uppercase tracking-wider">{q.recipientName}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{new Date(q.quoteDate).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 text-center">
                    <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest",
                        q.parentId ? 'border-purple-200 text-purple-600 bg-purple-50' : 'border-blue-200 text-blue-600 bg-blue-50'
                    )}>
                        {q.parentId ? 'Cập nhật' : 'Mới'}
                    </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-right">{q.totalAmount?.toLocaleString('vi-VN')} đ</td>
                    <td className="px-6 py-4 text-center">
                    <span className={cn(
                        "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                        statusStyles[q.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'
                    )}>
                        {statusLabels[q.status]}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 pr-4">
                        <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        onClick={() => goTo(q.id, ActionType.DETAIL)}
                        >
                        <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-yellow-600 hover:bg-yellow-50"
                        onClick={() => goTo(q.id, ActionType.UPDATE)}
                        >
                        <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                        >
                        <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {loading && (
                <div className="py-20 text-center animate-pulse text-blue-600 font-medium tracking-widest uppercase text-xs">
                    Đang tải dữ liệu...
                </div>
            )}
            {!loading && filteredQuotes.length === 0 && (
                <div className="py-20 text-center text-gray-400 uppercase tracking-widest text-xs">
                    Không tìm thấy báo giá nào
                </div>
            )}
        </div>
      </div>
    </div>
  );
}