'use client';

import React from 'react';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';
import { ProductStats } from '../../../models';
import { StatGroup } from '@/shared/components/admin/stat-card';
import { StatColorTheme } from '@/shared/components/admin/stat-card/stat-card';

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
      colorTheme: 'blue' as StatColorTheme,
      isActive: activeTab === 'all',
      onClick: () => onTabChange('all'),
    },
    {
      key: 'active',
      label: 'Đang hoạt động',
      value: stats?.activeCount ?? 0,
      icon: CheckCircle2,
      colorTheme: 'emerald' as StatColorTheme,
      isActive: activeTab === 'active',
      onClick: () => onTabChange('active'),
    },
    {
      key: 'inactive',
      label: 'Ngừng kinh doanh',
      value: stats?.inactiveCount ?? 0,
      icon: XCircle,
      colorTheme: 'yellow' as StatColorTheme,
      isActive: activeTab === 'inactive',
      onClick: () => onTabChange('inactive'),
    },
  ];

  return <StatGroup items={cards} variant="pill" />;
}
