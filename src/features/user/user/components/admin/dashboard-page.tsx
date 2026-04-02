'use client';

import React from 'react';
import {
  ShoppingBag,
  Package,
  DollarSign,
  Users,
  Truck,
  Calendar,
  ChevronRight,
  Monitor,
  Tablet,
  Tv,
  TrendingUp,
  ArrowRight,
  BarChart3,
  PieChart,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/shadcn-ui/card';

/* ================= TYPES & DATA ================= */

const stats = [
  { title: 'Tổng doanh số', value: '46.34k', icon: ShoppingBag },
  { title: 'Tổng SP', value: '3,895', icon: Package },
  { title: 'ĐH trung bình', value: '$61,985', icon: DollarSign },
  { title: 'Khách hàng', value: '12,584', icon: Users },
  { title: 'Giao hàng', value: '24,526', icon: Truck },
];

const topProducts = [
  { label: 'Camera thông minh', value: '56,236', icon: Monitor },
  { label: 'iPad 2021', value: '220k', icon: Tablet },
  { label: 'Smart TV 4K', value: '51,568', icon: Tv },
  { label: 'MacBook 18"', value: '1,568', icon: Monitor },
];

const weeklyData = [
  { day: 'T2', value: 12 },
  { day: 'T3', value: 18 },
  { day: 'T4', value: 12 },
  { day: 'T5', value: 15 },
  { day: 'T6', value: 18 },
  { day: 'T7', value: 13 },
  { day: 'CN', value: 15 },
];

const categoryData = [
  { name: 'Cảm biến', value: 35, color: '#4318FF' },
  { name: 'Điều khiển', value: 25, color: '#6AD01F' },
  { name: 'Nút nhấn', value: 20, color: '#F97316' },
  { name: 'Khác', value: 20, color: '#EC4899' },
];

const monthlyRevenue = [
  { month: 'Th1', revenue: 24000 },
  { month: 'Th2', revenue: 35000 },
  { month: 'Th3', revenue: 28000 },
  { month: 'Th4', revenue: 42000 },
  { month: 'Th5', revenue: 38000 },
  { month: 'Th6', revenue: 45000 },
];

/* ================= COMPONENT ================= */

export default function DashboardPage() {
  // Tính tổng cho pie chart
  const totalCategory = categoryData.reduce((sum, item) => sum + item.value, 0);

  // Tìm max revenue cho bar chart
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));

  return (
    <div className="space-y-6">
      {/* ───────────── Row 1: Stats ───────────── */}
      <div className="grid grid-cols-5 gap-6">
        {stats.map((item) => (
          <Card
            key={item.title}
            className="border-none shadow-sm bg-white rounded"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-[#2B3674]">
                  {item.value}
                </p>
                <span className="text-sm font-bold text-[#A3AED0]">
                  {item.title}
                </span>
              </div>

              <div className="w-12 h-12 rounded flex items-center justify-center bg-[#F4F7FE]">
                <item.icon className="w-6 h-6 text-[#4318FF]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ───────────── Row 2: Charts ───────────── */}
      <div className="grid grid-cols-3 gap-6">
        {/* Doanh số theo thời gian */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded">
          <CardHeader className="flex items-center justify-between p-6 pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">
              Doanh số theo thời gian
            </CardTitle>

            <div className="flex items-center gap-2 bg-[#F4F7FE] rounded px-3 py-1.5 cursor-pointer">
              <span className="text-xs font-bold text-[#2B3674]">
                02 Th3, 2026
              </span>
              <Calendar className="w-4 h-4 text-[#4318FF]" />
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0 flex flex-row gap-8">
            {/* Chart */}
            <div className="flex-1 min-h-[240px]">
              <svg viewBox="0 0 400 160" className="w-full h-full">
                <path
                  d="M0 140 L80 100 L160 120 L240 70 L320 110 L400 60"
                  fill="none"
                  stroke="#E9EDF7"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <path
                  d="M0 150 L80 80 L160 110 L240 50 L320 120 L400 40"
                  fill="none"
                  stroke="#4318FF"
                  strokeWidth="3"
                />
              </svg>

              <div className="flex justify-between text-[11px] font-bold text-[#A3AED0] mt-2">
                {['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>

            {/* Side List */}
            <div className="w-56 space-y-6">
              <div>
                <p className="text-2xl font-bold text-[#2B3674]">
                  23.59M đ
                </p>
                <p className="text-xs font-bold text-[#A3AED0]">
                  Số dư khả dụng
                </p>
              </div>

              <div className="space-y-4">
                {topProducts.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded border border-[#E9EDF7]">
                        <item.icon className="w-4 h-4 text-[#4318FF]" />
                      </div>
                      <span className="text-xs font-bold text-[#A3AED0]">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#2B3674]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full py-1 text-[11px] font-bold text-[#4318FF] flex items-center justify-center gap-1 hover:underline">
                Xem thêm <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Doanh số hàng tuần */}
        <Card className="border-none shadow-sm bg-white rounded">
          <CardHeader className="flex items-center justify-between p-6 pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">
              Doanh số hàng tuần
            </CardTitle>

            <div className="text-xs font-bold text-[#A3AED0] flex items-center gap-1 cursor-pointer">
              Hôm nay <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex items-end justify-between h-40 gap-2 px-2 border-b border-[#E9EDF7] pb-4">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] font-bold text-[#A3AED0]">
                    {d.value}%
                  </span>
                  <div
                    className="w-2.5 bg-[#4318FF] rounded-full"
                    style={{ height: `${d.value * 5}px` }}
                  />
                  <span className="text-[10px] font-bold text-[#A3AED0]">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-center text-[10px] font-bold text-[#A3AED0] mt-4">
              Tổng doanh số & khỏe nhân viên trong tuần
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <p className="text-xl font-bold text-[#2B3674]">502K</p>
                <p className="text-[10px] font-bold text-[#A3AED0]">
                  Tổng ĐH
                </p>
              </div>

              <div className="text-center border-l border-[#E9EDF7]">
                <p className="text-xl font-bold text-[#2B3674]">65.4M</p>
                <p className="text-[10px] font-bold text-[#A3AED0]">
                  Tổng thu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ───────────── Row 3: More Charts ───────────── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Doanh số theo danh mục */}
        <Card className="border-none shadow-sm bg-white rounded">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">
              Doanh số theo danh mục
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 pt-4">
            <div className="flex items-center justify-between">
              {/* Pie Chart */}
              <div className="w-32 h-32 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {categoryData.map((item, idx) => {
                    const percentage = (item.value / totalCategory) * 360;
                    const startAngle = categoryData.slice(0, idx).reduce((sum, i) => sum + (i.value / totalCategory) * 360, 0);
                    const endAngle = startAngle + percentage;

                    // Tính toán vị trí circle
                    const startRad = (startAngle - 90) * (Math.PI / 180);
                    const endRad = (endAngle - 90) * (Math.PI / 180);
                    const x1 = 50 + 40 * Math.cos(startRad);
                    const y1 = 50 + 40 * Math.sin(startRad);
                    const x2 = 50 + 40 * Math.cos(endRad);
                    const y2 = 50 + 40 * Math.sin(endRad);
                    const largeArc = percentage > 180 ? 1 : 0;

                    return (
                      <path
                        key={idx}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={item.color}
                        opacity="0.9"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex-1 ml-6 space-y-3">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#2B3674]">{item.name}</p>
                      <p className="text-[10px] text-[#A3AED0]">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doanh thu hàng tháng */}
        <Card className="border-none shadow-sm bg-white rounded">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">
              Doanh thu 6 tháng
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 pt-4">
            <div className="flex items-end justify-between h-44 gap-2 px-2 border-b border-[#E9EDF7] pb-4">
              {monthlyRevenue.map((m) => {
                const height = (m.revenue / maxRevenue) * 100;
                return (
                  <div key={m.month} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-[#4318FF] to-[#6C5CF7] rounded-t"
                      style={{ height: `${height}%`, minHeight: '20px' }}
                      title={`${m.revenue.toLocaleString('vi')} đ`}
                    />
                    <span className="text-[10px] font-bold text-[#A3AED0] mt-2">
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs text-[#A3AED0]">TB cao nhất</p>
                <p className="text-xl font-bold text-[#2B3674]">45M đ</p>
              </div>
              <div>
                <p className="text-xs text-[#A3AED0]">TB thấp nhất</p>
                <p className="text-xl font-bold text-[#2B3674]">24M đ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
