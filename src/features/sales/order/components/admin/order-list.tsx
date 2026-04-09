'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Clock, Truck, CheckCircle, XCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';

import { MOCK_ORDERS } from '../../mocks/order-mocks';
import { OrderStatus } from '../../enums/order-status';

const statusColor: Record<OrderStatus, string> = {
  [OrderStatus.PendingPayment]: 'bg-orange-100 text-orange-500',
  [OrderStatus.Processing]: 'bg-yellow-100 text-yellow-600',
  [OrderStatus.Dispatched]: 'bg-blue-100 text-blue-600',
  [OrderStatus.Cancelled]: 'bg-red-100 text-red-500',
};

const statusLabel: Record<OrderStatus, string> = {
  [OrderStatus.PendingPayment]: 'Chờ thanh toán',
  [OrderStatus.Processing]: 'Đang xử lý',
  [OrderStatus.Dispatched]: 'Đã xuất kho',
  [OrderStatus.Cancelled]: 'Đã hủy',
};

const stats = [
  { title: 'Tổng đơn hàng', value: MOCK_ORDERS.length.toString(), icon: ShoppingCart, color: 'text-[#4318FF]' },
  { title: 'Chờ thanh toán', value: MOCK_ORDERS.filter(o => o.status === OrderStatus.PendingPayment).length.toString(), icon: Clock, color: 'text-yellow-500' },
  { title: 'Đang xử lý', value: MOCK_ORDERS.filter(o => o.status === OrderStatus.Processing).length.toString(), icon: Truck, color: 'text-blue-500' },
  { title: 'Xuất kho', value: MOCK_ORDERS.filter(o => o.status === OrderStatus.Dispatched).length.toString(), icon: CheckCircle, color: 'text-green-500' },
];

export default function OrderList() {
  return (
    <div className="space-y-6">
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
                <th className="text-center px-6 py-3 admin-table-th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((o) => {
                const totalAmount = o.orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice * 1.1), 0);
                return (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-[#F4F7FE] transition-colors">
                    <td className="px-6 py-3 font-semibold admin-text-primary">{o.code}</td>
                    <td className="px-6 py-3 font-semibold ">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{o.companyName}</span>
                        <span className="text-[10px] text-gray-400 font-normal uppercase">{o.recipientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 ">{new Date(o.orderDate).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-3 text-center ">{o.orderItems.length}</td>
                    <td className="px-6 py-3 font-semibold ">{totalAmount.toLocaleString('vi-VN')}</td>
                    <td className="px-6 py-3 ">Chuyển khoản</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColor[o.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {statusLabel[o.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/sales/orders/${o.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/sales/orders/${o.id}?action=edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
