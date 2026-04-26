import { BadgeDollarSign, CheckCircle2, Clock, Ban } from 'lucide-react';
import { InternalPriceStats } from '../../../models';
import { StatGroup } from '@/shared/components/admin/stat-card';

interface StatCardsProps {
  stats?: InternalPriceStats;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function StatCards({ stats, activeTab, onTabChange }: StatCardsProps) {
  const cards = [
    {
      key: 'all',
      label: 'Tổng số bảng giá',
      value: stats?.totalCount ?? 0,
      icon: BadgeDollarSign,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/10',
      isActive: activeTab === 'all',
      onClick: () => onTabChange('all'),
    },
    {
      key: 'active',
      label: 'Đang hiệu lực',
      value: stats?.activeCount ?? 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/10',
      isActive: activeTab === 'active',
      onClick: () => onTabChange('active'),
    },
    {
      key: 'expiring',
      label: 'Sắp hết hạn',
      value: stats?.expiringSoonCount ?? 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/10',
      isActive: activeTab === 'expiring',
      onClick: () => onTabChange('expiring'),
    },
    {
      key: 'expired',
      label: 'Đã hết hạn',
      value: stats?.expiredCount ?? 0,
      icon: Ban,
      color: 'bg-rose-50 text-rose-600',
      borderColor: 'border-rose-100',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/10',
      isActive: activeTab === 'expired',
      onClick: () => onTabChange('expired'),
    },
  ];

  return <StatGroup items={cards} gridCols={4} />;
}

