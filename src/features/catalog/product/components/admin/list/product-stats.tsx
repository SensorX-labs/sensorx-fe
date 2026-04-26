'use client';

import React from 'react';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';
import { ProductStats } from '../../../models';

interface StatCardsProps {
  stats?: ProductStats;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function StatCards({ stats, activeTab, onTabChange }: StatCardsProps) {
  const cards = [
    {
      id: 'all',
      label: 'Tổng hàng hóa',
      value: stats?.totalCount ?? 0,
      icon: Layers,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      id: 'active',
      label: 'Đang hoạt động',
      value: stats?.activeCount ?? 0,
      icon: CheckCircle2,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-100'
    },
    {
      id: 'inactive',
      label: 'Tạm ngưng',
      value: stats?.inactiveCount ?? 0,
      icon: XCircle,
      color: 'slate',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-500',
      borderColor: 'border-slate-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeTab === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onTabChange(card.id)}
            className={`
              relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden group
              ${isActive 
                ? `${card.bgColor} ${card.borderColor} shadow-md shadow-${card.color}-500/10` 
                : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
              }
            `}
          >
            {/* Background Pattern */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${card.bgColor} opacity-40 group-hover:scale-110 transition-transform duration-500`} />
            
            <div className="relative flex items-center gap-4">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                ${isActive ? 'bg-white shadow-sm' : card.bgColor}
                ${card.textColor}
              `}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isActive ? card.textColor : 'text-slate-400'}`}>
                  {card.label}
                </p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">
                  {card.value.toLocaleString()}
                </p>
              </div>
            </div>

            {isActive && (
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-${card.color}-500`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
