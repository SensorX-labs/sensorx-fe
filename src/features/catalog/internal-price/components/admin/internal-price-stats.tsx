import { BadgeDollarSign, CheckCircle2, Clock, Ban } from 'lucide-react';

export function StatCards() {
  const stats = [
    {
      label: 'Tổng số bảng giá',
      value: '128',
      icon: BadgeDollarSign,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      label: 'Đang hiệu lực',
      value: '94',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100',
    },
    {
      label: 'Sắp hết hạn',
      value: '12',
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100',
    },
    {
      label: 'Đã hết hạn',
      value: '22',
      icon: Ban,
      color: 'bg-rose-50 text-rose-600',
      borderColor: 'border-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`bg-white p-5 rounded-xl border ${stat.borderColor} shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1`}
        >
          <div className={`p-3 rounded-lg ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
