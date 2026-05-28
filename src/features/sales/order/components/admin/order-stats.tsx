'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Clock3, ShoppingCart, Truck, XCircle } from 'lucide-react';
import { StatGroup } from '@/shared/components/admin/stat-card';
import { StatColorTheme } from '@/shared/components/admin/stat-card/stat-card';
import { OrderService, OrderStatsResponse } from '../../services/order-service';
import { OrderStatus } from '../../enums/order-status';

interface OrderStatsProps {
  statusFilter: string;
  onFilter: (status: string) => void;
  refreshKey: number;
}

export function OrderStats({ statusFilter, onFilter, refreshKey }: OrderStatsProps) {
  const [stats, setStats] = useState<OrderStatsResponse | null>(null);

  useEffect(() => {
    OrderService.getOrderStats()
      .then(setStats)
      .catch(error => console.error('>>> Loi khi fetch order stats:', error));
  }, [refreshKey]);

  const items = useMemo(() => [
    {
      key: 'all',
      label: 'Tổng đơn hàng',
      value: stats?.totalCount ?? 0,
      icon: ShoppingCart,
      colorTheme: 'dark' as StatColorTheme,
      isActive: statusFilter === 'ALL',
      onClick: () => onFilter('ALL'),
    },
    {
      key: 'pending-payment',
      label: 'Chờ thanh toán',
      value: stats?.pendingPaymentCount ?? 0,
      icon: Clock3,
      colorTheme: 'orange' as StatColorTheme,
      isActive: statusFilter === OrderStatus.PendingPayment,
      onClick: () => onFilter(OrderStatus.PendingPayment),
    },
    {
      key: 'processing',
      label: 'Đang xử lý',
      value: stats?.processingCount ?? 0,
      icon: ShoppingCart,
      colorTheme: 'blue' as StatColorTheme,
      isActive: statusFilter === OrderStatus.Processing,
      onClick: () => onFilter(OrderStatus.Processing),
    },
    {
      key: 'dispatched',
      label: 'Đã xuất kho',
      value: stats?.dispatchedCount ?? 0,
      icon: Truck,
      colorTheme: 'green' as StatColorTheme,
      isActive: statusFilter === OrderStatus.Dispatched,
      onClick: () => onFilter(OrderStatus.Dispatched),
    },
    {
      key: 'cancelled',
      label: 'Đã hủy',
      value: stats?.cancelledCount ?? 0,
      icon: XCircle,
      colorTheme: 'red' as StatColorTheme,
      isActive: statusFilter === OrderStatus.Cancelled,
      onClick: () => onFilter(OrderStatus.Cancelled),
    },
  ], [stats, statusFilter, onFilter]);

  return <StatGroup items={items} variant="pill" />;
}
