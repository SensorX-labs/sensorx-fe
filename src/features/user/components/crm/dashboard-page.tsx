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
  Facebook,
  Twitter,
  ArrowRight,
  Smartphone,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/shadcn-ui/card';

/* ================= TYPES & DATA ================= */

const stats = [
  { title: 'Total Sales', value: '46.34k', icon: ShoppingBag },
  { title: 'Total Items', value: '3,895', icon: Package },
  { title: 'Average Sales', value: '$61,985', icon: DollarSign },
  { title: 'Total Users', value: '12,584', icon: Users },
  { title: 'Order Delivery', value: '24,526', icon: Truck },
];

const salesList = [
  { label: 'Smart Camera', value: '56,236', icon: Monitor },
  { label: 'Ipad 2021 Model', value: '220k', icon: Tablet },
  { label: 'New Smart 4k TV', value: '51,568', icon: Tv },
  { label: 'Mackbook 18 inch', value: '1,568', icon: Monitor },
];

const weeklyData = [
  { day: 'M', value: 12 },
  { day: 'T', value: 18 },
  { day: 'W', value: 12 },
  { day: 'T', value: 15 },
  { day: 'F', value: 18 },
  { day: 'S', value: 13 },
  { day: 'S', value: 15 },
];

/* ================= COMPONENT ================= */

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* ───────────── Row 1: Stats ───────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((item) => (
          <Card
            key={item.title}
            className="border-none shadow-sm bg-white rounded-lg"
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

              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#F4F7FE]">
                <item.icon className="w-6 h-6 text-[#4318FF]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ───────────── Row 2: Charts ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Over Time */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-lg">
          <CardHeader className="flex items-center justify-between p-6 pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">
              Sales Over Time By Value
            </CardTitle>

            <div className="flex items-center gap-2 bg-[#F4F7FE] rounded-lg px-3 py-1.5 cursor-pointer">
              <span className="text-xs font-bold text-[#2B3674]">
                02 Mar, 2026
              </span>
              <Calendar className="w-4 h-4 text-[#4318FF]" />
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0 flex flex-col md:flex-row gap-8">
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
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>

            {/* Side List */}
            <div className="w-full md:w-56 space-y-6">
              <div>
                <p className="text-2xl font-bold text-[#2B3674]">
                  $23,590.00
                </p>
                <p className="text-xs font-bold text-[#A3AED0]">
                  Available Balance
                </p>
              </div>

              <div className="space-y-4">
                {salesList.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg border border-[#E9EDF7]">
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
                View more <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Sales */}
        <Card className="border-none shadow-sm bg-white rounded-lg">
          <CardHeader className="flex items-center justify-between p-6 pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">
              Weekly Sales
            </CardTitle>

            <div className="text-xs font-bold text-[#A3AED0] flex items-center gap-1 cursor-pointer">
              Today <ChevronRight className="w-4 h-4 rotate-90" />
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
              This Week Total Sales And Earning
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <p className="text-xl font-bold text-[#2B3674]">502K</p>
                <p className="text-[10px] font-bold text-[#A3AED0]">
                  Total Sales
                </p>
              </div>

              <div className="text-center border-l border-[#E9EDF7]">
                <p className="text-xl font-bold text-[#2B3674]">65.4M</p>
                <p className="text-[10px] font-bold text-[#A3AED0]">
                  Total Funding
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
