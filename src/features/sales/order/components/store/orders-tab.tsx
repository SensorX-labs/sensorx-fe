'use client';

import React from 'react';
import { ShoppingBag, ChevronRight, Search, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';
import { OrderStatus } from '../../enums/order-status';
import { OrderListItem } from '../../models/order';
import { OrderService } from '../../services/order-service';

interface OrdersTabProps {
  onViewDetail?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  [OrderStatus.PendingPayment]: {
    label: 'Cho thanh toan',
    className: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  [OrderStatus.Processing]: {
    label: 'Dang xu ly',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [OrderStatus.Dispatched]: {
    label: 'Da xuat kho',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  [OrderStatus.Cancelled]: {
    label: 'Da huy',
    className: 'bg-red-50 text-red-700 border-red-200',
  }
};

export function OrdersTab({ onViewDetail }: OrdersTabProps) {
  const [orders, setOrders] = React.useState<OrderListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await OrderService.getMyOrders({
        pageNumber: 1,
        pageSize: 100,
        searchTerm
      });

      setOrders(response?.items ?? []);
    } catch (error) {
      console.error('>>> Loi khi fetch don hang client:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="tracking-title-lg">Đơn hàng của tôi</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hàng..."
            className="pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all w-80 btn-tracking uppercase"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center bg-white border border-dashed border-gray-100">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300 mx-auto mb-4" />
            <p className="meta-label uppercase">Đang tải đơn hàng...</p>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => {
            const config = statusConfig[order.status] ?? {
              label: order.status,
              className: 'bg-gray-50 text-gray-600 border-gray-200',
            };

            return (
              <div
                key={order.id}
                className="group border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-200 cursor-pointer shadow-sm"
                onClick={() => onViewDetail?.(order.id)}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-4">
                        <span className="tracking-title text-sm">{order.code}</span>
                        <span className={cn(
                          "px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border",
                          config.className
                        )}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="meta-label uppercase text-gray-400">
                          Ngay tao: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="meta-label uppercase text-gray-400">
                          {order.itemCount} sản phẩm
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="tracking-label uppercase text-gray-400 mb-0.5 !text-[10px]">Tổng cộng</p>
                      <p className="qty-label !text-lg !text-gray-900">
                        {order.grandTotal.toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900 group/btn btn-tracking">
                      <span>Chi tiết</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center bg-white border border-dashed border-gray-100">
            <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
            <p className="meta-label uppercase">Bạn chưa có đơn hàng nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
