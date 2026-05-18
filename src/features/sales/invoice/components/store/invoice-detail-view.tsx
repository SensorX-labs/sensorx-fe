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
  Loader2
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { InvoiceStatus } from '../../enums/invoice-status';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  [InvoiceStatus.Unpaid]: {
    label: 'Chờ thanh toán',
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  [InvoiceStatus.PartiallyPaid]: {
    label: 'Thanh toán một phần',
    icon: Wallet,
    className: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  [InvoiceStatus.Paid]: {
    label: 'Đã thanh toán',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  [InvoiceStatus.Issued]: {
    label: 'Đã phát hành',
    icon: FileText,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [InvoiceStatus.Cancelled]: {
    label: 'Đã hủy',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
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
      <div className="py-24 text-center bg-white border border-dashed border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300 mx-auto mb-4" />
        <p className="meta-label uppercase">Đang tải chi tiết hóa đơn...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="py-24 text-center bg-white border border-dashed border-gray-100">
        <p className="meta-label uppercase mb-6">Không tìm thấy hóa đơn.</p>
        <button onClick={onBack} className="tracking-label uppercase underline underline-offset-4">
          Quay lại danh sách hóa đơn
        </button>
      </div>
    );
  }

  const config = statusConfig[invoice.status] ?? {
    label: invoice.status,
    icon: Clock,
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  };
  const StatusIcon = config.icon;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-2 tracking-breadcrumb group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách hóa đơn
        </button>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-8 py-2.5 border border-gray-900 tracking-label uppercase btn-tracking transition-all hover:bg-gray-900 hover:text-white !text-[10px]">
            <Download className="w-4 h-4" />
            Tải hóa đơn (PDF)
          </button>
        </div>
      </div>

      <div className="bg-white p-10 border border-gray-100">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h1 className="tracking-title-xl">{invoice.code}</h1>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <span className="tracking-label uppercase whitespace-nowrap">
                Ngày lập: <span className="text-gray-900">{new Date(invoice.issueAt).toLocaleString('vi-VN')}</span>
              </span>
              <span className="tracking-label uppercase whitespace-nowrap">
                Đơn hàng: <span className="text-gray-900">{invoice.orderId}</span>
              </span>
            </div>
          </div>
          <div className={cn("px-6 py-2 border-2 tracking-label uppercase font-bold text-[11px] whitespace-nowrap flex items-center gap-2", config.className)}>
            <StatusIcon className="w-4 h-4" />
            {config.label}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100">
        <div className="px-10 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <h3 className="tracking-title uppercase text-lg">Danh sách hàng hóa</h3>
          </div>
        </div>

        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-100 uppercase">
              <th className="px-10 py-5 tracking-label border-r border-gray-50 w-[46%]">Sản phẩm</th>
              <th className="px-4 py-5 tracking-label border-r border-gray-50 text-center w-[10%]">SL</th>
              <th className="px-8 py-5 tracking-label border-r border-gray-50 text-right w-[14%]">Đơn giá</th>
              <th className="px-8 py-5 tracking-label border-r border-gray-50 text-right w-[10%]">Thuế</th>
              <th className="px-10 py-5 tracking-label text-right w-[20%] bg-gray-50/30">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={item.id ?? idx} className={cn("border-b border-gray-50 last:border-0", idx % 2 === 1 && "bg-gray-50/30")}>
                <td className="px-10 py-6">
                  <div className="space-y-1">
                    <p className="breadcrumb-text uppercase">{item.productName}</p>
                    <span className="px-2 py-0.5 bg-gray-100 meta-label uppercase text-[9px] font-bold tracking-widest">{item.productId.slice(0, 8)}</span>
                  </div>
                </td>
                <td className="px-4 py-6 text-center qty-label">{item.quantity}</td>
                <td className="px-8 py-6 text-right meta-label font-bold">{formatMoney(item.unitPrice)}</td>
                <td className="px-8 py-6 text-right meta-label font-bold">{item.taxRate}%</td>
                <td className="px-10 py-6 text-right qty-label bg-gray-50/20 text-base">{formatMoney(item.totalLineAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end p-10 border-t border-gray-100">
          <div className="w-96 space-y-5">
            <div className="flex justify-between meta-label uppercase">
              <span className="text-gray-400 font-bold">Tiền hàng:</span>
              <span className="qty-label">{formatMoney(invoice.subTotal)}</span>
            </div>
            <div className="flex justify-between meta-label uppercase">
              <span className="text-gray-400 font-bold">Thuế GTGT:</span>
              <span className="qty-label">{formatMoney(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between meta-label uppercase">
              <span className="text-gray-400 font-bold">Đã thanh toán:</span>
              <span className="qty-label">{formatMoney(invoice.amountPaid)}</span>
            </div>
            <div className="flex justify-between pt-6 border-t-2 border-gray-900 items-baseline">
              <span className="tracking-label uppercase text-sm">Tổng:</span>
              <span className="tracking-title-xl text-3xl text-brand-green tracking-tighter">
                {formatMoney(invoice.grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-10 border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <Building2 className="w-4 h-4 text-gray-400" />
            <h4 className="tracking-label uppercase">Thông tin xuất hóa đơn</h4>
          </div>
          <div className="space-y-4 pt-2">
            <div>
              <p className="breadcrumb-text uppercase text-xl mb-1">{invoice.companyName}</p>
              <p className="meta-label uppercase text-[#B48F4E]">{invoice.taxCode}</p>
            </div>
            <div className="space-y-3 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-300" />
                <span className="meta-label underline decoration-gray-100 underline-offset-4 lowercase">{invoice.email}</span>
              </div>
              <div className="qty-label font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4 lowercase first-letter:uppercase">
                {invoice.address}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <Wallet className="w-4 h-4 text-gray-400" />
            <h4 className="tracking-label uppercase">Thanh toán</h4>
          </div>
          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <div className="flex justify-between meta-label uppercase">
                <span>Đã thu</span>
                <span className="qty-label">{formatMoney(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between meta-label uppercase">
                <span>Còn lại</span>
                <span className="qty-label">{formatMoney(invoice.grandTotal - invoice.amountPaid)}</span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-50">
              <p className="tracking-label uppercase text-gray-400 mb-3">Nội dung chuyển khoản</p>
              <p className="meta-label break-all">{invoice.expectedTransferSyntax || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
