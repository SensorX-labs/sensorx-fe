import { BadgeDollarSign, CheckCircle2, Clock, Ban } from 'lucide-react';
import { InternalPriceStats } from '../../models';

interface StatCardsProps {
  stats?: InternalPriceStats;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function StatCards({ stats, activeTab, onTabChange }: StatCardsProps) {
  const cards = [
    {
      id: 'all',
      label: 'Tổng số bảng giá',
      value: stats?.totalCount ?? 0,
      icon: BadgeDollarSign,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/10',
    },
    {
      id: 'active',
      label: 'Đang hiệu lực',
      value: stats?.activeCount ?? 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/10',
    },
    {
      id: 'expiring',
      label: 'Sắp hết hạn',
      value: stats?.expiringSoonCount ?? 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/10',
    },
    {
      id: 'expired',
      label: 'Đã hết hạn',
      value: stats?.expiredCount ?? 0,
      icon: Ban,
      color: 'bg-rose-50 text-rose-600',
      borderColor: 'border-rose-100',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onTabChange(card.id)}
          className={`cursor-pointer bg-white p-5 rounded-xl border transition-all hover:shadow-md hover:-translate-y-1 flex items-center gap-4 ${
            activeTab === card.id 
              ? card.activeBorder 
              : `${card.borderColor} shadow-sm opacity-70 hover:opacity-100`
          }`}
        >
          <div className={`p-3 rounded-lg ${card.color}`}>
            <card.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

