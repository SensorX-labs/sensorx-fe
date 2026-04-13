'use client';

import React, { useState } from 'react';
import { Receipt, Clock, CheckCircle, AlertCircle, Eye, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';

const stats = [
  { title: 'Tổng hóa đơn', value: '924', icon: Receipt, color: 'text-[#4318FF]' },
  { title: 'Chưa thanh toán', value: '87', icon: Clock, color: 'text-yellow-500' },
  { title: 'Đã thanh toán', value: '812', icon: CheckCircle, color: 'text-green-500' },
  { title: 'Quá hạn', value: '25', icon: AlertCircle, color: 'text-red-400' },
];

const invoices = [
  { id: 'HD001', order: 'DH001', customer: 'Nguyễn Văn An', issued: '02/03/2026', due: '16/03/2026', total: '12,500,000', status: 'Đã thanh toán' },
  { id: 'HD002', order: 'DH003', customer: 'Lê Minh Châu', issued: '01/03/2026', due: '15/03/2026', total: '28,900,000', status: 'Chưa thanh toán' },
  { id: 'HD003', order: 'DH006', customer: 'Vũ Thị Fương', issued: '28/02/2026', due: '14/03/2026', total: '9,750,000', status: 'Đã thanh toán' },
  { id: 'HD004', order: 'DH007', customer: 'Đặng Văn Giang', issued: '15/02/2026', due: '01/03/2026', total: '34,200,000', status: 'Quá hạn' },
  { id: 'HD005', order: 'DH008', customer: 'Bùi Thị Hoa', issued: '20/02/2026', due: '06/03/2026', total: '7,100,000', status: 'Chưa thanh toán' },
];

const statusColor: Record<string, string> = {
  'Đã thanh toán': 'bg-green-100 text-green-600',
  'Chưa thanh toán': 'bg-yellow-100 text-yellow-600',
  'Quá hạn': 'bg-red-100 text-red-400',
};

export default function InvoiceList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      (inv.id?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (inv.customer?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (inv.order?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 admin-btn-primary">
          <Receipt className="w-4 h-4" /> Tạo hóa đơn
        </button>
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
              placeholder="Tìm số HD, khách hàng, đơn hàng..."
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
              <option value="Đã thanh toán">Đã thanh toán</option>
              <option value="Chưa thanh toán">Chưa thanh toán</option>
              <option value="Quá hạn">Quá hạn</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Số HD</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Đơn hàng</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Khách hàng</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Ngày phát hành</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Hạn thanh toán</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Tổng tiền</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Trạng thái</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4">{inv.id ?? '-'}</td>
                <td className="px-6 py-4 text-gray-700">{inv.order ?? '-'}</td>
                <td className="px-6 py-4">{inv.customer ?? '-'}</td>
                <td className="px-6 py-4 text-gray-700">{inv.issued ?? '-'}</td>
                <td className="px-6 py-4 text-gray-700">{inv.due ?? '-'}</td>
                <td className="px-6 py-4">{inv.total ?? '-'} đ</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[inv.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
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
