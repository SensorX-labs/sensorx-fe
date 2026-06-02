'use client';

import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, ReferenceLine,
} from 'recharts';
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, RefreshCw } from 'lucide-react';

import { AISettingService } from '../../services/ai-setting.service';
import { toast } from 'sonner';

const TAB_CONFIG = [
    { id: 'params', label: 'Lịch sử Tham số', icon: TrendingUp },
    { id: 'loss', label: 'Loss & Prediction', icon: Activity },
    { id: 'gradient', label: 'Gradient Updates', icon: AlertTriangle },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
            <p className="font-bold text-slate-600 mb-1">Event #{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color }}>
                    {p.name}: <span className="font-mono font-bold">{typeof p.value === 'number' ? p.value.toFixed(5) : p.value}</span>
                </p>
            ))}
        </div>
    );
};

export function AIMonitoringCharts() {
    const [activeTab, setActiveTab] = useState('params');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await AISettingService.getHyperparameterHistory();
                if (res) {
                    const parseVal = (val: any, dec: number) => {
                        const n = Number(val);
                        if (isNaN(n)) return 0;
                        if (!isFinite(n)) return n > 0 ? 99 : -99; // Cap vô cực để biểu đồ không bị hỏng
                        return Number(n.toFixed(dec));
                    };

                    const mappedData = res.map((item: any, index: number) => ({
                        event: index + 1,
                        k: parseVal(item.kAfter, 5),
                        idleWeight: parseVal(item.idleWeightAfter, 5),
                        loss: parseVal(item.loss, 4),
                        yHat: parseVal(item.predictedScore, 4),
                        y: item.isSuccess ? 1 : 0,
                        error: parseVal((item.isSuccess ? 1 : 0) - Number(item.predictedScore), 4),
                        deltaK: parseVal(item.deltaK, 5),
                        deltaIdleWeight: parseVal(item.deltaIdleWeight, 5),
                        kBefore: parseVal(item.kBefore, 5),
                        iwBefore: parseVal(item.idleWeightBefore, 5),
                    }));
                    setData(mappedData);
                }
            } catch (error) {
                console.error(">>> Lỗi khi lấy lịch sử tham số AI:", error);
                toast.error("Không thể lấy dữ liệu biểu đồ AI");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [refreshKey]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="text-sm text-[#4318FF] animate-pulse">Đang tải dữ liệu biểu đồ...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex justify-center items-center h-48 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <p className="text-sm text-slate-500">Chưa có dữ liệu lịch sử huấn luyện AI</p>
            </div>
        );
    }

    // Summary stats
    const lastRecord = data[data.length - 1];
    const avgLoss = data.reduce((s, d) => s + d.loss, 0) / data.length;
    const accuracy = data.filter(d => (d.yHat >= 0.5) === (d.y === 1)).length / data.length;
    const kDelta = lastRecord.k - data[0].k;
    const iwDelta = lastRecord.idleWeight - data[0].idleWeight;

    const KTrendIcon = kDelta > 0.01 ? TrendingUp : kDelta < -0.01 ? TrendingDown : Minus;
    const kTrendColor = kDelta > 0.01 ? 'text-red-500' : kDelta < -0.01 ? 'text-emerald-500' : 'text-slate-400';

    return (
        <div className="space-y-4">
            {/* Summary Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'k cuối', value: lastRecord.k.toFixed(4), sub: `Δ${kDelta >= 0 ? '+' : ''}${kDelta.toFixed(4)}`, color: 'text-[#4318FF]', icon: KTrendIcon, iconColor: kTrendColor },
                    { label: 'IdleWeight cuối', value: lastRecord.idleWeight.toFixed(4), sub: `Δ${iwDelta >= 0 ? '+' : ''}${iwDelta.toFixed(4)}`, color: 'text-[#05CD99]', icon: Activity, iconColor: 'text-[#05CD99]' },
                    { label: 'Avg Loss', value: avgLoss.toFixed(4), sub: 'Binary Cross-Entropy', color: 'text-amber-500', icon: AlertTriangle, iconColor: 'text-amber-500' },
                    { label: 'Accuracy', value: `${(accuracy * 100).toFixed(1)}%`, sub: `${data.length} sự kiện`, color: 'text-indigo-600', icon: TrendingUp, iconColor: 'text-indigo-600' },
                ].map(s => (
                    <div key={s.label} className="bg-[#F4F7FE] rounded-xl p-3 flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                            <s.icon className={`w-4 h-4 ${s.iconColor}`} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#A3AED0]">{s.label}</p>
                            <p className={`text-base font-bold font-mono ${s.color}`}>{s.value}</p>
                            <p className="text-[10px] text-slate-400">{s.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
                {TAB_CONFIG.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === tab.id
                            ? 'bg-white text-[#4318FF] shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
                <button
                    onClick={() => setRefreshKey(k => k + 1)}
                    className="ml-2 p-1.5 text-slate-400 hover:text-[#4318FF] rounded-md hover:bg-white transition-all"
                    title="Tải lại dữ liệu mô phỏng"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Tab: Lịch sử Tham số */}
            {activeTab === 'params' && (
                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Biến thiên k (Workload Penalty) theo từng backward pass event
                        </p>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="event" tick={{ fontSize: 10, fill: '#94a3b8' }} label={{ value: 'Event #', position: 'insideBottomRight', offset: -8, fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} width={55} tickFormatter={v => v.toFixed(4)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="k" name="k (phạt tải)" stroke="#4318FF" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Biến thiên IdleWeight (Boost rảnh rỗi) theo từng backward pass event
                        </p>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="event" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} width={55} tickFormatter={v => v.toFixed(4)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="idleWeight" name="IdleWeight" stroke="#05CD99" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Tab: Loss & Prediction */}
            {activeTab === 'loss' && (
                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Binary Cross-Entropy Loss L = −[y·ln(ŷ) + (1−y)·ln(1−ŷ)]
                        </p>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                                <defs>
                                    <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EE5D50" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#EE5D50" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="event" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis domain={[0, 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} width={50} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="loss" name="Loss L" stroke="#EE5D50" fill="url(#lossGrad)" strokeWidth={2} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Sai số dự báo (y − ŷ): dương = underpredict, âm = overpredict
                        </p>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                                <defs>
                                    <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6AD2FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6AD2FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="event" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis domain={[-1, 1]} tick={{ fontSize: 10, fill: '#94a3b8' }} width={40} />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 2" />
                                <Area type="monotone" dataKey="error" name="Error (y−ŷ)" stroke="#6AD2FF" fill="url(#errorGrad)" strokeWidth={2} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Tab: Gradient Updates */}
            {activeTab === 'gradient' && (
                <div className="space-y-3">
                    <p className="text-xs text-slate-400">
                        Biên độ cập nhật Gradient mỗi bước — đường clip ±1.0 là giới hạn an toàn chống Gradient Explosion.
                    </p>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Δk mỗi backward pass (clipped ±1.0)
                        </p>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={data.filter((_, i) => i % 3 === 0)} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="event" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                                <YAxis domain={[-0.05, 0.05]} tick={{ fontSize: 9, fill: '#94a3b8' }} width={45} />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={0} stroke="#94a3b8" />
                                <ReferenceLine y={0.01} stroke="#4318FF" strokeDasharray="3 2" label={{ value: '+clip×α', position: 'right', fontSize: 9, fill: '#4318FF' }} />
                                <ReferenceLine y={-0.01} stroke="#EE5D50" strokeDasharray="3 2" label={{ value: '−clip×α', position: 'right', fontSize: 9, fill: '#EE5D50' }} />
                                <Bar dataKey="deltaK" name="Δk">
                                    {data.filter((_, i) => i % 3 === 0).map((entry, index) => (
                                        <Cell key={index} fill={entry.deltaK >= 0 ? '#4318FF' : '#EE5D50'} fillOpacity={0.7} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            ΔIdleWeight mỗi backward pass
                        </p>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={data.filter((_, i) => i % 3 === 0)} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="event" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                                <YAxis domain={[-0.005, 0.005]} tick={{ fontSize: 9, fill: '#94a3b8' }} width={50} />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={0} stroke="#94a3b8" />
                                <Bar dataKey="deltaIdleWeight" name="ΔIdleWeight">
                                    {data.filter((_, i) => i % 3 === 0).map((entry, index) => (
                                        <Cell key={index} fill={entry.deltaIdleWeight >= 0 ? '#05CD99' : '#FFB547'} fillOpacity={0.7} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <p className="text-[10px] text-slate-300 text-right mt-2">
                * Dữ liệu thực tế từ cơ sở dữ liệu (AIHyperparameterHistory)
            </p>
        </div>
    );
}
