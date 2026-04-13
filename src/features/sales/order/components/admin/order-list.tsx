'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
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
  { title: 'Chờ thanh toán', value: MOCK_ORDERS.filter(o => o.status === OrderStatus.PendingPayment).length.toString(), icon: ShoppingCart, color: 'text-yellow-500' },
  { title: 'Đang xử lý', value: MOCK_ORDERS.filter(o => o.status === OrderStatus.Processing).length.toString(), icon: ShoppingCart, color: 'text-blue-500' },
  { title: 'Xuất kho', value: MOCK_ORDERS.filter(o => o.status === OrderStatus.Dispatched).length.toString(), icon: ShoppingCart, color: 'text-green-500' },
];

export default function OrderList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredOrders = MOCK_ORDERS.filter(o => {
    const matchesSearch = 
      (o.code?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (o.companyName?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (o.recipientName?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
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
              placeholder="Tìm mã đơn, công ty, người nhận..."
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
              {Object.entries(statusLabel).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">Mã ĐH</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Khách hàng</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Ngày đặt</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Sản phẩm</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Tổng tiền</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Thanh toán</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Trạng thái</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => {
              const totalAmount = o.orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice * 1.1), 0);
              return (
                <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{o.code ?? '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{o.companyName ?? '-'}</span>
                      <span className="text-[10px] text-gray-500 font-normal uppercase">{o.recipientName ?? '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{new Date(o.orderDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-center text-gray-700">{o.orderItems.length}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{totalAmount.toLocaleString('vi-VN')}</td>
                  <td className="px-6 py-4 text-gray-700">Chuyển khoản</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColor[o.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {statusLabel[o.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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
      </div>
    </div>
  );
}
