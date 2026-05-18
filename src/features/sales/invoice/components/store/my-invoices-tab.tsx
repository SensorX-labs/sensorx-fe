'use client';

import React from 'react';
import { FileText, ChevronRight, Search, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';
import { InvoiceStatus } from '../../enums/invoice-status';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';
import { OrderService } from '@/features/sales/order/services/order-service';

interface MyInvoicesTabProps {
  onViewDetail?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  [InvoiceStatus.Unpaid]: {
    label: 'Chua thanh toan',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  [InvoiceStatus.PartiallyPaid]: {
    label: 'Thanh toan mot phan',
    className: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  [InvoiceStatus.Paid]: {
    label: 'Da thanh toan',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  [InvoiceStatus.Issued]: {
    label: 'Da phat hanh',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [InvoiceStatus.Cancelled]: {
    label: 'Da huy',
    className: 'bg-red-50 text-red-700 border-red-200',
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
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="tracking-title-lg">Hóa đơn của tôi</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã hóa đơn..."
            className="pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all w-80 btn-tracking uppercase"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center bg-white border border-dashed border-gray-100">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300 mx-auto mb-4" />
            <p className="meta-label uppercase">Đang tải hóa đơn...</p>
          </div>
        ) : filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => {
            const config = statusConfig[invoice.status] ?? {
              label: invoice.status,
              className: 'bg-gray-50 text-gray-600 border-gray-200',
            };

            return (
              <div
                key={invoice.id}
                className="group border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-200 cursor-pointer shadow-sm"
                onClick={() => onViewDetail?.(invoice.id)}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-4">
                        <span className="tracking-title text-sm">{invoice.code}</span>
                        <span className={cn(
                          "px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border",
                          config.className
                        )}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="meta-label uppercase text-gray-400">
                          Ngày lập: {new Date(invoice.issueAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="meta-label uppercase text-gray-400">
                          Đơn hàng: {invoice.orderId.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="tracking-label uppercase text-gray-400 mb-0.5 !text-[10px]">Tổng cộng</p>
                      <p className="qty-label !text-lg !text-gray-900">
                        {invoice.grandTotal.toLocaleString('vi-VN')}
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
            <p className="meta-label uppercase">Bạn chưa có hóa đơn nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
