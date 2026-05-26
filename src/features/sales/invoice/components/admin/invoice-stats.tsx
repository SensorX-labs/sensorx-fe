'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeDollarSign,
  CircleDollarSign,
  Receipt,
  WalletCards,
  XCircle,
} from 'lucide-react';

import { StatGroup } from '@/shared/components/admin/stat-card';
import { StatColorTheme } from '@/shared/components/admin/stat-card/stat-card';

import { InvoiceService, InvoiceStatsResponse } from '../../services/invoice-service';
import { InvoiceStatus } from '../../enums/invoice-status';

interface InvoiceStatsProps {
  statusFilter: string;
  onFilter: (status: string) => void;
  refreshKey: number;
}

export function InvoiceStats({
  statusFilter,
  onFilter,
  refreshKey,
}: InvoiceStatsProps) {
  const [stats, setStats] = useState<InvoiceStatsResponse | null>(null);

  useEffect(() => {
    InvoiceService.getInvoiceStats()
      .then(setStats)
      .catch(error =>
        console.error('>>> Lỗi khi tải thống kê hoá đơn:', error)
      );
  }, [refreshKey]);

  const items = useMemo(
    () => [
      {
        key: 'all',
        label: 'Tổng hoá đơn',
        value: stats?.totalCount ?? 0,
        icon: Receipt,
        colorTheme: 'dark' as StatColorTheme,
        isActive: statusFilter === 'ALL',
        onClick: () => onFilter('ALL'),
      },

      {
        key: 'unpaid',
        label: 'Chờ thanh toán',
        value: stats?.unpaidCount ?? 0,
        icon: CircleDollarSign,
        colorTheme: 'yellow' as StatColorTheme,
        isActive: statusFilter === InvoiceStatus.Unpaid,
        onClick: () => onFilter(InvoiceStatus.Unpaid),
      },

      {
        key: 'partially-paid',
        label: 'Thanh toán một phần',
        value: stats?.partiallyPaidCount ?? 0,
        icon: WalletCards,
        colorTheme: 'orange' as StatColorTheme,
        isActive: statusFilter === InvoiceStatus.PartiallyPaid,
        onClick: () => onFilter(InvoiceStatus.PartiallyPaid),
      },

      {
        key: 'paid',
        label: 'Đã thanh toán',
        value: stats?.paidCount ?? 0,
        icon: BadgeDollarSign,
        colorTheme: 'green' as StatColorTheme,
        isActive: statusFilter === InvoiceStatus.Paid,
        onClick: () => onFilter(InvoiceStatus.Paid),
      },

      {
        key: 'issued',
        label: 'Đã phát hành',
        value: stats?.issuedCount ?? 0,
        icon: Receipt,
        colorTheme: 'blue' as StatColorTheme,
        isActive: statusFilter === InvoiceStatus.Issued,
        onClick: () => onFilter(InvoiceStatus.Issued),
      },

      {
        key: 'cancelled',
        label: 'Đã huỷ',
        value: stats?.cancelledCount ?? 0,
        icon: XCircle,
        colorTheme: 'red' as StatColorTheme,
        isActive: statusFilter === InvoiceStatus.Cancelled,
        onClick: () => onFilter(InvoiceStatus.Cancelled),
      },
    ],
    [stats, statusFilter, onFilter]
  );

  return <StatGroup items={items} variant="pill" />;
}