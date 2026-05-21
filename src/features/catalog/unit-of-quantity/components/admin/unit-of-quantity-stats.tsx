'use client';

import { Package2, Clock3, FileText } from 'lucide-react';
import { UnitOfQuantity } from '../../models';

interface UnitOfQuantityStatsProps {
  units: UnitOfQuantity[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'all', label: 'Tất cả', icon: Package2 },
  { id: 'updated', label: 'Đã cập nhật', icon: Clock3 },
  { id: 'missing-description', label: 'Thiếu mô tả', icon: FileText },
];

export function UnitOfQuantityStats({
  units,
  activeTab,
  onTabChange,
}: UnitOfQuantityStatsProps) {
  const updatedCount = units.filter(item => !!item.updatedAt).length;
  const missingDescriptionCount = units.filter(item => !item.description?.trim()).length;

  const stats = {
    all: units.length,
    updated: updatedCount,
    'missing-description': missingDescriptionCount,
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`rounded border p-4 text-left transition-all ${
              isActive
                ? 'border-emerald-200 bg-emerald-50 shadow-sm'
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded ${
                  isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black text-slate-800">
                {stats[tab.id as keyof typeof stats]}
              </span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
