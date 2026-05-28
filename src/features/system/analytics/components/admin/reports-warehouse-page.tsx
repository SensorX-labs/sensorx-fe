'use client';

import React from 'react';
import { Warehouse, PackagePlus, PackageMinus, DollarSign, Download, ArrowUpRight, TrendingUp } from 'lucide-react';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

const stats = [
  { title: 'Tổng tồn kho', value: '18,420 SP', icon: Warehouse, change: '85% sức chứa', color: 'text-[#4318FF]', bg: 'bg-[#F4F7FE]' },
  { title: 'Nhập tháng này', value: '3,241 SP', icon: PackagePlus, change: '+12.4% so với tháng trước', color: 'text-green-500', bg: 'bg-green-50' },
  { title: 'Xuất tháng này', value: '4,120 SP', icon: PackageMinus, change: '-4.8% so với tháng trước', color: 'text-red-400', bg: 'bg-red-50' },
  { title: 'Giá trị tồn kho', value: '4.82 tỷ đ', icon: DollarSign, change: 'Giá trị vốn lưu động', color: 'text-purple-500', bg: 'bg-purple-50' },
];

const categoryData = [
  { name: 'Camera', value: 450, color: '#4318FF' },
  { name: 'Đầu ghi', value: 180, color: '#6AD01F' },
  { name: 'Màn hình', value: 90, color: '#F97316' },
  { name: 'Nguồn điện', value: 320, color: '#05CD99' },
  { name: 'Phụ kiện', value: 2400, color: '#EC4899' },
];

const importExportData = [
  { month: 'Th12', 'Nhập': 2800, 'Xuất': 2400 },
  { month: 'Th1', 'Nhập': 1900, 'Xuất': 2900 },
  { month: 'Th2', 'Nhập': 3100, 'Xuất': 2800 },
  { month: 'Th3', 'Nhập': 3241, 'Xuất': 4120 },
];

const warehouseTable = [
  { category: 'Camera', totalItems: 450, inStock: 312, imported: 120, exported: 158, value: '764,400,000' },
  { category: 'Đầu ghi', totalItems: 180, inStock: 124, imported: 48, exported: 62, value: '471,200,000' },
  { category: 'Màn hình', totalItems: 90, inStock: 42, imported: 18, exported: 24, value: '218,400,000' },
  { category: 'Phụ kiện', totalItems: 2400, inStock: 1845, imported: 800, exported: 1200, value: '369,000,000' },
  { category: 'Nguồn điện', totalItems: 320, inStock: 218, imported: 96, exported: 102, value: '381,500,000' },
];

export default function ReportsWarehousePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ───────────── Header & Action ───────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674] tracking-tight">Báo cáo Kho & Hàng tồn kho</h2>
          <p className="text-sm text-[#A3AED0] mt-1">Quản lý hiệu suất xuất nhập kho, tỷ trọng lưu động và giá trị tồn kho</p>
        </div>
        
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#2B3674] hover:bg-gray-50 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm self-end sm:self-auto">
          <Download className="w-4 h-4" />
          Xuất báo cáo tồn kho
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
                  <span className="text-xs font-semibold text-[#A3AED0]">{s.change}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ───────────── Row 2: Warehouse Charts ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nhập xuất kho (Bar Chart) */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">Biểu đồ Xuất Nhập Kho</CardTitle>
            <p className="text-xs text-[#A3AED0] mt-1">So sánh số lượng sản phẩm nhập và xuất qua các tháng</p>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={importExportData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9EDF7" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="Nhập" fill="#05CD99" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="Xuất" fill="#EC4899" radius={[4, 4, 0, 0]} barSize={20} />
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
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-[45%] flex flex-col justify-center space-y-3.5 pl-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-semibold text-[#A3AED0]">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#2B3674]">{item.value} SP</span>
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
                {warehouseTable.map((w) => (
                  <tr key={w.category} className="hover:bg-[#F4F7FE] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#2B3674]">{w.category}</td>
                    <td className="px-6 py-4 text-right text-[#A3AED0]">{w.totalItems}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#2B3674]">{w.inStock}</td>
                    <td className="px-6 py-4 text-right text-green-600 font-semibold">+{w.imported}</td>
                    <td className="px-6 py-4 text-right text-red-400 font-semibold">-{w.exported}</td>
                    <td className="px-6 py-4 text-right font-medium text-[#2B3674]">{w.value} đ</td>
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
