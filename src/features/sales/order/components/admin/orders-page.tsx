'use client';

import React from 'react';
import { ShoppingCart, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';

const stats = [
  { title: 'Tổng đơn hàng', value: '1,482', icon: ShoppingCart, color: 'text-[#4318FF]' },
  { title: 'Chờ xác nhận', value: '38', icon: Clock, color: 'text-yellow-500' },
  { title: 'Đang giao', value: '126', icon: Truck, color: 'text-blue-500' },
  { title: 'Hoàn thành', value: '1,284', icon: CheckCircle, color: 'text-green-500' },
];

const orders = [
  { id: 'DH001', customer: 'Nguyễn Văn An', date: '02/03/2026', items: 3, total: '12,500,000', payment: 'Chuyển khoản', status: 'Hoàn thành' },
  { id: 'DH002', customer: 'Trần Thị Bình', date: '02/03/2026', items: 1, total: '4,200,000', payment: 'COD', status: 'Đang giao' },
  { id: 'DH003', customer: 'Lê Minh Châu', date: '01/03/2026', items: 5, total: '28,900,000', payment: 'Chuyển khoản', status: 'Đang xử lý' },
  { id: 'DH004', customer: 'Phạm Đức Dũng', date: '01/03/2026', items: 2, total: '8,600,000', payment: 'Tiền mặt', status: 'Chờ xác nhận' },
  { id: 'DH005', customer: 'Hoàng Thị Ema', date: '28/02/2026', items: 4, total: '19,300,000', payment: 'COD', status: 'Đã huỷ' },
];

const statusColor: Record<string, string> = {
  'Hoàn thành': 'bg-green-100 text-green-600',
  'Đang giao': 'bg-blue-100 text-blue-600',
  'Đang xử lý': 'bg-yellow-100 text-yellow-600',
  'Chờ xác nhận': 'bg-orange-100 text-orange-500',
  'Đã huỷ': 'bg-red-100 text-red-400',
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 admin-btn-primary">
          <ShoppingCart className="w-4 h-4" /> Tạo đơn hàng
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
                <th className="text-left px-6 py-3 admin-table-th">Mã ĐH</th>
                <th className="text-left px-6 py-3 admin-table-th">Khách hàng</th>
                <th className="text-left px-6 py-3 admin-table-th">Ngày đặt</th>
                <th className="text-left px-6 py-3 admin-table-th">Sản phẩm</th>
                <th className="text-left px-6 py-3 admin-table-th">Tổng tiền</th>
                <th className="text-left px-6 py-3 admin-table-th">Thanh toán</th>
                <th className="text-left px-6 py-3 admin-table-th">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                  <td className="px-6 py-3 font-semibold admin-text-primary">{o.id}</td>
                  <td className="px-6 py-3 font-semibold ">{o.customer}</td>
                  <td className="px-6 py-3 ">{o.date}</td>
                  <td className="px-6 py-3 text-center ">{o.items}</td>
                  <td className="px-6 py-3 font-semibold ">{o.total} đ</td>
                  <td className="px-6 py-3 ">{o.payment}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[o.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {o.status}
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
