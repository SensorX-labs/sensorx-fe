'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  ShoppingCart,
  AlertTriangle,
} from 'lucide-react';
import { StatGroup } from '@/shared/components/admin/stat-card';
import { StatColorTheme } from '@/shared/components/admin/stat-card/stat-card';
import { QuoteStatus } from '../../constants/quote-status';
import { QuoteService, QuoteStatsResponse } from '../../services/quote.service';

interface QuotationStatsProps {
  statusFilter: QuoteStatus | 'ALL';
  onFilter: (status: QuoteStatus | 'ALL') => void;
  /** role lấy từ useUser().user?.role — ví dụ: 'SaleStaff' | 'Manager' */
  role?: string;
}

export function QuotationStats({ statusFilter, onFilter, role }: QuotationStatsProps) {
  const isSaleStaff = role?.toLowerCase() === 'salestaff';

  const [stats, setStats] = useState<QuoteStatsResponse | null>(null);

  useEffect(() => {
    QuoteService.getQuoteStats()
      .then(setStats)
      .catch((e) => console.error('>>> Lỗi khi fetch quote stats:', e));
  }, []);

  const statItems = useMemo(() => {
    const items = [
      {
        key: 'total',
        label: 'Tổng báo giá',
        value: stats?.totalCount ?? 0,
        icon: FileText,
        colorTheme: 'dark' as StatColorTheme,
        isActive: statusFilter === 'ALL',
        onClick: () => onFilter('ALL'),
      },
      {
        key: 'pending',
        label: 'Chờ duyệt',
        value: stats?.pendingCount ?? 0,
        icon: Clock,
        colorTheme: 'yellow' as StatColorTheme,
        isActive: statusFilter === QuoteStatus.PENDING,
        onClick: () => onFilter(QuoteStatus.PENDING),
      },
      {
        key: 'approved',
        label: 'Đã phê duyệt',
        value: stats?.approvedCount ?? 0,
        icon: CheckCircle,
        colorTheme: 'green' as StatColorTheme,
        isActive: statusFilter === QuoteStatus.APPROVED,
        onClick: () => onFilter(QuoteStatus.APPROVED),
      },
      {
        key: 'returned',
        // SaleStaff thấy báo giá của mình bị trả về → "Bị từ chối"
        // Manager xem toàn bộ, họ là người từ chối → "Đã từ chối"
        label: isSaleStaff ? 'Bị từ chối' : 'Đã từ chối',
        value: stats?.returnedCount ?? 0,
        icon: XCircle,
        colorTheme: 'red' as StatColorTheme,
        isActive: statusFilter === QuoteStatus.RETURNED,
        onClick: () => onFilter(QuoteStatus.RETURNED),
      },
      {
        key: 'sent',
        label: 'Đã gửi khách',
        value: stats?.sentCount ?? 0,
        icon: Send,
        colorTheme: 'indigo' as StatColorTheme,
        isActive: statusFilter === QuoteStatus.SENT,
        onClick: () => onFilter(QuoteStatus.SENT),
      },
      {
        key: 'ordered',
        label: 'Đã sinh đơn',
        value: stats?.orderedCount ?? 0,
        icon: ShoppingCart,
        colorTheme: 'emerald' as StatColorTheme,
        isActive: statusFilter === QuoteStatus.ORDERED,
        onClick: () => onFilter(QuoteStatus.ORDERED),
      },
      {
        key: 'cancelled',
        label: 'Đã hủy',
        value: stats?.cancelledCount ?? 0,
        icon: XCircle,
        colorTheme: 'gray' as StatColorTheme,
        isActive: statusFilter === QuoteStatus.CANCELLED,
        onClick: () => onFilter(QuoteStatus.CANCELLED),
      },
      {
        key: 'expired',
        label: 'Đã hết hạn',
        value: stats?.expiredCount ?? 0,
        icon: AlertTriangle,
        colorTheme: 'orange' as StatColorTheme,
        isActive: statusFilter === 'Expired' as any,
        onClick: () => onFilter('Expired' as any),
      },
      // Card "Bản nháp" chỉ hiển thị với SaleStaff
      ...(isSaleStaff
        ? [
            {
              key: 'draft',
              label: 'Bản nháp',
              value: stats?.draftCount ?? 0,
              icon: FileText,
              colorTheme: 'slate' as StatColorTheme,
              isActive: statusFilter === QuoteStatus.DRAFT,
              onClick: () => onFilter(QuoteStatus.DRAFT),
            },
          ]
        : []),
    ];

    return items;
  }, [stats, statusFilter, isSaleStaff, onFilter]);

  return <StatGroup items={statItems} variant="pill" />;
}
