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
        color: 'bg-indigo-50 text-indigo-600',
        borderColor: 'border-slate-100 shadow-sm',
        activeBorder: 'border-indigo-400 ring-2 ring-indigo-100',
        isActive: statusFilter === 'ALL',
        onClick: () => onFilter('ALL'),
      },
      {
        key: 'pending',
        label: 'Chờ duyệt',
        value: stats?.pendingCount ?? 0,
        icon: Clock,
        color: 'bg-yellow-50 text-yellow-600',
        borderColor: 'border-slate-100 shadow-sm',
        activeBorder: 'border-yellow-400 ring-2 ring-yellow-100',
        isActive: statusFilter === QuoteStatus.PENDING,
        onClick: () => onFilter(QuoteStatus.PENDING),
      },
      {
        key: 'approved',
        label: 'Đã phê duyệt',
        value: stats?.approvedCount ?? 0,
        icon: CheckCircle,
        color: 'bg-green-50 text-green-600',
        borderColor: 'border-slate-100 shadow-sm',
        activeBorder: 'border-green-400 ring-2 ring-green-100',
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
        color: 'bg-red-50 text-red-500',
        borderColor: 'border-slate-100 shadow-sm',
        activeBorder: 'border-red-400 ring-2 ring-red-100',
        isActive: statusFilter === QuoteStatus.RETURNED,
        onClick: () => onFilter(QuoteStatus.RETURNED),
      },
      {
        key: 'sent',
        label: 'Đã gửi khách',
        value: stats?.sentCount ?? 0,
        icon: Send,
        color: 'bg-blue-50 text-blue-600',
        borderColor: 'border-slate-100 shadow-sm',
        activeBorder: 'border-blue-400 ring-2 ring-blue-100',
        isActive: statusFilter === QuoteStatus.SENT,
        onClick: () => onFilter(QuoteStatus.SENT),
      },
      {
        key: 'ordered',
        label: 'Đã sinh đơn',
        value: stats?.orderedCount ?? 0,
        icon: ShoppingCart,
        color: 'bg-emerald-50 text-emerald-600',
        borderColor: 'border-slate-100 shadow-sm',
        activeBorder: 'border-emerald-400 ring-2 ring-emerald-100',
        isActive: statusFilter === QuoteStatus.ORDERED,
        onClick: () => onFilter(QuoteStatus.ORDERED),
      },
      {
        key: 'expired',
        label: 'Sắp hết hạn',
        value: stats?.expiredCount ?? 0,
        icon: AlertTriangle,
        color: 'bg-orange-50 text-orange-500',
        borderColor: 'border-slate-100 shadow-sm',
        // Không có QuoteStatus tương ứng → không cho click filter
      },
      // Card "Bản nháp" chỉ hiển thị với SaleStaff
      ...(isSaleStaff
        ? [
            {
              key: 'draft',
              label: 'Bản nháp',
              value: stats?.draftCount ?? 0,
              icon: FileText,
              color: 'bg-slate-50 text-slate-500',
              borderColor: 'border-slate-100 shadow-sm',
              activeBorder: 'border-slate-400 ring-2 ring-slate-100',
              isActive: statusFilter === QuoteStatus.DRAFT,
              onClick: () => onFilter(QuoteStatus.DRAFT),
            },
          ]
        : []),
    ];

    return items;
  }, [stats, statusFilter, isSaleStaff, onFilter]);

  return <StatGroup items={statItems} gridCols={4} className="mb-1" />;
}
