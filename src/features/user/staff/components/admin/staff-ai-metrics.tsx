'use client';

import React, { useEffect, useState } from 'react';
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    BarChart, Bar, Cell, ReferenceLine, Legend,
} from 'recharts';
import { Brain, TrendingUp, Clock, Briefcase, Target, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { StaffPerformanceService, StaffAIPerformance } from '../../services/staff-performance.service';
import CategoryService from '@/features/catalog/category/services/category-services';

interface StaffAIMetricsProps {
    staffId: string;
}

const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} phút`;
    if (hours < 24) return `${hours.toFixed(1)} giờ`;
    return `${(hours / 24).toFixed(1)} ngày`;
};

const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;

// Màu cho từng danh mục
const CATEGORY_COLORS = [
    '#4318FF', '#6AD2FF', '#E31A1A', '#05CD99', '#FFB547', '#EE5D50', '#868CFF',
];

export function StaffAIMetrics({ staffId }: StaffAIMetricsProps) {
    const [data, setData] = useState<StaffAIPerformance | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const [result, categories] = await Promise.all([
                    StaffPerformanceService.getStaffAIPerformance(staffId),
                    CategoryService.getAll().catch(() => [])
                ]);

                if (categories && Array.isArray(categories)) {
                    const catMap = new Map(categories.map(c => [c.id, c.name]));
                    result.categoryPerformances.forEach(cp => {
                        if (catMap.has(cp.categoryId)) {
                            cp.categoryName = catMap.get(cp.categoryId)!;
                        }
                    });
                }

                setData(result);
            } catch {
                setError('Không thể tải chỉ số năng lực AI');
            } finally {
                setLoading(false);
            }
        };
        void fetch();
    }, [staffId]);

    if (loading) return (
        <div className="flex items-center gap-2 py-6 text-indigo-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Đang tải chỉ số AI...</span>
        </div>
    );

    if (error || !data) return (
        <div className="flex items-center gap-2 py-4 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error ?? 'Không có dữ liệu'}</span>
        </div>
    );

    // Dữ liệu radar chart
    const radarData = data.categoryPerformances
        .filter(c => c.successCount + c.failureCount > 0)
        .map(c => ({
            category: c.categoryName || c.categoryId.slice(-8),
            score: +((c.winRate * (1 + c.averageMargin)) * 100).toFixed(1),
            winRate: +(c.winRate * 100).toFixed(1),
            margin: +(c.averageMargin * 100).toFixed(1),
        }));

    // Dữ liệu bar chart per category
    const barData = data.categoryPerformances
        .filter(c => c.successCount + c.failureCount > 0)
        .map(c => ({
            name: c.categoryName || c.categoryId.slice(-8),
            success: c.successCount,
            failure: c.failureCount,
            winRate: +(c.winRate * 100).toFixed(1),
            avgMargin: +(c.averageMargin * 100).toFixed(2),
            alpha: c.alphaParam,
            beta: c.betaParam,
        }));

    const hasData = barData.length > 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setExpanded(e => !e)}
                className="w-full flex items-center justify-between px-6 py-4 border-b border-indigo-50 hover:bg-indigo-50/30 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
                        Năng lực AI theo Danh mục
                    </h4>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expanded && (
                <div className="p-6 space-y-6">
                    {/* Workload & Idle Panel */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            {
                                label: 'Tải công việc',
                                value: `${data.currentWorkload} RFQ`,
                                icon: Briefcase,
                                color: data.currentWorkload > 5 ? 'text-red-500' : data.currentWorkload > 2 ? 'text-amber-500' : 'text-emerald-500',
                                bg: data.currentWorkload > 5 ? 'bg-red-50' : data.currentWorkload > 2 ? 'bg-amber-50' : 'bg-emerald-50',
                            },
                            {
                                label: 'Thời gian rảnh',
                                value: data.idleHours > 0 ? formatHours(data.idleHours) : 'Đang bận',
                                icon: Clock,
                                color: 'text-blue-500',
                                bg: 'bg-blue-50',
                            },
                            {
                                label: 'Hệ số phạt tải',
                                value: data.penaltyWorkload.toFixed(3),
                                icon: AlertCircle,
                                color: 'text-orange-500',
                                bg: 'bg-orange-50',
                            },
                            {
                                label: 'Boost rảnh rỗi',
                                value: `+${data.boostIdle.toFixed(4)}`,
                                icon: TrendingUp,
                                color: 'text-indigo-500',
                                bg: 'bg-indigo-50',
                            },
                        ].map(item => (
                            <div key={item.label} className={`flex items-start gap-3 p-3 rounded-xl ${item.bg}`}>
                                <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0`}>
                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400">{item.label}</p>
                                    <p className={`text-sm font-bold mt-0.5 ${item.color}`}>{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!hasData ? (
                        <div className="text-center py-10 text-slate-400 text-sm">
                            <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            <p>Chưa có dữ liệu học — nhân viên chưa xử lý RFQ nào</p>
                        </div>
                    ) : (
                        <>
                            {/* Bảng per-category */}
                            <div>
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    Thống kê theo danh mục
                                </h5>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b-2 border-slate-100">
                                                <th className="text-left py-2.5 px-3 text-xs font-bold text-slate-400 uppercase">Danh mục</th>
                                                <th className="text-center py-2.5 px-3 text-xs font-bold text-emerald-500 uppercase">✓ Thành công</th>
                                                <th className="text-center py-2.5 px-3 text-xs font-bold text-red-400 uppercase">✗ Thất bại</th>
                                                <th className="text-center py-2.5 px-3 text-xs font-bold text-slate-400 uppercase">Win Rate</th>
                                                <th className="text-center py-2.5 px-3 text-xs font-bold text-slate-400 uppercase">Avg Margin</th>
                                                <th className="text-center py-2.5 px-3 text-xs font-bold text-indigo-500 uppercase">Beta (α/β)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.categoryPerformances
                                                .filter(c => c.successCount + c.failureCount > 0)
                                                .map((c, idx) => (
                                                    <tr key={c.categoryId} className={`border-b border-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
                                                        <td className="py-2.5 px-3 font-semibold text-[#2B3674]">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className="w-2 h-2 rounded-full"
                                                                    style={{ background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                                                                />
                                                                {c.categoryName || c.categoryId.slice(-8)}
                                                            </div>
                                                        </td>
                                                        <td className="py-2.5 px-3 text-center">
                                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-bold">
                                                                {c.successCount}
                                                            </span>
                                                        </td>
                                                        <td className="py-2.5 px-3 text-center">
                                                            <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded text-xs font-bold">
                                                                {c.failureCount}
                                                            </span>
                                                        </td>
                                                        <td className="py-2.5 px-3 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-indigo-500 rounded-full"
                                                                        style={{ width: `${c.winRate * 100}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-bold text-[#2B3674]">
                                                                    {formatPercent(c.winRate)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-2.5 px-3 text-center">
                                                            <span className={`text-xs font-bold ${c.averageMargin > 0.15 ? 'text-emerald-600' : c.averageMargin > 0.05 ? 'text-amber-500' : 'text-slate-400'}`}>
                                                                {formatPercent(c.averageMargin)}
                                                            </span>
                                                        </td>
                                                        <td className="py-2.5 px-3 text-center text-xs text-slate-500 font-mono">
                                                            Beta({c.alphaParam.toFixed(0)}, {c.betaParam.toFixed(0)})
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Radar Chart */}
                                {radarData.length >= 3 && (
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                            Radar năng lực (ExpectedScore × 100)
                                        </h5>
                                        <ResponsiveContainer width="100%" height={220}>
                                            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis
                                                    dataKey="category"
                                                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                                                />
                                                <PolarRadiusAxis
                                                    angle={30}
                                                    domain={[0, 100]}
                                                    tick={{ fontSize: 9, fill: '#94a3b8' }}
                                                />
                                                <Radar
                                                    name="Expected Score"
                                                    dataKey="score"
                                                    stroke="#4318FF"
                                                    fill="#4318FF"
                                                    fillOpacity={0.15}
                                                    strokeWidth={2}
                                                />
                                                <Radar
                                                    name="Win Rate %"
                                                    dataKey="winRate"
                                                    stroke="#05CD99"
                                                    fill="#05CD99"
                                                    fillOpacity={0.1}
                                                    strokeWidth={1.5}
                                                    strokeDasharray="4 2"
                                                />
                                                <Tooltip
                                                    formatter={(val, name) => [
                                                        `${Number(val ?? 0).toFixed(1)}%`,
                                                        String(name)
                                                    ]}
                                                    contentStyle={{
                                                        fontSize: 12,
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: 8,
                                                    }}
                                                />
                                                <Legend wrapperStyle={{ fontSize: 11 }} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Bar Chart: Success vs Failure */}
                                <div>
                                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Success / Failure theo danh mục
                                    </h5>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={barData} barGap={2} barCategoryGap="30%">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                                            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
                                            <Tooltip
                                                contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
                                                formatter={(val, name) => [val ?? 0, name === 'success' ? '✓ Thành công' : '✗ Thất bại']}
                                            />
                                            <Bar dataKey="success" name="success" fill="#05CD99" radius={[3, 3, 0, 0]} />
                                            <Bar dataKey="failure" name="failure" fill="#EE5D50" radius={[3, 3, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
