'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  DollarSign,
  Users,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Loader2,
  AlertTriangle,
  Info,
  Search,
  ExternalLink,
  Target,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/shadcn-ui/card';
import AnalyticsService from '@/features/system/analytics/services/analytics-service';
import { DashboardAdapter } from './dashboard-adapter';

const timeRangeMap: Record<string, string> = {
  'Hôm nay': 'today',
  'Tuần này': 'week',
  'Tháng này': 'month',
  'Năm nay': 'year',
  'Toàn thời gian': 'all'
};

const timeRangeToRevenueFilter: Record<string, string> = {
  'Hôm nay': 'today',
  'Tuần này': 'week',
  'Tháng này': 'month',
  'Năm nay': 'year',
  'Toàn thời gian': 'all'
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('Tháng này');
  const [loading, setLoading] = useState(true);
  
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [masterStats, setMasterStats] = useState<any>(null);
  const [revenueReport, setRevenueReport] = useState<any>(null);

  const fetchStats = async (range: string) => {
    setLoading(true);
    try {
      const apiRange = timeRangeMap[range] || 'month';
      const revenueFilter = timeRangeToRevenueFilter[range] || 'month';
      
      const [dashRes, masterRes, revenueRes] = await Promise.all([
        AnalyticsService.getDashboardStats(apiRange),
        AnalyticsService.getMasterStats(apiRange),
        AnalyticsService.getRevenueReport(revenueFilter)
      ]);

      if (dashRes) setDashboardStats(dashRes);
      if (masterRes) setMasterStats(masterRes);
      if (revenueRes) setRevenueReport(revenueRes);
    } catch (error) {
      console.error('>>> Loi khi tai du lieu thong ke:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(timeRange);
  }, [timeRange]);

  const cleanedData = DashboardAdapter.mapDashboardData(
    dashboardStats,
    masterStats,
    revenueReport,
    timeRange
  );

  const formatCurrency = (val: number) => {
    if (val > 100000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    return `${val.toFixed(1)}M`;
  };

  // Custom styled Tooltip for AreaChart
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const revenue = payload[0]?.value || 0;
      const profit = payload[1]?.value || 0;
      const margin = payload[0]?.payload?.margin || 0;
      return (
        <div className="bg-white border border-zinc-100 p-3 rounded-lg shadow-sm text-xs space-y-1">
          <p className="font-semibold text-zinc-900 mb-1">{label}</p>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Doanh thu:</span>
            <span className="font-medium text-zinc-900">{formatCurrency(revenue * 1000000)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Lợi nhuận:</span>
            <span className="font-medium text-zinc-900">{formatCurrency(profit * 1000000)}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-zinc-50 pt-1 mt-1">
            <span className="text-zinc-500 font-medium">Biên LN:</span>
            <span className="font-bold text-emerald-600">{margin}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom styled Tooltip for BarChart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0]?.value || 0;
      return (
        <div className="bg-white border border-zinc-100 p-2.5 rounded-lg shadow-sm text-xs">
          <p className="font-semibold text-zinc-500 mb-0.5">{label}</p>
          <div className="flex items-center gap-1.5 font-bold text-zinc-900">
            <span>Số đơn hàng:</span>
            <span>{value} đơn</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 text-zinc-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* ───────────── Premium Header ───────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950">Bảng điều khiển</h2>
          <p className="text-xs text-zinc-500 mt-1">Hệ thống phân tích thông tin vận hành & tài chính SensorX</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Global Search shortcut placeholder */}
          <div className="relative hidden lg:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhanh... (⌘K)" 
              disabled
              className="pl-8 pr-4 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md w-48 text-zinc-400 focus:outline-none cursor-not-allowed"
            />
          </div>

          <div className="flex items-center bg-zinc-50 rounded-md border border-zinc-200 p-0.5">
            {['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay', 'Toàn thời gian'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-medium rounded transition-all duration-150 ${
                  timeRange === range
                    ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            Live Monitor
          </button>
        </div>
      </div>

      {/* ───────────── Loading overlay ───────────── */}
      {loading && (
        <div className="flex items-center justify-center p-20 bg-white border border-zinc-100 rounded-xl shadow-xs">
          <Loader2 className="w-6 h-6 text-zinc-900 animate-spin mr-3" />
          <span className="text-xs font-semibold text-zinc-500">Đang đồng bộ phân tích...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* ───────────── 1. Severity Operational Action Bar ───────────── */}
          {cleanedData.alerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Vận hành khẩn cấp</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cleanedData.alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-3.5 rounded-lg border text-xs flex flex-col justify-between gap-3 transition-colors ${
                      alert.severity === 'critical' 
                        ? 'bg-red-50/20 border-red-100 border-l-4 border-l-red-500' 
                        : 'bg-amber-50/20 border-amber-100 border-l-4 border-l-amber-500'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold tracking-tight uppercase text-[10px] px-1.5 py-0.5 rounded ${
                          alert.severity === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {alert.category}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium uppercase">{alert.severity}</span>
                      </div>
                      <h4 className="font-bold text-zinc-900 mt-1">{alert.title}</h4>
                      <p className="text-zinc-500 leading-relaxed">{alert.message}</p>
                    </div>
                    <Link 
                      href={alert.actionRoute}
                      className={`inline-flex items-center gap-1 font-semibold self-start transition-colors ${
                        alert.severity === 'critical'
                          ? 'text-red-700 hover:text-red-800'
                          : 'text-amber-800 hover:text-amber-900'
                      }`}
                    >
                      {alert.actionText} <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───────────── 2. Hero Metric Grid ───────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Hero Revenue Card */}
            <Card className="lg:col-span-2 border border-zinc-200 shadow-xs bg-white rounded-xl flex flex-col justify-between overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-zinc-500">Doanh thu tích lũy</p>
                    <Link href="/reports/revenue" className="group flex items-baseline gap-2">
                      <h3 className="text-3xl font-extrabold text-zinc-900 tracking-tight group-hover:text-zinc-600 transition-colors">
                        {cleanedData.heroRevenue.formattedValue}
                      </h3>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {cleanedData.heroRevenue.growthPercent}%
                  </div>
                </div>

                {/* Progress toward goal */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                    <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Chỉ tiêu tháng</span>
                    <span>{cleanedData.heroRevenue.targetProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-zinc-900 transition-all duration-500 rounded-full" 
                      style={{ width: `${cleanedData.heroRevenue.targetProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Mục tiêu: {cleanedData.heroRevenue.monthlyTarget / 1000000}M VND • Kỳ vọng hoàn thành sớm 3 ngày.
                  </p>
                </div>

                {/* AI Projected Revenue section */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Dự phóng cuối kỳ:</span>
                  </div>
                  <span className="font-bold text-zinc-900">
                    ~{(cleanedData.heroRevenue.projectedRevenue / 1000000).toFixed(1)} trđ
                  </span>
                </div>
              </CardContent>

              {/* Sparkline line at the bottom */}
              <div className="h-12 w-full bg-zinc-50/50 border-t border-zinc-100 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cleanedData.heroRevenue.sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#18181b"
                      strokeWidth={1.5}
                      fillOpacity={0.03}
                      fill="#18181b"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Core KPIs Column Cards */}
            {cleanedData.kpis.map((kpi) => (
              <Card 
                key={kpi.id}
                className="border border-zinc-200 shadow-xs bg-white rounded-xl hover:border-zinc-300 transition-all flex flex-col justify-between"
              >
                <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex justify-between items-center text-zinc-400 mb-2">
                      <span className="text-xs font-medium text-zinc-500">{kpi.title}</span>
                      <Link href={kpi.actionRoute} className="hover:text-zinc-600 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <h4 className="text-2xl font-bold tracking-tight text-zinc-900">{kpi.value}</h4>
                    <p className="text-[10px] text-zinc-400 mt-1">{kpi.subtext}</p>
                  </div>
                  
                  <div className={`text-xs font-semibold flex items-center gap-1.5 self-start px-2 py-0.5 rounded ${
                    kpi.isPositive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.growthText}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ───────────── 3. Centerpiece Revenue Trend & Products ───────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Revenue Area Chart */}
            <Card className="lg:col-span-2 border border-zinc-200 shadow-xs bg-white rounded-xl overflow-hidden">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between p-6 pb-2">
                <div className="space-y-0.5">
                  <Link href="/reports/revenue" className="group flex items-center gap-1.5">
                    <CardTitle className="text-sm font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                      Phân tích xu hướng tài chính
                    </CardTitle>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-650 transition-colors" />
                  </Link>
                  <p className="text-[11px] text-zinc-400">
                    Thống kê doanh thu & lợi nhuận gộp theo kỳ lựa chọn (Scale: Triệu VND)
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />
                    <span>Doanh thu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    <span>Lợi nhuận gộp</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 pt-4">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={cleanedData.revenueTrend} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#71717a', fontSize: 10, fontWeight: 500 }} 
                        dy={8} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#71717a', fontSize: 10, fontWeight: 500 }} 
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="doanhThu" 
                        stroke="#18181b" 
                        strokeWidth={1.5} 
                        fillOpacity={0.01} 
                        fill="#18181b" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="loiNhuan" 
                        stroke="#10b981" 
                        strokeWidth={1.5} 
                        fillOpacity={0.01} 
                        fill="#10b981" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="border border-zinc-200 shadow-xs bg-white rounded-xl flex flex-col justify-between">
              <div>
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-sm font-bold text-zinc-900">
                    Sản phẩm bán chạy
                  </CardTitle>
                  <p className="text-[11px] text-zinc-400">Các mặt hàng có số lượng đặt hàng cao nhất trong kỳ</p>
                </CardHeader>
                
                <CardContent className="p-6 pt-2">
                  <div className="space-y-4">
                    {dashboardStats?.topSellingProducts && dashboardStats.topSellingProducts.length > 0 ? (
                      dashboardStats.topSellingProducts.slice(0, 3).map((item: any) => (
                        <div key={item.productId} className="flex items-center justify-between border-b border-zinc-50 pb-3 last:border-0 last:pb-0">
                          <div className="space-y-0.5">
                            <Link 
                              href="/catalog/products" 
                              className="text-xs font-bold text-zinc-900 hover:text-zinc-600 truncate max-w-[170px] block transition-colors"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-[10px] text-zinc-400">Mã: {item.productCode}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-zinc-900">{item.quantitySold} cái</p>
                            <p className="text-[10px] text-zinc-400">{(item.totalAmount / 1000000).toFixed(1)}M</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-xs text-zinc-400">
                        Không có sản phẩm nào bán chạy trong kì
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>

              <div className="p-6 pt-0 border-t border-zinc-50">
                <Link 
                  href="/catalog/products" 
                  className="w-full mt-4 py-2 text-xs font-semibold text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-md hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1"
                >
                  Xem danh mục hàng hóa <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          </div>

          {/* ───────────── 4. Bottom Order Volume (Dynamic Bar Chart) ───────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Orders Frequency (Bar Chart) - Full Width */}
            <Card className="lg:col-span-3 border border-zinc-200 shadow-xs bg-white rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                <div>
                  <CardTitle className="text-sm font-bold text-zinc-900">Tần suất đơn hàng</CardTitle>
                  <p className="text-[11px] text-zinc-400">Số lượng đơn hàng phát sinh theo bộ lọc thời gian</p>
                </div>
                <Link 
                  href="/sales/orders"
                  className="text-[10px] font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded hover:bg-zinc-100 transition-colors flex items-center gap-0.5"
                >
                  Chi tiết đơn hàng <ChevronRight className="w-3 h-3" />
                </Link>
              </CardHeader>
              
              <CardContent className="p-6 h-[250px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={cleanedData.weeklySales} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 10, fontWeight: 500 }} 
                      dy={8} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 10, fontWeight: 500 }} 
                    />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f4f4f5' }} />
                    <Bar 
                      dataKey="value" 
                      fill="#18181b" 
                      radius={[2, 2, 0, 0]} 
                      barSize={24} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
