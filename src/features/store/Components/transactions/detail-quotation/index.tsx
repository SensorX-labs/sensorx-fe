'use client';

import React, { useEffect, useState } from 'react';

import { Loader2, FileText } from 'lucide-react';

import { QuoteService } from '@/features/sales/quotation/services/quote.service';

import {
    CustomerInfoResponse,
    GetDetailQuoteByIdResponse,
} from '@/features/sales/quotation/models/quote-detail-response';

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

export default function QuotationDetailView({
    quotationId,
    onBack,
}: {
    quotationId?: string;
    onBack: () => void;
}) {
    const [quote, setQuote] =
        useState<GetDetailQuoteByIdResponse>();

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
                    await QuoteService.getQuoteById(
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

                    <div className="space-y-6">

                        <div className={cardClass}>
                            <QuoteHeader
                                quote={quote}
                                onAccept={() =>
                                    setAcceptModalOpen(
                                        true
                                    )
                                }
                                onReject={() =>
                                    setRejectModalOpen(
                                        true
                                    )
                                }
                            />

                            <QuoteSummary quote={quote} />

                            <QuoteTable quote={quote} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <CustomerCard
                            customer={customer || null}
                        />

                        {quote.sender && (
                            <SupportCard
                                staff={{
                                    name: quote.sender.name,
                                    email: quote.sender.email,
                                    phone: quote.sender.phone || undefined,
                                }}
                            />
                        )}
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