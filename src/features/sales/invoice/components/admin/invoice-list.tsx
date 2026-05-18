'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Receipt, Search } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { cn } from '@/shared/utils/cn';
import { InvoiceStatus } from '../../enums/invoice-status';
import { InvoiceListItem } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';

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

const formatMoney = (value?: number) => `${(value ?? 0).toLocaleString('vi-VN')} d`;

export default function InvoiceList() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchInvoices = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await InvoiceService.getListInvoices({ pageNumber: 1, pageSize: 50, searchTerm });
      setInvoices(response?.items ?? []);
    } catch (error) {
      console.error('>>> Loi khi fetch hoa don:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const stats = useMemo(() => [
    { title: 'Tổng hóa đơn', value: invoices.length.toString(), icon: Receipt, color: 'text-[#4318FF]' },
    { title: 'Chưa thanh toán', value: invoices.filter(x => x.status === InvoiceStatus.Unpaid).length.toString(), icon: Receipt, color: 'text-yellow-500' },
    { title: 'Đã thanh toán', value: invoices.filter(x => x.status === InvoiceStatus.Paid).length.toString(), icon: Receipt, color: 'text-green-500' },
    { title: 'Đã hủy', value: invoices.filter(x => x.status === InvoiceStatus.Cancelled).length.toString(), icon: Receipt, color: 'text-red-400' },
  ], [invoices]);

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return invoices.filter(inv => {
      const matchesSearch =
        inv.code.toLowerCase().includes(normalizedSearch) ||
        inv.companyName.toLowerCase().includes(normalizedSearch) ||
        inv.orderId.toLowerCase().includes(normalizedSearch);

      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold admin-title uppercase">Quản lý hóa đơn</h2>
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
              placeholder="Tìm mã hóa đơn, công ty, đơn hàng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[220px]">
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
                <th className="text-left px-6 py-4 tracking-label uppercase">Mã HD</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Đơn hàng</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">ông ty</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Ngày lập</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">Sản phẩm</th>
                <th className="text-right px-6 py-4 tracking-label uppercase">Đã thu</th>
                <th className="text-right px-6 py-4 tracking-label uppercase">Tổng tiền</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">Trạng thái</th>
                <th className="text-right px-6 py-4 tracking-label uppercase pr-10">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">{inv.code}</td>
                  <td className="px-6 py-4 text-gray-700">{inv.orderId}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{inv.companyName}</div>
                    <p className="text-[10px] text-gray-500 font-normal mt-0.5 uppercase tracking-wider">{inv.taxCode}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{new Date(inv.issueAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-700">{inv.itemCount}</td>
                  <td className="px-6 py-4 text-right">{formatMoney(inv.amountPaid)}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">{formatMoney(inv.grandTotal)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                      statusStyles[inv.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'
                    )}>
                      {statusLabels[inv.status] ?? inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 pr-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        onClick={() => router.push(`/sales/invoices/${inv.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="py-20 text-center animate-pulse text-blue-600 font-medium tracking-widest uppercase text-xs">
              Đang tải hóa đơn...
            </div>
          )}
          {!loading && filteredInvoices.length === 0 && (
            <div className="py-20 text-center text-gray-400 uppercase tracking-widest text-xs">
              Không tìm thấy hóa đơn nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
