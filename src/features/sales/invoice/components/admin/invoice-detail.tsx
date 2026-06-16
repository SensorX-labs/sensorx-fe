'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, CircleDollarSign, FileText, Receipt, Wallet, QrCode } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { cn } from '@/shared/utils/cn';
import { InvoiceStatus } from '../../enums/invoice-status';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';
import { PaymentQrModal } from '@/features/store/Components/transactions/payment-qr-modal';

interface InvoiceDetailProps {
  id: string;
}

const statusStyles: Record<string, string> = {
  [InvoiceStatus.Unpaid]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  [InvoiceStatus.PartiallyPaid]: 'bg-orange-50 text-orange-700 border-orange-200',
  [InvoiceStatus.Paid]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [InvoiceStatus.Issued]: 'bg-blue-50 text-blue-700 border-blue-200',
  [InvoiceStatus.Cancelled]: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabels: Record<string, string> = {
  [InvoiceStatus.Unpaid]: 'Chờ thanh toán',
  [InvoiceStatus.PartiallyPaid]: 'Thanh toán một phần',
  [InvoiceStatus.Paid]: 'Đã thanh toán',
  [InvoiceStatus.Issued]: 'Đã phát hành',
  [InvoiceStatus.Cancelled]: 'Đã hủy',
};

const formatMoney = (value?: number) => `${(value ?? 0).toLocaleString('vi-VN')} đ`;

export default function InvoiceDetail({ id }: InvoiceDetailProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const response = await InvoiceService.getInvoiceById(id);
        setInvoice(response);
      } catch (error) {
        console.error('>>> Lỗi khi lấy chi tiết hóa đơn:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const items = useMemo(() => invoice?.items ?? [], [invoice]);

  const remaining = useMemo(() => {
    if (!invoice) return 0;
    return Math.max(0, invoice.grandTotal - invoice.amountPaid);
  }, [invoice]);

  const excess = useMemo(() => {
    if (!invoice) return 0;
    return Math.max(0, invoice.amountPaid - invoice.grandTotal);
  }, [invoice]);

  const qrUrl = useMemo(() => {
    if (!invoice) return '';
    const des = invoice.expectedTransferSyntax || invoice.code;
    return `https://qr.sepay.vn/img?acc=0374295407&bank=MB&amount=${Math.round(remaining)}&des=${encodeURIComponent(des)}&template=null&download=false`;
  }, [invoice, remaining]);

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse text-blue-600 font-medium tracking-widest uppercase text-xs">
        Đang tải dữ liệu
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Không tìm thấy thông tin hóa đơn.</p>
        <Link href="/sales/invoices">
          <Button variant="link">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold admin-title uppercase">Chi tiết hóa đơn</h2>
          <span className={cn(
            "px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider",
            statusStyles[invoice.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'
          )}>
            {statusLabels[invoice.status] ?? invoice.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status !== InvoiceStatus.Paid && invoice.status !== InvoiceStatus.Cancelled && (
            <Button
              onClick={() => setIsQrOpen(true)}
              className="rounded bg-brand-green hover:bg-brand-green-hover text-white uppercase tracking-widest text-[10px] font-bold"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR thanh toán
            </Button>
          )}
          <Link href="/sales/invoices">
            <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              <h4 className="text-sm font-medium uppercase tracking-wider">Thông tin hóa đơn</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Mã hóa đơn</td>
                  <td className="px-6 py-3 font-bold">{invoice.code}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Đơn hàng</td>
                  <td className="px-6 py-3">
                    <Link href={`/sales/orders/${invoice.orderId}`} className="text-blue-600 hover:underline">
                      {invoice.orderId}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Ngày lập</td>
                  <td className="px-6 py-3">{new Date(invoice.issueAt).toLocaleString('vi-VN')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Ký hiệu</td>
                  <td className="px-6 py-3">{invoice.invoiceSymbol || '-'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Số hóa đơn</td>
                  <td className="px-6 py-3">{invoice.invoiceNumber || '-'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Mã CQT</td>
                  <td className="px-6 py-3">{invoice.taxAuthorityCode || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <h4 className="text-sm font-medium uppercase tracking-wider">Thông tin xuất hóa đơn</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Công ty</td>
                  <td className="px-6 py-3 break-words">{invoice.companyName}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
                  <td className="px-6 py-3 lowercase">{invoice.email}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Địa chỉ</td>
                  <td className="px-6 py-3">{invoice.address}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">MST</td>
                  <td className="px-6 py-3 tracking-widest uppercase">{invoice.taxCode}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <h4 className="text-sm font-medium uppercase tracking-wider">Thanh toán</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Đã thu</td>
                  <td className="px-6 py-3 font-bold">{formatMoney(invoice.amountPaid)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Còn lại</td>
                  <td className="px-6 py-3 font-bold">{formatMoney(remaining)}</td>
                </tr>
                {excess > 0 && (
                  <tr>
                    <td className="px-6 py-3 admin-text-primary font-semibold text-emerald-600">Tiền thừa</td>
                    <td className="px-6 py-3 font-bold text-emerald-600">{formatMoney(excess)}</td>
                  </tr>
                )}
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Nội dung CK</td>
                  <td className="px-6 py-3 break-all text-xs">{invoice.expectedTransferSyntax || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <h4 className="text-sm font-medium uppercase tracking-wider">Danh mục hàng hóa</h4>
              </div>
              <span className="text-xs font-semibold text-gray-500">{items.length} dòng hàng</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 uppercase">
                    <th className="px-6 py-3 text-left admin-table-th">Sản phẩm</th>
                    <th className="px-4 py-3 text-center admin-table-th">DVT</th>
                    <th className="px-4 py-3 text-center admin-table-th w-24">SL</th>
                    <th className="px-6 py-3 text-right admin-table-th w-32">Đơn giá</th>
                    <th className="px-6 py-3 text-right admin-table-th w-24">Thuế</th>
                    <th className="px-6 py-3 text-right admin-table-th">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{item.productName}</td>
                      <td className="px-4 py-4 text-center">{item.unit}</td>
                      <td className="px-4 py-4 text-center font-semibold">{item.quantity}</td>
                      <td className="px-6 py-4 text-right">{formatMoney(item.unitPrice)}</td>
                      <td className="px-6 py-4 text-right">{item.taxRate}%</td>
                      <td className="px-6 py-4 text-right font-bold">{formatMoney(item.totalLineAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50/30 border-t border-gray-100">
              <div className="ml-auto w-full md:w-80 space-y-3">
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <span>ổng tiền hàng:</span>
                  <span>{formatMoney(invoice.subTotal)}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <span>Thuế GTGT:</span>
                  <span>{formatMoney(invoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <span>Đã thu:</span>
                  <span>{formatMoney(invoice.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 text-[var(--brand-green-600)]">
                  <span>TỔNG CỘNG:</span>
                  <span>{formatMoney(invoice.grandTotal)}</span>
                </div>
                <div className={cn(
                  "flex justify-between text-sm font-bold",
                  remaining > 0 ? "text-orange-600" : "text-gray-500"
                )}>
                  <span>CÒN LẠI:</span>
                  <span>{formatMoney(remaining)}</span>
                </div>
                {excess > 0 && (
                  <div className="flex justify-between text-sm font-bold text-emerald-600">
                    <span>TIỀN THỪA:</span>
                    <span>{formatMoney(excess)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
                <CircleDollarSign className="w-4 h-4" />
                Tổng tiền
              </div>
              <div className="text-xl font-bold text-gray-900">{formatMoney(invoice.grandTotal)}</div>
            </div>
            <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
                <Wallet className="w-4 h-4" />
                Đã thu
              </div>
              <div className="text-xl font-bold text-emerald-700">{formatMoney(invoice.amountPaid)}</div>
            </div>
            {excess > 0 ? (
              <div className="border border-emerald-200 bg-emerald-50/20 rounded shadow-sm p-4">
                <div className="flex items-center gap-2 text-emerald-600 text-xs uppercase tracking-wider mb-2">
                  <CircleDollarSign className="w-4 h-4" />
                  Tiền thừa
                </div>
                <div className="text-xl font-bold text-emerald-700">{formatMoney(excess)}</div>
              </div>
            ) : (
              <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
                  <Receipt className="w-4 h-4" />
                  Còn lại
                </div>
                <div className={cn(
                  "text-xl font-bold",
                  remaining > 0 ? "text-orange-600" : "text-gray-500"
                )}>
                  {formatMoney(remaining)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentQrModal
        open={isQrOpen}
        onOpenChange={setIsQrOpen}
        orderCode={invoice.code}
        paymentStatus={statusLabels[invoice.status] ?? invoice.status}
        paymentAmount={remaining}
        qrUrl={qrUrl}
        qrLabel="Thanh toán hóa đơn"
      />
    </div>
  );
}
