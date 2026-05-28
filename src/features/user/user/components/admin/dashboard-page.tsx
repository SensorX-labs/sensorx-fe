'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Package,
  DollarSign,
  Users,
  Truck,
  Calendar,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  MoreHorizontal,
  Loader2
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
import AnalyticsService, { 
  DashboardStatsResponse, 
  MasterStatsResponse,
  RevenueReportResponse 
} from '@/features/system/analytics/services/analytics-service';

const timeRangeMap: Record<string, string> = {
  'Hôm nay': 'today',
  'Tuần này': 'week',
  'Tháng này': 'month',
  'Năm nay': 'year',
  'Toàn thời gian': 'all'
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('Tháng này');
  const [loading, setLoading] = useState(true);
  
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsResponse | null>(null);
  const [masterStats, setMasterStats] = useState<MasterStatsResponse | null>(null);
  const [revenueReport, setRevenueReport] = useState<RevenueReportResponse | null>(null);

  const fetchStats = async (range: string) => {
    setLoading(true);
    try {
      const apiRange = timeRangeMap[range] || 'month';
      const [dashRes, masterRes, revenueRes] = await Promise.all([
        AnalyticsService.getDashboardStats(apiRange),
        AnalyticsService.getMasterStats(),
        AnalyticsService.getRevenueReport('6_months')
      ]);

      if (dashRes) {
        setDashboardStats(dashRes);
      }
      if (masterRes) {
        setMasterStats(masterRes);
      }
      if (revenueRes) {
        setRevenueReport(revenueRes);
      }
    } catch (error) {
      console.error('>>> Loi khi tai du lieu thong ke:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(timeRange);
  }, [timeRange]);

  // Derived stats
  const stats = [
    { 
      title: 'Tổng doanh thu', 
      value: dashboardStats ? `${(dashboardStats.totalRevenue / 1000000).toFixed(1)} trđ` : '0 trđ', 
      icon: DollarSign, 
      color: 'text-[#4318FF]', 
      bg: 'bg-[#F4F7FE]' 
    },
    { 
      title: 'Đơn hàng', 
      value: dashboardStats ? `${dashboardStats.totalOrders} đơn` : '0 đơn', 
      icon: ShoppingBag, 
      color: 'text-green-500', 
      bg: 'bg-green-50' 
    },
    { 
      title: 'Giá trị ĐH TB', 
      value: dashboardStats ? `${(dashboardStats.averageOrderValue / 1000000).toFixed(1)} trđ` : '0 trđ', 
      icon: TrendingUp, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50' 
    },
    { 
      title: 'Khách hàng', 
      value: masterStats ? `${masterStats.totalCustomers}` : '0', 
      icon: Users, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50' 
    },
    { 
      title: 'Danh mục SP', 
      value: masterStats ? `${masterStats.totalProducts} SP` : '0 SP', 
      icon: Package, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
  ];

  // Map weekly sales for BarChart
  const weeklyData = dashboardStats?.weeklySales || [
    { day: 'T2', value: 0 },
    { day: 'T3', value: 0 },
    { day: 'T4', value: 0 },
    { day: 'T5', value: 0 },
    { day: 'T6', value: 0 },
    { day: 'T7', value: 0 },
    { day: 'CN', value: 0 },
  ];

  // Map chartData from revenueReport to AreaChart
  const revenueChartData = revenueReport?.chartData || [
    { name: 'Th10', DoanhThu: 0, LoiNhuan: 0 },
    { name: 'Th11', DoanhThu: 0, LoiNhuan: 0 },
    { name: 'Th12', DoanhThu: 0, LoiNhuan: 0 },
    { name: 'Th1', DoanhThu: 0, LoiNhuan: 0 },
    { name: 'Th2', DoanhThu: 0, LoiNhuan: 0 },
    { name: 'Th3', DoanhThu: 0, LoiNhuan: 0 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ───────────── Header & Filters ───────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674] tracking-tight">Tổng quan hệ thống</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Theo dõi các chỉ số và dữ liệu thực tế tại SensorX</p>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 p-1">
            {['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay', 'Toàn thời gian'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-[#4318FF] text-white shadow-md'
                    : 'text-[#A3AED0] hover:text-[#2B3674] hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-[#F4F7FE] text-[#4318FF] hover:bg-[#E9EDF7] px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Calendar className="w-4 h-4" />
            Live Monitor
          </button>
        </div>
      </div>

      {/* ───────────── Loading spinner ───────────── */}
      {loading && (
        <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-50">
          <Loader2 className="w-8 h-8 text-[#4318FF] animate-spin mr-3" />
          <span className="text-sm font-semibold text-[#2B3674]">Đang tải dữ liệu thực tế...</span>
        </div>
      )}

      {/* ───────────── Row 1: Stats ───────────── */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((item, i) => (
            <Card
              key={item.title}
              className="border-none shadow-sm bg-white rounded-xl hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
                    Hoạt động
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#A3AED0] mb-1">{item.title}</p>
                  <p className="text-2xl font-bold text-[#2B3674] tracking-tight">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ───────────── Row 2: Charts ───────────── */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doanh số theo thời gian (Area Chart) */}
          <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
              <div>
                <CardTitle className="text-lg font-bold text-[#2B3674]">Biểu đồ doanh thu</CardTitle>
                <p className="text-xs text-[#A3AED0] mt-1">Phân tích xu hướng doanh thu và lợi nhuận (triệu đ)</p>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 text-[#A3AED0]" />
              </button>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4318FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4318FF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#05CD99" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#05CD99" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EDF7" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="DoanhThu" name="Doanh thu" stroke="#4318FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="LoiNhuan" name="Lợi nhuận" stroke="#05CD99" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Sản phẩm bán chạy nhất */}
          <Card className="border-none shadow-sm bg-white rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
              <CardTitle className="text-lg font-bold text-[#2B3674]">Top Sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="space-y-5">
                {dashboardStats?.topSellingProducts && dashboardStats.topSellingProducts.length > 0 ? (
                  dashboardStats.topSellingProducts.map((item, i) => (
                    <div key={item.productId} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F4F7FE] flex items-center justify-center group-hover:bg-[#4318FF] group-hover:text-white transition-colors text-[#4318FF]">
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="max-w-[150px]">
                          <p className="text-sm font-bold text-[#2B3674] group-hover:text-[#4318FF] transition-colors truncate">{item.productName}</p>
                          <p className="text-xs text-[#A3AED0]">Mã: {item.productCode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#2B3674]">{item.quantitySold} cái</p>
                        <p className="text-[10px] text-[#A3AED0]">{(item.totalAmount / 1000000).toFixed(1)} trđ</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-[#A3AED0]">
                    Không có sản phẩm nào bán chạy trong kì
                  </div>
                )}
              </div>
              <button className="w-full mt-6 py-2.5 text-sm font-bold text-[#4318FF] bg-[#F4F7FE] rounded-lg hover:bg-[#E9EDF7] transition-colors flex items-center justify-center gap-2">
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ───────────── Row 3: Bar & Category Charts ───────────── */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tần suất đặt hàng tuần (Bar Chart) */}
          <Card className="border-none shadow-sm bg-white rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
              <div>
                <CardTitle className="text-lg font-bold text-[#2B3674]">Tần suất đơn hàng</CardTitle>
                <p className="text-xs text-[#A3AED0] mt-1">Lượng đơn hàng theo các ngày trong tuần (7 ngày gần nhất)</p>
              </div>
              <div className="text-xs font-bold text-[#4318FF] bg-[#F4F7FE] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-[#E9EDF7] transition-colors">
                Tuần này <ChevronRight className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EDF7" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: '#F4F7FE' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#4318FF" radius={[4, 4, 0, 0]} barSize={32} name="Doanh số ngày" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Master data summary card */}
          <Card className="border-none shadow-sm bg-white rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#2B3674] mb-1">Thống kê Dữ liệu Master</h3>
              <p className="text-xs text-[#A3AED0] mb-6">Thông tin đăng ký phân hệ kinh doanh trên hệ thống</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F4F7FE] border border-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2B3674]">Khách hàng đối tác</h4>
                      <p className="text-xs text-[#A3AED0]">Đã đăng ký tài khoản doanh nghiệp</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-[#2B3674]">{masterStats?.totalCustomers ?? 0}</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-green-50/50 border border-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2B3674]">Danh mục Sản phẩm</h4>
                      <p className="text-xs text-[#A3AED0]">Hàng hoá Catalog SensorX</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-[#2B3674]">{masterStats?.totalProducts ?? 0}</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50/50 border border-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2B3674]">Nhân sự Vận hành</h4>
                      <p className="text-xs text-[#A3AED0]">Được cấp quyền truy cập hệ thống</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-[#2B3674]">{masterStats?.totalStaffs ?? 0}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#A3AED0]">
              <span>Dữ liệu đồng bộ trực tiếp từ phân hệ Data</span>
              <span className="font-bold text-green-500 flex items-center">● Online</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
