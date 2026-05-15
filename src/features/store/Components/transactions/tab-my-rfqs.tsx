'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { FileText, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/shared/utils';
import { StoreRFQService, StoreMyRFQItem } from '../../services/store-rfq.service';
import { RfqStatus } from '../../constants/rfq-status';
import { useRouter } from 'next/navigation';
import { Spinner, ListSkeleton } from '@/shared/components/common/loading';

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

    // Đặt mặc định loading = true để kích hoạt Skeleton ngay mili-giây đầu tiên vào trang
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Dùng useRef lưu trữ con trỏ phân trang, cô lập hoàn toàn khỏi dependency tránh re-render lặp vô tận
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

    // 1. Hàm fetch: Để tránh fetchRfqs thay đổi liên tục làm trigger useEffect, 
    // chúng ta sẽ đưa các giá trị động vào tham số của hàm thay vì dependency của useCallback
    const fetchRfqs = useCallback(async (isLoadMore = false, status?: string, search?: string) => {
        if (!customerId) return;
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
    }, [customerId]); // Chỉ phụ thuộc vào customerId


    // 2. LUỒNG ĐỔI TAB: Chạy ngay lập tức
    useEffect(() => {
        setMyRfqs([]);
        paginationRef.current = { lastId: undefined, lastValue: undefined };

        // Khi đổi tab, chúng ta lấy searchTerm hiện tại để gọi
        fetchRfqs(false, activeFilter, searchTerm);
    }, [activeFilter, customerId, fetchRfqs]);


    // 3. LUỒNG TÌM KIẾM (DEBOUNCE)
    useEffect(() => {
        // Không chạy nếu search trống (để luồng Tab xử lý ở lần đầu)
        if (!searchTerm) return;

        const timer = setTimeout(() => {
            paginationRef.current = { lastId: undefined, lastValue: undefined };
            fetchRfqs(false, activeFilter, searchTerm);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm, activeFilter, fetchRfqs]);
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all uppercase"
                    />
                </div>
            </div>

            {/* Shopee-style filter tabs */}
            <div className="flex items-center border-b border-gray-100 mb-6 bg-white sticky top-0 z-10">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => {
                            if (activeFilter !== filter.id) {
                                setActiveFilter(filter.id);
                            }
                        }}
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
                {/* TRƯỜNG HỢP 1: Đang tải dữ liệu (Vào trang lần đầu / Đổi tab / Tải thêm) */}
                {loading ? (
                    <div className="flex flex-col gap-8 py-4">
                        {/* Chỉ hiện Spinner thông báo ở lần đầu load danh sách mới */}
                        {/* Hiện skeleton tương ứng: Load mới hiện 4 dòng, load thêm hiện 2 dòng nối đuôi */}
                        <ListSkeleton count={myRfqs.length > 0 ? 2 : 4} />
                    </div>
                ) : // TRƯỜNG HỢP 2: Đã tải xong và có dữ liệu hiển thị
                    myRfqs.length > 0 ? (
                        myRfqs.map((request) => {
                            const config = statusConfig[request.status] || { label: request.status, className: '' };

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
                        /* TRƯỜNG HỢP 3: Đã tải xong hoàn toàn và thực sự không có data */
                        <div className="py-24 text-center bg-white border border-dashed border-gray-100">
                            <FileText className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                            <p className="meta-label uppercase">Bạn chưa có yêu cầu báo giá nào.</p>
                        </div>
                    )}
            </div>

            {hasNext && (
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