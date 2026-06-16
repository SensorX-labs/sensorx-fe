'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { FileText, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/shared/utils';
import { StoreRFQService, StoreMyRFQItem } from '../../services/store-rfq.service';
import { RfqStatus } from '../../constants/rfq-status';
import { useRouter } from 'next/navigation';
import { ListSkeleton } from '@/shared/components/common/loading';

const statusConfig: Record<string, { label: string; className: string }> = {
    [RfqStatus.Draft]: {
        label: 'Bản thảo',
        className: 'bg-gray-150/80 text-gray-700 border-gray-200/50'
    },
    [RfqStatus.Pending]: {
        label: 'Chờ tiếp nhận',
        className: 'bg-amber-100/80 text-amber-700 border-amber-200/50'
    },
    [RfqStatus.Accepted]: {
        label: 'Đang xử lý',
        className: 'bg-sky-100/80 text-sky-700 border-sky-200/50'
    },
    [RfqStatus.Responded]: {
        label: 'Đã phản hồi',
        className: 'bg-teal-100/80 text-teal-700 border-teal-200/50'
    },
    [RfqStatus.Converted]: {
        label: 'Đã chuyển đổi',
        className: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50'
    }
};

export function MyRfqsTab() {
    const router = useRouter();
    const [myRfqs, setMyRfqs] = useState<StoreMyRFQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const paginationRef = useRef({
        lastId: undefined as string | undefined,
        lastValue: undefined as string | undefined
    });
    const [hasNext, setHasNext] = useState(false);

    const filters = [
        { id: 'ALL', label: 'Tất cả' },
        { id: RfqStatus.Draft, label: 'Bản thảo' },
        { id: RfqStatus.Pending, label: 'Chờ tiếp nhận' },
        { id: RfqStatus.Accepted, label: 'Đang xử lý' },
        { id: RfqStatus.Responded, label: 'Đã phản hồi' },
        { id: RfqStatus.Converted, label: 'Đã chuyển đổi' },
    ];

    const fetchRfqs = useCallback(async (isLoadMore = false, status?: string, search?: string) => {
        try {
            setLoading(true);
            const response = await StoreRFQService.getMyRFQ({
                pageSize: 10,
                status: status === 'ALL' ? undefined : (status as RfqStatus),
                searchTerm: search || undefined,
                lastId: isLoadMore ? paginationRef.current.lastId : undefined,
                lastValue: isLoadMore ? paginationRef.current.lastValue : undefined,
                isDescending: true
            });

            if (response.items) {
                setMyRfqs(prev => isLoadMore ? [...prev, ...response.items] : response.items);
                paginationRef.current = { lastId: response.lastId, lastValue: response.lastValue };
                setHasNext(!!response.hasNext);
            }
        } catch (error) {
            console.error("Error fetching RFQs:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            paginationRef.current = { lastId: undefined, lastValue: undefined };
            fetchRfqs(false, activeFilter, searchTerm);
        }, searchTerm ? 400 : 0);

        return () => clearTimeout(timer);
    }, [activeFilter, searchTerm, fetchRfqs]);

    return (
        <div className="font-sans select-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:flex-1 sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã yêu cầu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-stone-250 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-950 outline-none text-xs font-semibold transition-all uppercase focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] shadow-sm text-stone-900"
                    />
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center border-b border-stone-200 dark:border-zinc-800 mb-6 bg-white dark:bg-zinc-950 sticky top-0 z-10 overflow-x-auto hide-scrollbar">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => {
                            if (activeFilter !== filter.id) {
                                setActiveFilter(filter.id);
                            }
                        }}
                        className={cn(
                            "min-w-max flex-1 py-4 px-4 text-[10px] font-extrabold tracking-widest uppercase transition-all border-b-2 text-center cursor-pointer",
                            activeFilter === filter.id
                                ? "border-[#0D9488] text-[#0D9488] dark:text-emerald-400"
                                : "border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-white"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col gap-8 py-4">
                        <ListSkeleton count={myRfqs.length > 0 ? 2 : 4} />
                    </div>
                ) : myRfqs.length > 0 ? (
                        myRfqs.map((request, idx) => {
                            const config = statusConfig[request.status] || { label: request.status, className: '' };
                            const bgAccents = [
                              'bg-emerald-500', 
                              'bg-indigo-500',  
                              'bg-teal-500',    
                              'bg-violet-500',  
                              'bg-amber-500',   
                              'bg-cyan-500',    
                            ];
                            const bgAccent = bgAccents[idx % bgAccents.length];

                            return (
                                <div
                                    key={request.id}
                                    className="glass-card group border border-stone-200 dark:border-stone-850 bg-[#F9F9FB] dark:bg-stone-900/60 backdrop-blur-md hover:bg-gray-150/20 dark:hover:bg-zinc-800/20 hover:-translate-y-0.5 transition-all duration-350 cursor-pointer shadow-sm overflow-hidden relative pl-2"
                                    onClick={() => router.push(`/transactions/rfqs/${request.id}`)}
                                >
                                    {/* Left accent bar */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${bgAccent}`} />

                                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                                            <span className="font-heading font-bold text-sm tracking-wide text-gray-900 dark:text-white">{request.code}</span>
                                            <span className={cn("px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border rounded", config.className)}>
                                                {config.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12">
                                            <div className="text-left sm:text-right">
                                                <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-gray-400 mb-0.5">Thời gian tạo</p>
                                                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                                                    {request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : '---'}
                                                </p>
                                            </div>
                                            <button className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gray-900 dark:text-white group/btn hover:text-primary dark:hover:text-secondary transition-colors">
                                                <span>Chi tiết</span>
                                                <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-24 text-center bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                            <FileText className="w-12 h-12 text-stone-300 dark:text-zinc-700 mx-auto mb-4" />
                            <p className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400">Bạn chưa có yêu cầu báo giá nào.</p>
                        </div>
                    )}
            </div>

            {hasNext && (
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => fetchRfqs(true)}
                        disabled={loading}
                        className="px-10 py-3.5 bg-[#0D9488] hover:bg-[#0F766E] text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {loading ? 'Đang tải...' : 'Tải thêm lịch sử yêu cầu'}
                    </button>
                </div>
            )}
        </div>
    );
}
