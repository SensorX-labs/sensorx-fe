'use client';

import React from 'react';
import { FileText, ChevronRight, Search, Loader2, Receipt } from 'lucide-react';
import { cn } from '@/shared/utils';
import { InvoiceStatus } from '../../enums/invoice-status';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';
import { OrderService } from '@/features/sales/order/services/order-service';

interface MyInvoicesTabProps {
  onViewDetail?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; className: string; accentColor: string }> = {
  [InvoiceStatus.Unpaid]: {
    label: 'Chưa thanh toán',
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    accentColor: 'bg-amber-500',
  },
  [InvoiceStatus.PartiallyPaid]: {
    label: 'Thanh toán một phần',
    className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30',
    accentColor: 'bg-orange-500',
  },
  [InvoiceStatus.Paid]: {
    label: 'Đã thanh toán',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    accentColor: 'bg-emerald-500',
  },
  [InvoiceStatus.Issued]: {
    label: 'Đã phát hành',
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
    accentColor: 'bg-blue-500',
  },
  [InvoiceStatus.Cancelled]: {
    label: 'Đã hủy',
    className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
    accentColor: 'bg-rose-500',
  }
};

export function MyInvoicesTab({ onViewDetail }: MyInvoicesTabProps) {
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchInvoices = React.useCallback(async () => {
    setLoading(true);
    try {
      const ordersResponse = await OrderService.getMyOrders({
        pageNumber: 1,
        pageSize: 100,
      });

      const orderIds = (ordersResponse?.items ?? []).map(order => order.id);
      const invoiceResponses = await Promise.allSettled(
        orderIds.map(orderId => InvoiceService.getInvoiceByOrderId(orderId))
      );

      const resolvedInvoices = invoiceResponses
        .filter((result): result is PromiseFulfilledResult<Invoice> => result.status === 'fulfilled')
        .map(result => result.value);

      setInvoices(resolvedInvoices);
    } catch (error) {
      console.error('>>> Loi khi fetch hoa don client:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = React.useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return invoices.filter(invoice =>
      invoice.code.toLowerCase().includes(normalizedSearch) ||
      invoice.companyName.toLowerCase().includes(normalizedSearch) ||
      invoice.orderId.toLowerCase().includes(normalizedSearch)
    );
  }, [invoices, searchTerm]);

  return (
    <div className="space-y-6 font-sans select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400">
          Danh sách hóa đơn ({filteredInvoices.length})
        </h3>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm theo mã hóa đơn, công ty..."
            className="w-full pl-11 pr-4 h-11 bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-full text-xs font-semibold focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all shadow-inner uppercase placeholder:normal-case"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-stone-300 mx-auto mb-4" />
            <p className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">Đang tải danh sách hóa đơn...</p>
          </div>
        ) : filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => {
            const config = statusConfig[invoice.status] ?? {
              label: invoice.status,
              className: 'bg-stone-50 text-stone-600 border-stone-200 dark:bg-zinc-800 dark:text-stone-300',
              accentColor: 'bg-stone-400',
            };

            return (
              <div
                key={invoice.id}
                className="group relative overflow-hidden bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 rounded-2xl cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
                onClick={() => onViewDetail?.(invoice.id)}
              >
                {/* Left accent bar */}
                <div className={cn("absolute left-0 top-0 bottom-0 w-[4px]", config.accentColor)} />

                <div className="flex items-center gap-6 ml-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-heading font-extrabold uppercase tracking-wide text-stone-900 dark:text-white">
                        {invoice.code}
                      </span>
                      <span className={cn(
                        "px-2.5 py-0.5 text-[9px] uppercase font-bold tracking-widest border rounded-full shadow-sm",
                        config.className
                      )}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                      <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400">
                        Ngày lập: {new Date(invoice.issueAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400">
                        Đơn hàng: {invoice.orderId.slice(0, 8)}...
                      </span>
                      {invoice.companyName && (
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-500">
                          {invoice.companyName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10">
                  <div className="text-left md:text-right">
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400 mb-0.5">Tổng cộng</p>
                    <p className="text-lg font-bold text-[#0D9488] dark:text-emerald-400">
                      {invoice.grandTotal.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-white group/btn hover:text-[#0D9488] dark:hover:text-emerald-400 transition-colors">
                    <span>Chi tiết</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <Receipt className="w-12 h-12 text-stone-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">Bạn chưa có hóa đơn nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
