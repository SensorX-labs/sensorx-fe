'use client';

import React from 'react';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';
import { ProductStats } from '../../../models';
import { StatGroup } from '@/shared/components/admin/stat-card';

interface StatCardsProps {
  stats?: ProductStats;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function StatCards({ stats, activeTab, onTabChange }: StatCardsProps) {
  const cards = [
    {
      key: 'all',
      label: 'Tổng hàng hóa',
      value: stats?.totalCount ?? 0,
      icon: Layers,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/10',
      isActive: activeTab === 'all',
      onClick: () => onTabChange('all'),
    },
    {
      key: 'active',
      label: 'Đang hoạt động',
      value: stats?.activeCount ?? 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/10',
      isActive: activeTab === 'active',
      onClick: () => onTabChange('active'),
    },
    {
      key: 'inactive',
      label: 'Ngừng kinh doanh',
      value: stats?.inactiveCount ?? 0,
      icon: XCircle,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/10',
      isActive: activeTab === 'inactive',
      onClick: () => onTabChange('inactive'),
    },
  ];

  return (
    <StatGroup
      items={cards}
      gridCols={3}
    />
  );
}
