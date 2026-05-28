'use client';

import { Building2, Clock3, FileText } from 'lucide-react';
import { StatGroup } from '@/shared/components/admin/stat-card';

interface SupplierStatsProps {
  totalSuppliers: number;
  updatedSuppliers: number;
  missingDescriptionSuppliers: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SupplierStats({
  totalSuppliers,
  updatedSuppliers,
  missingDescriptionSuppliers,
  activeTab,
  onTabChange,
}: SupplierStatsProps) {
  const cards = [
    {
      key: 'all',
      label: 'Tổng nhà cung cấp',
      value: totalSuppliers,
      icon: Building2,
      colorTheme: 'blue' as const,
      isActive: activeTab === 'all',
      onClick: () => onTabChange('all'),
    },
    {
      key: 'updated',
      label: 'Đã cập nhật',
      value: updatedSuppliers,
      icon: Clock3,
      colorTheme: 'emerald' as const,
      isActive: activeTab === 'updated',
      onClick: () => onTabChange('updated'),
    },
    {
      key: 'missing-description',
      label: 'Thiếu mô tả',
      value: missingDescriptionSuppliers,
      icon: FileText,
      colorTheme: 'orange' as const,
      isActive: activeTab === 'missing-description',
      onClick: () => onTabChange('missing-description'),
    },
  ];

  return <StatGroup items={cards} gridCols={3} />;
}
