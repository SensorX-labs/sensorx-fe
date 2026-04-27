'use client';

import { useEffect, useState } from 'react';
import { FileText, ChevronRight, Search, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';
import { RfqStatus } from '@/features/sales/requestforquotation/constants/rfq-status';
import RFQServices from '../../services/rfq-services';
import CustomerService from '@/features/user/customer/services/customer-service';
import { useUser } from '@/shared/hooks/use-user';
import { Rfq } from '../../models/rqf';

const statusConfig: Record<string, { label: string; className: string }> = {
    [RfqStatus.PENDING]: {
        label: 'Chờ xử lý',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    [RfqStatus.ACCEPTED]: {
        label: 'Đã tiếp nhận',
        className: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    [RfqStatus.REJECTED]: {
        label: 'Đã từ chối',
        className: 'bg-red-50 text-red-700 border-red-200'
    },
    [RfqStatus.CONVERTED]: {
        label: 'Đã có báo giá',
        className: 'bg-[var(--brand-green)]/10 text-[var(--brand-green)] border-[var(--brand-green)]/20'
    }
};

export function MyRfqsTab({ onViewDetail }: { onViewDetail?: (id: string) => void }) {
    const { user } = useUser();
    const [myRfqs, setMyRfqs] = useState<Rfq[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        const fetchRfqs = async () => {
            try {
                setLoading(true);
                const customer = await CustomerService.getDetailCustomerByAccountId(user.id);
                if (!customer?.id) return;

                const response: any = await RFQServices.getListRFQ({
                    customerId: customer.id,
                });

                if (response.value.items) {
                    setMyRfqs(response.value.items);
                }
            } catch (error) {
                console.error("Error fetching RFQs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRfqs();
    }, [user]);

    return (
        <div>
            <div className="flex items-center justify-between gap-4 mb-8">
                <h2 className="tracking-title-lg">Yêu cầu báo giá của tôi</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã yêu cầu..."
                        className="pl-10 pr-4 py-2 border border-gray-100 bg-white focus:border-gray-900 outline-none text-xs transition-all w-80 btn-tracking uppercase"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-24 text-center">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                        <p className="meta-label uppercase">Đang tải dữ liệu...</p>
                    </div>
                ) : myRfqs.length > 0 ? (
                    myRfqs.map((request) => {
                        const config = statusConfig[request.status] || statusConfig[RfqStatus.PENDING];

                        return (
                            <div
                                key={request.id}
                                className="group border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-200 cursor-pointer shadow-sm"
                                onClick={() => onViewDetail?.(request.code)}
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

            <div className="mt-12 flex justify-center">
                <button className="px-10 py-3 border border-gray-900 text-[10px] font-bold uppercase btn-tracking hover:bg-gray-900 hover:text-white transition-all duration-300">
                    Tải thêm lịch sử yêu cầu
                </button>
            </div>
        </div>
    );
}
