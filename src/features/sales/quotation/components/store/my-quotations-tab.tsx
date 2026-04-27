'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle2, ChevronRight, Search, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';
import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';
import { useUser } from '@/shared/hooks/use-user';
import { QuoteService } from '../../services/quote-service';
import CustomerService from '@/features/user/customer/services/customer-service';
import { QuoteListItem } from '../../models/quote-list-response';

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  [QuoteStatus.SENT]: {
    label: 'Đã gửi khách',
    icon: CheckCircle2,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [QuoteStatus.PENDING]: {
    label: 'Chờ xử lý',
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  [QuoteStatus.APPROVED]: {
    label: 'Đã duyệt',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  [QuoteStatus.ORDERED]: {
    label: 'Đã đặt hàng',
    icon: CheckCircle2,
    className: 'bg-[var(--brand-green)]/10 text-[var(--brand-green)] border-[var(--brand-green)]/20',
  },
  [QuoteStatus.EXPIRED]: {
    label: 'Hết hạn',
    icon: Clock,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  [QuoteStatus.RETURNED]: {
    label: 'Bị từ chối',
    icon: CheckCircle2,
    className: 'bg-red-50 text-red-700 border-red-200',
  }
};

export function MyQuotationsTab({ onViewDetail }: { onViewDetail?: (id: string) => void }) {
  const { user } = useUser();
  const [quotes, setQuotes] = useState<QuoteListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    const fetchQuotes = async () => {
      try {
        setLoading(true);
        // 1. Lấy thông tin khách hàng
        const customerResponse = await CustomerService.getDetailCustomerByAccountId(user.id);
        if (customerResponse.isSuccess && customerResponse.value) {
          const customerId = customerResponse.value.id;

          // 2. Lấy danh sách báo giá theo customerId
          const response = await QuoteService.getListQuotes({
            customerId: customerId,
            pageNumber: 1,
            pageSize: 50
          });

          if (response.isSuccess && response.value) {
            setQuotes(response.value.items);
          }
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [user]);

  const filteredQuotes = quotes.filter(q => 
    q.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.companyName && q.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="tracking-title-lg">Báo giá của tôi</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã báo giá..."
            className="pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all w-80 btn-tracking uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="meta-label uppercase tracking-widest text-gray-400">Đang tải báo giá...</p>
          </div>
        ) : filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote) => {
            const config = statusConfig[quote.status] || {
              label: quote.status,
              icon: Clock,
              className: 'bg-gray-50 text-gray-700 border-gray-200'
            };

            return (
              <div
                key={quote.id}
                className="group border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-200 cursor-pointer shadow-sm"
                onClick={() => onViewDetail?.(quote.id)}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-4">
                        <span className="tracking-title text-sm">{quote.code}</span>
                        <span className={cn("px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border flex items-center gap-1", config.className)}>
                          <config.icon className="w-2.5 h-2.5" />
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="meta-label uppercase text-gray-400">
                          {quote.itemCount} Sản phẩm
                        </span>
                        <span className="meta-label uppercase font-bold text-gray-900">
                          {quote.grandTotal.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="tracking-label uppercase text-gray-400 mb-0.5 !text-[10px]">Ngày báo giá</p>
                      <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        {new Date(quote.quoteDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900 group/btn btn-tracking">
                      <span>Chi tiết</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center bg-white border border-dashed border-gray-100">
            <FileText className="w-12 h-12 text-gray-100 mx-auto mb-4" />
            <p className="meta-label uppercase text-gray-400">Bạn chưa có báo giá nào.</p>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="px-10 py-3 border border-gray-900 text-[10px] font-bold uppercase btn-tracking hover:bg-gray-900 hover:text-white transition-all duration-300">
          Xem thêm lịch sử
        </button>
      </div>
    </div>
  );
}