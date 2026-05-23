'use client';

import React, { useEffect, useState } from 'react';

import { Loader2, FileText } from 'lucide-react';

import { CanAccess } from '@/shared/components/common/can-access';
import { cn } from '@/shared/utils';

import { CustomerInfoResponse, GetMyQuoteDetailResponse, StoreQuoteService } from '@/features/store/services/store-quote.service';

import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';

import {
    AcceptQuoteModal,
    QuoteHeader,
    QuoteSummary,
    QuoteTable,
    RejectQuoteModal,
} from './components';

import { CustomerCard, SupportCard } from '../components';
import { cardClass } from '../Constants/ui.constant';
import { Status } from './components/QuoteHeader';

export default function QuotationDetailView({
    quotationId,
    onBack,
}: {
    quotationId?: string;
    onBack: () => void;
}) {
    const [quote, setQuote] =
        useState<GetMyQuoteDetailResponse>();

    const [customer, setCustomer] =
        useState<CustomerInfoResponse>();

    const [loading, setLoading] = useState(true);

    const [acceptModalOpen, setAcceptModalOpen] =
        useState(false);

    const [rejectModalOpen, setRejectModalOpen] =
        useState(false);


    useEffect(() => {
        const fetchData = async () => {
            if (!quotationId) return;

            try {
                setLoading(true);

                const response =
                    await StoreQuoteService.getMyQuoteDetail(
                        quotationId
                    );

                if (response) {
                    setQuote(response);
                    setCustomer(response.customer);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [quotationId]);

    if (loading && !quote) {
        return (
            <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />

                <p className="mt-4 text-sm text-gray-500">
                    Đang tải báo giá...
                </p>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center">
                <FileText className="w-16 h-16 text-gray-300" />

                <h3 className="mt-4 text-xl font-semibold">
                    Không tìm thấy báo giá
                </h3>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

                    {/* Cột trái */}
                    <div className="space-y-6">
                        <div className={cardClass}>
                            <QuoteHeader 
                                status={quote.status as Status} 
                                code={quote.code} 
                            />
                            <QuoteSummary quote={quote} />
                            <QuoteTable quote={quote} />
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div className="space-y-6">
                        {quote.sender && (
                            <SupportCard
                                staff={{
                                    name: quote.sender.name,
                                    email: quote.sender.email,
                                    phone: quote.sender.phone || undefined,
                                    avatarUrl: quote.sender.avatarUrl || undefined,
                                }}
                            />
                        )}

                        {/* BỌC CUSTOMERCARD VÀ NÚT VÀO CHUNG 1 DIV ĐỂ CHÚNG CHẠM SÁT NHAU */}
                        <div className="flex flex-col">
                            <CustomerCard
                                customer={customer || null}
                                actionNode={
                                    <CanAccess roles={['Customer']}>
                                        {(quote.status === 'Pending') && (
                                            <div className="flex items-center gap-3 w-full">
                                                <button
                                                    onClick={() => setAcceptModalOpen(true)}
                                                    className="flex-1 h-11 cursor-pointer rounded-xl bg-gray-900 text-white font-medium hover:bg-black active:scale-95 transition-all duration-200"
                                                >
                                                    Chốt báo giá
                                                </button>
                                                <button
                                                    onClick={() => setRejectModalOpen(true)}
                                                    className="flex-1 h-11 cursor-pointer rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 active:scale-95 transition-all duration-200"
                                                >
                                                    Từ chối
                                                </button>
                                            </div>
                                        )}
                                    </CanAccess>
                                }
                            />
                        </div>

                    </div>
                </div>
            </div>

            <AcceptQuoteModal
                open={acceptModalOpen}
                onOpenChange={setAcceptModalOpen}
                quote={quote}
                onSuccess={(status: QuoteStatus) => setQuote({ ...quote, status } as any)}
            />

            <RejectQuoteModal
                open={rejectModalOpen}
                onOpenChange={setRejectModalOpen}
                quote={quote}
                onSuccess={(status: QuoteStatus) => setQuote({ ...quote, status } as any)}
            />
        </>
    );
}