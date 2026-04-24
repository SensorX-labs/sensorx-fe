import React from 'react';
import { Card, CardContent } from '@/shared/components/shadcn-ui/card';
import { BadgeDollarSign, CheckCircle2, Clock, Ban } from 'lucide-react';

export function StatCards() {
  const stats = [
    {
      title: 'Tổng số bảng giá',
      value: '128',
      icon: BadgeDollarSign,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Đang hiệu lực',
      value: '94',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Sắp hết hạn',
      value: '12',
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      title: 'Đã vô hiệu',
      value: '22',
      icon: Ban,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-900 group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
