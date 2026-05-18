'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Search, ShoppingCart, Truck, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { Button } from '@/shared/components/shadcn-ui/button';
import { cn } from '@/shared/utils/cn';
import { OrderStatus } from '../../enums/order-status';
import { OrderListItem } from '../../models/order';
import { OrderService } from '../../services/order-service';

const statusStyles: Record<string, string> = {
  [OrderStatus.PendingPayment]: 'bg-orange-50 text-orange-600 border-orange-100',
  [OrderStatus.Processing]: 'bg-blue-50 text-blue-600 border-blue-100',
  [OrderStatus.Dispatched]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  [OrderStatus.Cancelled]: 'bg-red-50 text-red-600 border-red-100',
};

const statusLabels: Record<string, string> = {
  [OrderStatus.PendingPayment]: 'Cho thanh toan',
  [OrderStatus.Processing]: 'Dang xu ly',
  [OrderStatus.Dispatched]: 'Da xuat kho',
  [OrderStatus.Cancelled]: 'Da huy',
};

const formatMoney = (value?: number) => `${(value ?? 0).toLocaleString('vi-VN')} d`;

export default function OrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await OrderService.getListOrders({ pageNumber: 1, pageSize: 50, searchTerm });
      setOrders(response?.items ?? []);
    } catch (error) {
      console.error('>>> Loi khi fetch don hang:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const stats = useMemo(() => [
    { title: 'Tong don hang', value: orders.length.toString(), icon: ShoppingCart, color: 'text-[#4318FF]' },
    { title: 'Dang xu ly', value: orders.filter(o => o.status === OrderStatus.Processing).length.toString(), icon: ShoppingCart, color: 'text-blue-500' },
    { title: 'Da xuat kho', value: orders.filter(o => o.status === OrderStatus.Dispatched).length.toString(), icon: Truck, color: 'text-green-500' },
    { title: 'Da huy', value: orders.filter(o => o.status === OrderStatus.Cancelled).length.toString(), icon: XCircle, color: 'text-red-400' },
  ], [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return orders.filter(o => {
      const matchesSearch =
        o.code.toLowerCase().includes(normalizedSearch) ||
        o.companyName.toLowerCase().includes(normalizedSearch) ||
        o.recipientName.toLowerCase().includes(normalizedSearch);

      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold admin-title uppercase">Quan ly don hang</h2>
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
              placeholder="Tim ma don, cong ty, nguoi nhan..."
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
              <option value="ALL">Tat ca trang thai</option>
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
                <th className="text-left px-6 py-4 tracking-label uppercase">Ma DH</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Khach hang</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Ngay dat</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">San pham</th>
                <th className="text-right px-6 py-4 tracking-label uppercase">Tong tien</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">Trang thai</th>
                <th className="text-right px-6 py-4 tracking-label uppercase pr-10">Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">{o.code}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{o.companyName}</div>
                    <p className="text-[10px] text-gray-500 font-normal mt-0.5 uppercase tracking-wider">{o.recipientName}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{new Date(o.orderDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-700">{o.itemCount}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 text-right">{formatMoney(o.grandTotal)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                      statusStyles[o.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'
                    )}>
                      {statusLabels[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 pr-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        onClick={() => router.push(`/sales/orders/${o.id}`)}
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
              Dang tai du lieu...
            </div>
          )}
          {!loading && filteredOrders.length === 0 && (
            <div className="py-20 text-center text-gray-400 uppercase tracking-widest text-xs">
              Khong tim thay don hang nao
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
