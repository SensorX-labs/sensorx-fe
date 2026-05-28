'use client';

import React, { useState } from 'react';
import { ShoppingBag, Users, Package, Award, Download, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const stats = [
  { title: 'Đơn hàng tháng này', value: '248', icon: ShoppingBag, change: '+18.4%', color: 'text-[#4318FF]', bg: 'bg-[#F4F7FE]' },
  { title: 'Khách hàng mới', value: '42', icon: Users, change: '+12.5%', color: 'text-blue-500', bg: 'bg-blue-50' },
  { title: 'Sản phẩm bán ra', value: '1,340', icon: Package, change: '+8.2%', color: 'text-green-500', bg: 'bg-green-50' },
  { title: 'SP bán chạy nhất', value: 'CAM-4K', icon: Award, change: 'Top 1', color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

const salesTrendData = [
  { day: 'Thứ 2', 'Đơn hàng': 28, 'Doanh số': 52.4 },
  { day: 'Thứ 3', 'Đơn hàng': 35, 'Doanh số': 68.2 },
  { day: 'Thứ 4', 'Đơn hàng': 22, 'Doanh số': 41.5 },
  { day: 'Thứ 5', 'Đơn hàng': 40, 'Doanh số': 89.0 },
  { day: 'Thứ 6', 'Đơn hàng': 52, 'Doanh số': 110.5 },
  { day: 'Thứ 7', 'Đơn hàng': 48, 'Doanh số': 95.8 },
  { day: 'Chủ nhật', 'Đơn hàng': 30, 'Doanh số': 60.1 },
];

const topProducts = [
  { rank: 1, name: 'Camera an ninh 4K', sku: 'CAM-4K-001', sold: 245, revenue: '600,250,000', trend: '+18%' },
  { rank: 2, name: 'Đầu ghi hình 16 kênh', sku: 'DVR-16CH', sold: 186, revenue: '706,800,000', trend: '+12%' },
  { rank: 3, name: 'Bộ nguồn UPS 1000VA', sku: 'UPS-1000', sold: 154, revenue: '269,500,000', trend: '+5%' },
  { rank: 4, name: 'Cáp mạng Cat6 (cuộn)', sku: 'CBL-CAT6', sold: 132, revenue: '73,920,000', trend: '-3%' },
  { rank: 5, name: 'Màn hình giám sát 27"', sku: 'MON-27-PRO', sold: 98, revenue: '509,600,000', trend: '+22%' },
];

export default function ReportsSalesPage() {
  const [activeTab, setActiveTab] = useState('volume');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ───────────── Header & Action ───────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674] tracking-tight">Báo cáo Bán hàng (Sales)</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Phân tích hiệu suất bán hàng, sản phẩm và lượng khách hàng mới</p>
        </div>
        
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#2B3674] hover:bg-gray-50 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm self-end sm:self-auto">
          <Download className="w-4 h-4" />
          Xuất báo cáo tuần
        </button>
      </div>

      {/* ───────────── Row 1: Key Metrics ───────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.title} className="border-none shadow-sm bg-white rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">{s.title}</span>
                <p className="text-2xl font-bold text-[#2B3674]">{s.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-bold text-green-500">{s.change}</span>
                  <span className="text-[10px] text-[#A3AED0]">tăng trưởng</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ───────────── Row 2: Sales Charts ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doanh số & Sản lượng (Line / Bar Charts) */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
            <div>
              <CardTitle className="text-lg font-bold text-[#2B3674]">Xu hướng Bán hàng Tuần này</CardTitle>
              <p className="text-xs text-[#A3AED0] mt-1">Phân tích lượng đơn hàng và giá trị doanh số (triệu đ)</p>
            </div>
            
            <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
              <button 
                onClick={() => setActiveTab('volume')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${activeTab === 'volume' ? 'bg-white text-[#2B3674] shadow-sm' : 'text-[#A3AED0]'}`}
              >
                Đơn hàng
              </button>
              <button 
                onClick={() => setActiveTab('revenue')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${activeTab === 'revenue' ? 'bg-white text-[#2B3674] shadow-sm' : 'text-[#A3AED0]'}`}
              >
                Doanh số
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="h-[260px] w-full">
              {activeTab === 'volume' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E9EDF7" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="Đơn hàng" fill="#4318FF" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E9EDF7" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="Doanh số" stroke="#05CD99" strokeWidth={3} dot={{ r: 4 }} name="Doanh số (Triệu đ)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live conversion / insights */}
        <Card className="border-none shadow-sm bg-white rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#2B3674]">Đánh giá Hiệu suất</h3>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#4318FF]/5 to-[#4318FF]/0 border border-[#4318FF]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#A3AED0]">Tỉ lệ chuyển đổi</span>
                <span className="text-xs font-bold text-[#4318FF] flex items-center"><ArrowUpRight className="w-3 h-3 mr-0.5" /> +2.4%</span>
              </div>
              <p className="text-2xl font-black text-[#2B3674]">68.5%</p>
              <p className="text-[10px] text-[#A3AED0] mt-1">Từ Báo giá (Quote) sang Đơn hàng thực tế</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-transparent border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#A3AED0]">Đơn hàng hoàn tất</span>
                <span className="text-xs font-bold text-green-600">Ổn định</span>
              </div>
              <p className="text-2xl font-black text-[#2B3674]">94.2%</p>
              <p className="text-[10px] text-[#A3AED0] mt-1">Không xảy ra lỗi hoàn trả hoặc khiếu nại</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#4318FF] cursor-pointer hover:underline">
            <span>Xem chiến dịch khuyến mãi</span>
            <TrendingUp className="w-4 h-4" />
          </div>
        </Card>
      </div>

      {/* ───────────── Row 3: Top Selling Products Table ───────────── */}
      <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-[#2B3674]">Top sản phẩm bán chạy nhất</CardTitle>
          <p className="text-xs text-[#A3AED0] mt-1">Danh sách sản phẩm tạo ra nhiều doanh số và sản lượng tiêu thụ lớn</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F9FC] text-[#A3AED0]">
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider w-[80px]">Thứ hạng</th>
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Sản phẩm</th>
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">SKU</th>
                  <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Số lượng bán</th>
                  <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Doanh thu mang lại</th>
                  <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Xu hướng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topProducts.map((p) => (
                  <tr key={p.rank} className="hover:bg-[#F4F7FE] transition-colors">
                    <td className="px-6 py-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                        p.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                        p.rank === 2 ? 'bg-gray-100 text-gray-600' : 
                        p.rank === 3 ? 'bg-orange-100 text-orange-700' : 
                        'bg-slate-50 text-[#A3AED0]'
                      }`}>
                        #{p.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#2B3674]">{p.name}</td>
                    <td className="px-6 py-4 text-[#A3AED0] font-mono text-xs">{p.sku}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#2B3674]">{p.sold}</td>
                    <td className="px-6 py-4 text-right font-medium text-[#2B3674]">{p.revenue} đ</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        p.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                      }`}>
                        {p.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
