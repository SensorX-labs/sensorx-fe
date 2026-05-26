import { BadgeDollarSign, CheckCircle2, Clock, Ban } from 'lucide-react';
import { InternalPriceStats } from '../../../models';
import { StatGroup } from '@/shared/components/admin/stat-card';
import { StatColorTheme } from '@/shared/components/admin/stat-card/stat-card';

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
      colorTheme: 'blue' as StatColorTheme,
      isActive: activeTab === 'all',
      onClick: () => onTabChange('all'),
    },
    {
      key: 'active',
      label: 'Đang hiệu lực',
      value: stats?.activeCount ?? 0,
      icon: CheckCircle2,
      colorTheme: 'emerald' as StatColorTheme,
      isActive: activeTab === 'active',
      onClick: () => onTabChange('active'),
    },
    {
      key: 'expiring',
      label: 'Sắp hết hạn',
      value: stats?.expiringSoonCount ?? 0,
      icon: Clock,
      colorTheme: 'yellow' as StatColorTheme,
      isActive: activeTab === 'expiring',
      onClick: () => onTabChange('expiring'),
    },
    {
      key: 'expired',
      label: 'Đã hết hạn',
      value: stats?.expiredCount ?? 0,
      icon: Ban,
      colorTheme: 'red' as StatColorTheme,
      isActive: activeTab === 'expired',
      onClick: () => onTabChange('expired'),
    },
  ];

  return <StatGroup items={cards} variant="pill" />;
}
