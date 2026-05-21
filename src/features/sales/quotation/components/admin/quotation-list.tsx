'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Eye, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { QuoteStatus } from '../../constants/quote-status';
import { ActionType } from '@/shared/constants/action-type';
import { QuoteListItem, QuoteService } from '../../services/quote.service';
import { useUser } from '@/shared/hooks/use-user';
import { cn } from '@/shared/utils/cn';
import { QuotationStats } from './quotation-stats';
import { toast } from 'sonner';

const statusStyles: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-500 border-gray-200',
  [QuoteStatus.PENDING]: 'bg-blue-50 text-blue-600 border-blue-100',
  [QuoteStatus.APPROVED]: 'bg-green-50 text-green-600 border-green-100',
  [QuoteStatus.RETURNED]: 'bg-red-50 text-red-600 border-red-100',
  [QuoteStatus.SENT]: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  [QuoteStatus.ORDERED]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  [QuoteStatus.EXPIRED]: 'bg-gray-50 text-gray-400 border-gray-200',
};

const statusLabels: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: 'Nháp',
  [QuoteStatus.PENDING]: 'Chờ duyệt',
  [QuoteStatus.APPROVED]: 'Đã phê duyệt',
  [QuoteStatus.RETURNED]: 'Từ chối',
  [QuoteStatus.SENT]: 'Đã gửi khách',
  [QuoteStatus.ORDERED]: 'Đã sinh đơn',
  [QuoteStatus.EXPIRED]: 'Hết hạn',
};

export default function QuotationList() {
  const router = useRouter();
  const { user } = useUser();
  const [quotes, setQuotes] = useState<QuoteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'ALL'>('ALL');

  const fetchData = async (status: QuoteStatus | 'ALL', search: string) => {
    setLoading(true);
    try {
      const res = await QuoteService.getListQuotes({
        pageNumber: 1,
        pageSize: 50,
        status: status === 'ALL' ? undefined : status,
        searchTerm: search || undefined,
      });
      if (res) setQuotes(res.items);
    } catch (error: any) {
      console.error('>>> Lỗi khi fetch báo giá:', error);
    } finally {
      setLoading(false);
    }
  };

  // debounce 300ms cho search; status filter thay ngay
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(statusFilter, searchTerm);
    }, searchTerm ? 300 : 0);
    return () => clearTimeout(timer);
  }, [statusFilter, searchTerm]);



  const goTo = (id: string, action: ActionType) => {
    router.push(`/sales/quotations/${id}?action=${action}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa báo giá này?')) return;
    try {
      await QuoteService.deleteQuote(id);
      toast.success('Đã xóa báo giá');
      fetchData(statusFilter, searchTerm);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa báo giá');
    }
  };

  return (
    <div className="space-y-4">
      <QuotationStats
        statusFilter={statusFilter}
        onFilter={setStatusFilter}
        role={user?.role}
      />

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm số BG, công ty..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | 'ALL')}
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
                <th className="text-left px-6 py-4 tracking-label uppercase">Ngày báo giá</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">Số lượng SP</th>
                <th className="text-right px-6 py-4 tracking-label uppercase">Tổng tiền</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">Trạng thái</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">Ngày tạo</th>
                <th className="text-right px-6 py-4 tracking-label uppercase pr-10">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr
                  key={q.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">{q.code}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{q.companyName}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {q.quoteDate ? new Date(q.quoteDate).toLocaleDateString('vi-VN') : '---'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {q.itemCount}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 text-right">{q.grandTotal?.toLocaleString('vi-VN')} đ</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                      statusStyles[q.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'
                    )}>
                      {statusLabels[q.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{q.createdAt ? new Date(q.createdAt).toLocaleDateString('vi-VN') : '---'}</td>
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
                      {q.status === QuoteStatus.DRAFT && (
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(q.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
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
          {!loading && quotes.length === 0 && (
            <div className="py-20 text-center text-gray-400 uppercase tracking-widest text-xs">
              Không tìm thấy báo giá nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}