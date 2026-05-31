'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Download,
  Loader2,
  AlertCircle
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
import { toast } from 'sonner';

export default function ReportsRevenuePage() {
  const [filterType, setFilterType] = useState('6_months');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<RevenueReportResponse | null>(null);

  const fetchRevenueReport = useCallback(async (filter: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AnalyticsService.getRevenueReport(filter);
      setReportData(res);
    } catch (err: any) {
      console.error('Lỗi khi tải báo cáo doanh thu:', err);
      setError(err.message || 'Không thể tải báo cáo. Vui lòng kiểm tra kết nối.');
      toast.error('Lỗi tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenueReport(filterType);
  }, [filterType, fetchRevenueReport]);

  const handleExportCSV = () => {
    if (!reportData?.tableData) return;
    
    const headers = ['Tháng', 'Doanh thu', 'Chi phí', 'Lợi nhuận', 'Tăng trưởng'];
    const rows = reportData.tableData.map(d => [d.month, d.revenue, d.cost, d.profit, d.growth]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bao_cao_doanh_thu_${filterType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đã xuất file CSV thành công!');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-red-100 shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-gray-800">Đã xảy ra lỗi</h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <button 
          onClick={() => fetchRevenueReport(filterType)}
          className="bg-[#4318FF] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3514CC] transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const stats = reportData ? [
    { title: 'Doanh thu', value: `${(reportData.monthlyRevenue / 1e9).toFixed(2)} tỷ đ`, icon: DollarSign, change: `${reportData.growthRate >= 0 ? '+' : ''}${reportData.growthRate.toFixed(1)}%`, isUp: reportData.growthRate >= 0, color: 'text-[#4318FF]', bg: 'bg-[#F4F7FE]' },
    { title: 'Chi phí', value: `${(reportData.monthlyCost / 1e6).toFixed(1)} tr đ`, icon: TrendingDown, change: 'Định mức 30%', isUp: false, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Lợi nhuận gộp', value: `${(reportData.monthlyProfit / 1e6).toFixed(1)} tr đ`, icon: TrendingUp, change: 'Định mức 70%', isUp: true, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Lợi nhuận ròng', value: `${((reportData.monthlyProfit * 0.85) / 1e6).toFixed(1)} tr đ`, icon: BarChart3, change: 'Sau thuế (giả định)', isUp: true, color: 'text-purple-500', bg: 'bg-purple-50' },
  ] : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674] tracking-tight">Báo cáo tài chính & Doanh thu</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Phân tích kinh doanh thực tế từ hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 p-1">
            {['3_months', '6_months', '12_months'].map((f) => (
              <button key={f} onClick={() => setFilterType(f)} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filterType === f ? 'bg-[#4318FF] text-white shadow-md' : 'text-[#A3AED0] hover:text-[#2B3674]'}`}>
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white border border-gray-200 text-[#2B3674] hover:bg-gray-50 px-3.5 py-2 rounded-lg text-sm font-semibold shadow-sm">
            <Download className="w-4 h-4" /> Xuất file
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-gray-50">
          <Loader2 className="w-8 h-8 text-[#4318FF] animate-spin mr-3" />
          <span className="text-sm font-semibold text-[#2B3674]">Đang tải dữ liệu từ server...</span>
        </div>
      ) : reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <Card key={s.title} className="border-none shadow-sm bg-white rounded-xl">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">{s.title}</span>
                    <p className="text-2xl font-bold text-[#2B3674] mt-1">{s.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-sm bg-white rounded-xl">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg font-bold text-[#2B3674]">Xu hướng Tài chính</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={reportData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E9EDF7" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#A3AED0', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#A3AED0', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Legend />
                    <Bar dataKey="DoanhThu" fill="#4318FF" radius={[6, 6, 0, 0]} name="Doanh thu" />
                    <Bar dataKey="ChiPhi" fill="#EC4899" radius={[6, 6, 0, 0]} name="Chi phí" />
                    <Line type="monotone" dataKey="LoiNhuan" stroke="#05CD99" strokeWidth={3} name="Lợi nhuận" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
