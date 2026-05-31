'use client';

import React from 'react';
import {
  FileText,
  ChevronLeft,
  Download,
  Clock,
  CheckCircle2,
  Building2,
  Mail,
  Wallet,
  XCircle,
  Loader2,
  Receipt
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { InvoiceStatus } from '../../enums/invoice-status';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  [InvoiceStatus.Unpaid]: {
    label: 'Chờ thanh toán',
    icon: Clock,
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
  },
  [InvoiceStatus.PartiallyPaid]: {
    label: 'Thanh toán một phần',
    icon: Wallet,
    className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30',
  },
  [InvoiceStatus.Paid]: {
    label: 'Đã thanh toán',
    icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
  },
  [InvoiceStatus.Issued]: {
    label: 'Đã phát hành',
    icon: FileText,
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
  },
  [InvoiceStatus.Cancelled]: {
    label: 'Đã hủy',
    icon: XCircle,
    className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
  }
};

const formatMoney = (value?: number) => (value ?? 0).toLocaleString('vi-VN');

export function InvoiceDetailView({ invoiceId, onBack }: { invoiceId: string; onBack: () => void }) {
  const [invoice, setInvoice] = React.useState<Invoice | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const response = await InvoiceService.getInvoiceById(invoiceId);
        setInvoice(response);
      } catch (error) {
        console.error('>>> Loi khi fetch chi tiet hoa don client:', error);
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="py-24 text-center bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300 mx-auto mb-4" />
        <p className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">Đang tải chi tiết hóa đơn...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="py-24 text-center bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-6">
        <p className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">Không tìm thấy hóa đơn.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-white border border-stone-250 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors cursor-pointer shadow-sm"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const config = statusConfig[invoice.status] ?? {
    label: invoice.status,
    icon: Clock,
    className: 'bg-stone-50 text-stone-700 border-stone-200 dark:bg-zinc-850 dark:text-stone-350',
  };
  const StatusIcon = config.icon;

  return (
    <div className="space-y-8 font-sans select-none animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-zinc-800 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-500 hover:text-[#0D9488] font-bold uppercase text-[10px] tracking-widest transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform shrink-0" />
          Quay lại danh sách hóa đơn
        </button>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 h-10 border border-stone-250 hover:border-[#0D9488] bg-white hover:bg-stone-50 text-stone-850 hover:text-[#0D9488] text-[10px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-sm active:scale-95">
            <Download className="w-4 h-4 shrink-0" />
            Tải hóa đơn (PDF)
          </button>
        </div>
      </div>

      {/* Summary Header Card */}
      <div className="bg-[#F9F9FB] dark:bg-zinc-900 p-6 sm:p-8 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm border-l-4 border-l-[#0D9488] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-200/50 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
            <Receipt size={10} /> Chi tiết hóa đơn
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-stone-900 dark:text-white uppercase tracking-wide">
            {invoice.code}
          </h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            <span>
              Ngày lập: <span className="text-stone-700 dark:text-stone-300 font-extrabold">{new Date(invoice.issueAt).toLocaleDateString('vi-VN')}</span>
            </span>
            <span className="hidden sm:inline text-stone-300">|</span>
            <span>
              Đơn hàng: <span className="text-stone-700 dark:text-stone-300 font-mono font-extrabold">{invoice.orderId}</span>
            </span>
          </div>
        </div>
        <div className={cn("px-4 py-2 border text-[10px] font-sans font-bold uppercase tracking-widest rounded-full flex items-center gap-2 shadow-sm self-start sm:self-auto", config.className)}>
          <StatusIcon className="w-3.5 h-3.5 shrink-0" />
          {config.label}
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950 flex items-center gap-3">
          <FileText className="w-4 h-4 text-stone-400" />
          <h3 className="font-heading font-extrabold uppercase text-xs tracking-widest text-stone-900 dark:text-white">
            Danh sách sản phẩm
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-stone-50 dark:bg-zinc-950 border-b border-stone-200 dark:border-zinc-800 uppercase text-[9px] font-sans font-bold tracking-widest text-stone-400">
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-4 py-4 text-center w-20">SL</th>
                <th className="px-6 py-4 text-right w-36">Đơn giá</th>
                <th className="px-6 py-4 text-right w-24">Thuế</th>
                <th className="px-6 py-4 text-right w-36">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150 dark:divide-zinc-850">
              {invoice.items.map((item, idx) => (
                <tr 
                  key={item.id ?? idx} 
                  className="bg-white dark:bg-zinc-900/50 hover:bg-stone-50/50 dark:hover:bg-zinc-850/55 transition-colors font-medium text-stone-800 dark:text-stone-200"
                >
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-stone-900 dark:text-white">{item.productName}</p>
                      <span className="inline-block px-1.5 py-0.5 bg-stone-100 dark:bg-zinc-800 text-stone-500 text-[8px] font-bold tracking-widest font-mono rounded">
                        MÃ: {item.productId.slice(0, 8)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center text-xs font-bold text-stone-900 dark:text-white">{item.quantity}</td>
                  <td className="px-6 py-5 text-right text-xs font-semibold">{formatMoney(item.unitPrice)} đ</td>
                  <td className="px-6 py-5 text-right text-xs font-semibold text-stone-500">{item.taxRate}%</td>
                  <td className="px-6 py-5 text-right text-xs font-bold text-stone-900 dark:text-white bg-stone-50/10">
                    {formatMoney(item.totalLineAmount)} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div className="flex justify-end p-6 bg-white dark:bg-zinc-950 border-t border-stone-200 dark:border-zinc-800">
          <div className="w-80 space-y-3.5 text-xs font-medium text-stone-500">
            <div className="flex justify-between uppercase tracking-wider text-[10px]">
              <span>Tiền hàng:</span>
              <span className="text-stone-900 dark:text-white font-bold">{formatMoney(invoice.subTotal)} đ</span>
            </div>
            <div className="flex justify-between uppercase tracking-wider text-[10px]">
              <span>Thuế GTGT:</span>
              <span className="text-stone-900 dark:text-white font-bold">{formatMoney(invoice.taxAmount)} đ</span>
            </div>
            <div className="flex justify-between uppercase tracking-wider text-[10px]">
              <span>Đã thanh toán:</span>
              <span className="text-[#0D9488] dark:text-emerald-400 font-bold">{formatMoney(invoice.amountPaid)} đ</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-stone-200 dark:border-zinc-800 items-baseline">
              <span className="font-bold uppercase tracking-widest text-[10px] text-stone-950 dark:text-white">Tổng cộng:</span>
              <span className="text-xl font-black text-[#0D9488] dark:text-emerald-400 tracking-tight">
                {formatMoney(invoice.grandTotal)} đ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#F9F9FB] dark:bg-zinc-900 p-6 sm:p-8 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-5 border-t-4 border-t-[#0D9488]">
          <div className="flex items-center gap-3 border-b border-stone-200/60 dark:border-zinc-800 pb-3">
            <Building2 className="w-4 h-4 text-stone-400" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-900 dark:text-white">
              Thông tin xuất hóa đơn
            </h4>
          </div>
          <div className="space-y-4 pt-1">
            <div>
              <p className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-wide">
                {invoice.companyName}
              </p>
              {invoice.taxCode && (
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 font-mono mt-1">
                  MST: {invoice.taxCode}
                </p>
              )}
            </div>
            <div className="space-y-2.5 pt-4 border-t border-stone-150 dark:border-zinc-850">
              {invoice.email && (
                <div className="flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-400">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span className="lowercase">{invoice.email}</span>
                </div>
              )}
              {invoice.address && (
                <div className="text-xs text-stone-650 dark:text-stone-400 leading-relaxed italic border-l-2 border-[#0D9488] pl-3.5">
                  {invoice.address}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#F9F9FB] dark:bg-zinc-900 p-6 sm:p-8 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-5 border-t-4 border-t-[#0D9488]">
          <div className="flex items-center gap-3 border-b border-stone-200/60 dark:border-zinc-800 pb-3">
            <Wallet className="w-4 h-4 text-stone-400" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-900 dark:text-white">
              Thông tin thanh toán
            </h4>
          </div>
          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-500">
                <span className="font-bold">Đã thu:</span>
                <span className="text-[#0D9488] dark:text-emerald-400 font-black">{formatMoney(invoice.amountPaid)} đ</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span className="font-bold">Còn lại cần thu:</span>
                <span className="text-rose-600 dark:text-rose-450 font-black">
                  {formatMoney(invoice.grandTotal - invoice.amountPaid)} đ
                </span>
              </div>
            </div>
            {invoice.expectedTransferSyntax && (
              <div className="pt-4 border-t border-stone-150 dark:border-zinc-850">
                <p className="uppercase text-[9px] font-bold text-stone-400 mb-2 tracking-widest">Nội dung chuyển khoản</p>
                <p className="font-mono font-bold text-xs text-stone-900 dark:text-white bg-white dark:bg-zinc-950 p-3 rounded-xl border border-stone-200 dark:border-zinc-850 break-all select-all shadow-inner">
                  {invoice.expectedTransferSyntax}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
