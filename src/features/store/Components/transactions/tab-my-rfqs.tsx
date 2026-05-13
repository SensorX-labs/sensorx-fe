'use client';

import { useEffect, useState, useMemo } from 'react';
import { FileText, ChevronRight, Search, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';
import { StoreRFQService, StoreMyRFQItem } from '../../services/store-rfq.service';
import { RfqStatus } from '../../constants/rfq-status';
import { useRouter } from 'next/navigation';

const statusConfig: Record<string, { label: string; className: string }> = {
    [RfqStatus.Draft]: {
        label: 'Bản thảo',
        className: 'bg-gray-50 text-gray-700 border-gray-200'
    },
    [RfqStatus.Pending]: {
        label: 'Chờ tiếp nhận',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    [RfqStatus.Accepted]: {
        label: 'Đang xử lý',
        className: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    [RfqStatus.Responded]: {
        label: 'Đã phản hồi',
        className: 'bg-[var(--brand-green)]/10 text-[var(--brand-green)] border-[var(--brand-green)]/20'
    },
    [RfqStatus.Converted]: {
        label: 'Đã chuyển đổi',
        className: 'bg-[var(--brand-green)]/10 text-[var(--brand-green)] border-[var(--brand-green)]/20'
    }
};


export function MyRfqsTab({
    customerId
}: {
    customerId?: string
}) {
    const router = useRouter();
    const [myRfqs, setMyRfqs] = useState<StoreMyRFQItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        lastId: undefined as string | undefined,
        lastValue: undefined as string | undefined,
        hasNext: false
    });


    const filters = [
        { id: 'ALL', label: 'Tất cả' },
        { id: RfqStatus.Draft, label: 'Bản thảo' },
        { id: RfqStatus.Pending, label: 'Chờ tiếp nhận' },
        { id: RfqStatus.Accepted, label: 'Đang xử lý' },
        { id: RfqStatus.Responded, label: 'Đã phản hồi' },
        { id: RfqStatus.Converted, label: 'Đã chuyển đổi' },
    ];

    const fetchRfqs = async (isLoadMore = false) => {
        if (!customerId) return;
        try {
            setLoading(true);
            const response = await StoreRFQService.getMyRFQ({
                pageSize: 10,
                status: activeFilter === 'ALL' ? undefined : (activeFilter as RfqStatus),
                searchTerm: searchTerm || undefined,
                lastId: isLoadMore ? pagination.lastId : undefined,
                lastValue: isLoadMore ? pagination.lastValue : undefined,
                isDescending: true
            });

            if (response.items) {
                if (isLoadMore) {
                    setMyRfqs(prev => [...prev, ...response.items]);
                } else {
                    setMyRfqs(response.items);
                }
                setPagination({
                    lastId: response.lastId,
                    lastValue: response.lastValue,
                    hasNext: response.hasNext
                });
            }
        } catch (error) {
            console.error("Error fetching RFQs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRfqs();
    }, [customerId, activeFilter]);

    return (
        <div>
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã yêu cầu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') fetchRfqs();
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all btn-tracking uppercase"
                    />
                </div>
            </div>

            {/* Shopee-style filter tabs */}
            <div className="flex items-center border-b border-gray-100 mb-6 bg-white sticky top-0 z-10">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={cn(
                            "flex-1 py-4 text-xs font-bold tracking-widest uppercase transition-all border-b-2 text-center",
                            activeFilter === filter.id
                                ? "border-[var(--brand-green)] text-[var(--brand-green)]"
                                : "border-transparent text-gray-500 hover:text-gray-900"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-24 text-center">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                        <p className="meta-label uppercase">Đang tải dữ liệu...</p>
                    </div>
                ) : myRfqs.length > 0 ? (
                    myRfqs.map((request) => {
                        const config = statusConfig[request.status];

                        return (
                            <div
                                key={request.id}
                                className="group border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-200 cursor-pointer shadow-sm"
                                onClick={() => router.push(`/transactions/rfqs/${request.id}`)}
                            >
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-4">
                                                <span className="tracking-title text-sm">{request.code}</span>
                                                <span className={cn("px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border", config.className)}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <span className="flex items-center gap-1.5 meta-label uppercase">
                                                    {/* Kiểm tra cả 2 nơi để lấy tên công ty */}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <p className="tracking-label uppercase text-gray-400 mb-0.5 !text-[10px]">Thời gian tạo</p>
                                            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                                {request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : '---'}
                                            </p>
                                        </div>
                                        <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900 group/btn btn-tracking">
                                            <span>Chi tiết</span>
                                            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-24 text-center bg-white border border-dashed border-gray-100">
                        <FileText className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                        <p className="meta-label uppercase">Bạn chưa có yêu cầu báo giá nào.</p>
                    </div>
                )}
            </div>

            {pagination.hasNext && (
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => fetchRfqs(true)}
                        disabled={loading}
                        className="px-10 py-3 border border-gray-900 text-[10px] font-bold uppercase btn-tracking hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Đang tải...' : 'Tải thêm lịch sử yêu cầu'}
                    </button>
                </div>
            )}
        </div>
    );
}
