'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Download,
  Filter,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import AnalyticsService, { RevenueReportResponse } from '@/features/system/analytics/services/analytics-service';

export default function ReportsRevenuePage() {
  const [filterType, setFilterType] = useState('6_months');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<RevenueReportResponse | null>(null);

  const fetchRevenueReport = async (filter: string) => {
    setLoading(true);
    try {
      const res = await AnalyticsService.getRevenueReport(filter);
      if (res) {
        setReportData(res);
      }
    } catch (error) {
      console.error('>>> Loi khi tai bao cao doanh thu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueReport(filterType);
  }, [filterType]);

  const stats = [
    { 
      title: 'Doanh thu tháng này', 
      value: reportData ? `${(reportData.monthlyRevenue / 1000000000).toFixed(2)} tỷ đ` : '0 đ', 
      icon: DollarSign, 
      change: reportData ? `${reportData.growthRate >= 0 ? '+' : ''}${reportData.growthRate.toFixed(1)}%` : '0%', 
      isUp: reportData ? reportData.growthRate >= 0 : true, 
      color: 'text-[#4318FF]', 
      bg: 'bg-[#F4F7FE]' 
    },
    { 
      title: 'Chi phí tháng này', 
      value: reportData ? `${(reportData.monthlyCost / 1000000).toFixed(1)} tr đ` : '0 đ', 
      icon: TrendingDown, 
      change: 'Định mức 30%', 
      isUp: false, 
      color: 'text-red-500', 
      bg: 'bg-red-50' 
    },
    { 
      title: 'Lợi nhuận gộp', 
      value: reportData ? `${(reportData.monthlyProfit / 1000000).toFixed(1)} tr đ` : '0 đ', 
      icon: TrendingUp, 
      change: 'Định mức 70%', 
      isUp: true, 
      color: 'text-green-500', 
      bg: 'bg-green-50' 
    },
    { 
      title: 'Lợi nhuận ròng', 
      value: reportData ? `${((reportData.monthlyProfit * 0.85) / 1000000).toFixed(1)} tr đ` : '0 đ', 
      icon: BarChart3, 
      change: 'Sau thuế (giả định)', 
      isUp: true, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50' 
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ───────────── Header & Filters ───────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674] tracking-tight">Báo cáo tài chính & Doanh thu</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Phân tích chuyên sâu về tình hình kinh doanh của doanh nghiệp</p>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 p-1">
            <button
              onClick={() => setFilterType('3_months')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filterType === '3_months' ? 'bg-[#4318FF] text-white shadow-md' : 'text-[#A3AED0] hover:text-[#2B3674]'
              }`}
            >
              3 tháng qua
            </button>
            <button
              onClick={() => setFilterType('6_months')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filterType === '6_months' ? 'bg-[#4318FF] text-white shadow-md' : 'text-[#A3AED0] hover:text-[#2B3674]'
              }`}
            >
              6 tháng qua
            </button>
            <button
              onClick={() => setFilterType('12_months')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filterType === '12_months' ? 'bg-[#4318FF] text-white shadow-md' : 'text-[#A3AED0] hover:text-[#2B3674]'
              }`}
            >
              Năm nay
            </button>
          </div>

          <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#2B3674] hover:bg-gray-50 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Xuất file
          </button>
        </div>
      </div>

      {/* ───────────── Loading spinner ───────────── */}
      {loading && (
        <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-50">
          <Loader2 className="w-8 h-8 text-[#4318FF] animate-spin mr-3" />
          <span className="text-sm font-semibold text-[#2B3674]">Đang phân tích báo cáo doanh thu...</span>
        </div>
      )}

      {/* ───────────── Row 1: Key Metrics ───────────── */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <Card key={s.title} className="border-none shadow-sm bg-white rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">{s.title}</span>
                  <p className="text-2xl font-bold text-[#2B3674]">{s.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs font-bold ${s.isUp ? 'text-green-500' : 'text-red-500'}`}>{s.change}</span>
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
      )}

      {/* ───────────── Row 2: Financial Charts ───────────── */}
      {!loading && reportData && (
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
            <div>
              <CardTitle className="text-lg font-bold text-[#2B3674]">Xu hướng Tài chính</CardTitle>
              <p className="text-xs text-[#A3AED0] mt-1">So sánh Doanh thu, Chi phí và Lợi nhuận gộp hàng tháng (đơn vị: triệu đ)</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A3AED0]">
              <Filter className="w-4 h-4" /> Lọc nâng cao
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={reportData.chartData} margin={{ top: 10, right: -5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9EDF7" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px -2px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                  <Bar dataKey="DoanhThu" fill="#4318FF" radius={[6, 6, 0, 0]} barSize={24} name="Doanh thu" />
                  <Bar dataKey="ChiPhi" fill="#EC4899" radius={[6, 6, 0, 0]} barSize={24} name="Chi phí" />
                  <Line type="monotone" dataKey="LoiNhuan" stroke="#05CD99" strokeWidth={3} dot={{ r: 4 }} name="Lợi nhuận" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ───────────── Row 3: Detail Data Table ───────────── */}
      {!loading && reportData && (
        <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#2B3674]">Chi tiết Bảng số liệu</CardTitle>
              <p className="text-xs text-[#A3AED0] mt-1">Dữ liệu chi tiết từng tháng phục vụ xuất báo cáo thuế</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FC] text-[#A3AED0]">
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Tháng báo cáo</th>
                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Doanh thu</th>
                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Chi phí phát sinh</th>
                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Lợi nhuận thực tế</th>
                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Tăng trưởng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportData.tableData.map((m) => (
                    <tr key={m.month} className="hover:bg-[#F4F7FE] transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#2B3674]">{m.month}</td>
                      <td className="px-6 py-4 text-right font-medium text-[#2B3674]">{m.revenue.toLocaleString()} đ</td>
                      <td className="px-6 py-4 text-right text-[#A3AED0]">{m.cost.toLocaleString()} đ</td>
                      <td className="px-6 py-4 text-right font-bold text-[#05CD99]">{m.profit.toLocaleString()} đ</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          m.growth.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                        }`}>
                          {m.growth}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
