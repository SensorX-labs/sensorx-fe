'use client';

import React, { useState } from 'react';
import { useWarehouseAnalytics } from '../../hooks/use-warehouse-analytics';
import { Warehouse, PackagePlus, PackageMinus, DollarSign, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn-ui/select';
import { Skeleton } from '@/shared/components/shadcn-ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function ReportsWarehousePage() {
  const [timeRange, setTimeRange] = useState('month');
  const { data, isLoading, error } = useWarehouseAnalytics(timeRange);

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-red-500 font-medium">Đã có lỗi xảy ra khi tải dữ liệu báo cáo kho.</div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ───────────── Header & Action ───────────── */}
      <div className="flex justify-end mb-4">
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-white text-[#2B3674] font-medium border-gray-200">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>

          <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#2B3674] hover:bg-gray-50 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[360px] w-full rounded-xl" />
            <Skeleton className="h-[360px] w-full rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {/* ───────────── Row 1: Key Metrics ───────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tổng tồn kho */}
            <Card className="border-none shadow-sm bg-white rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Tổng tồn kho</span>
                  <p className="text-2xl font-bold text-[#2B3674]">{formatNumber(data.totalInventory)} SP</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-semibold text-[#A3AED0]">Khối lượng lưu trữ hiện tại</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#F4F7FE] flex items-center justify-center">
                  <Warehouse className="w-6 h-6 text-[#4318FF]" />
                </div>
              </CardContent>
            </Card>

            {/* Nhập trong kỳ */}
            <Card className="border-none shadow-sm bg-white rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Nhập trong kỳ</span>
                  <p className="text-2xl font-bold text-[#2B3674]">{formatNumber(data.inboundThisPeriod)} SP</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs font-semibold ${data.inboundGrowthPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {data.inboundGrowthPercent >= 0 ? '+' : ''}{data.inboundGrowthPercent}% so với kỳ trước
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <PackagePlus className="w-6 h-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {/* Xuất trong kỳ */}
            <Card className="border-none shadow-sm bg-white rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Xuất trong kỳ</span>
                  <p className="text-2xl font-bold text-[#2B3674]">{formatNumber(data.outboundThisPeriod)} SP</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs font-semibold ${data.outboundGrowthPercent >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                      {data.outboundGrowthPercent >= 0 ? '+' : ''}{data.outboundGrowthPercent}% so với kỳ trước
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <PackageMinus className="w-6 h-6 text-red-400" />
                </div>
              </CardContent>
            </Card>

            {/* Giá trị tồn kho */}
            <Card className="border-none shadow-sm bg-white rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Giá trị tồn kho</span>
                  <p className="text-2xl font-bold text-[#2B3674]">{formatCurrency(data.totalInventoryValue)} đ</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-semibold text-[#A3AED0]">Giá trị vốn lưu động</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ───────────── Row 2: Warehouse Charts ───────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nhập xuất kho (Bar Chart) */}
            <Card className="border-none shadow-sm bg-white rounded-xl">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-bold text-[#2B3674]">Biểu đồ Xuất Nhập Kho</CardTitle>
                <p className="text-xs text-[#A3AED0] mt-1">So sánh số lượng sản phẩm nhập và xuất trong khoảng thời gian</p>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.inboundOutboundChart} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E9EDF7" vertical={false} />
                      <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend iconType="circle" />
                      <Bar name="Nhập" dataKey="inbound" fill="#05CD99" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar name="Xuất" dataKey="outbound" fill="#EC4899" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tỉ trọng danh mục kho (Pie Chart) */}
            <Card className="border-none shadow-sm bg-white rounded-xl flex flex-col justify-between">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-bold text-[#2B3674]">Phân bổ Danh mục Hàng hoá</CardTitle>
                <p className="text-xs text-[#A3AED0] mt-1">Tỷ lệ số lượng hàng trong kho phân bổ theo nhóm ngành hàng</p>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex flex-row items-center h-[260px]">
                <div className="flex-1 h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-[45%] flex flex-col justify-center space-y-3.5 pl-4">
                  {data.categoryDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-semibold text-[#A3AED0] max-w-[100px] truncate" title={item.name}>{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#2B3674]">{formatNumber(item.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ───────────── Row 3: Warehouse Categories Table ───────────── */}
          <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
            <CardHeader className="px-6 py-5 border-b border-gray-100">
              <CardTitle className="text-base font-bold text-[#2B3674]">Dữ liệu Chi tiết Kho</CardTitle>
              <p className="text-xs text-[#A3AED0] mt-1">Danh sách phân tích tồn kho, lượng xuất nhập lũy kế và tổng giá trị định giá tồn kho</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F9FC] text-[#A3AED0]">
                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Danh mục sản phẩm</th>
                      <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Tổng chủng loại</th>
                      <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Tồn kho thực tế</th>
                      <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Đã nhập</th>
                      <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Đã xuất</th>
                      <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Giá trị định giá tồn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.categoryTableData.map((w) => (
                      <tr key={w.categoryName} className="hover:bg-[#F4F7FE] transition-colors">
                        <td className="px-6 py-4 font-bold text-[#2B3674]">{w.categoryName}</td>
                        <td className="px-6 py-4 text-right text-[#A3AED0]">{formatNumber(w.totalItems)}</td>
                        <td className="px-6 py-4 text-right font-bold text-[#2B3674]">{formatNumber(w.inStock)}</td>
                        <td className="px-6 py-4 text-right text-green-600 font-semibold">+{formatNumber(w.imported)}</td>
                        <td className="px-6 py-4 text-right text-red-400 font-semibold">-{formatNumber(w.exported)}</td>
                        <td className="px-6 py-4 text-right font-medium text-[#2B3674]">{formatCurrency(w.value)} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
