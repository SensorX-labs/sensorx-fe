'use client';

import React from 'react';
import { Receipt, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

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

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674]">Hóa đơn</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý hóa đơn và thanh toán</p>
        </div>
        <button className="flex items-center gap-2 admin-btn-primary">
          <Receipt className="w-4 h-4" /> Tạo hóa đơn
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="border-none shadow-sm bg-white rounded">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-[#2B3674]">{s.value}</p>
                <p className="text-xs font-semibold text-[#A3AED0] mt-0.5">{s.title}</p>
              </div>
              <div className="w-10 h-10 rounded bg-[#F4F7FE] flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-white rounded">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 admin-table-th">Số HD</th>
                <th className="text-left px-6 py-3 admin-table-th">Đơn hàng</th>
                <th className="text-left px-6 py-3 admin-table-th">Khách hàng</th>
                <th className="text-left px-6 py-3 admin-table-th">Ngày phát hành</th>
                <th className="text-left px-6 py-3 admin-table-th">Hạn thanh toán</th>
                <th className="text-left px-6 py-3 admin-table-th">Tổng tiền</th>
                <th className="text-left px-6 py-3 admin-table-th">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold admin-text-primary">{inv.id}</td>
                  <td className="px-6 py-3 text">{inv.order}</td>
                  <td className="px-6 py-3 font-semibold ">{inv.customer}</td>
                  <td className="px-6 py-3 text">{inv.issued}</td>
                  <td className="px-6 py-3 text">{inv.due}</td>
                  <td className="px-6 py-3 font-semibold ">{inv.total} đ</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[inv.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
