'use client';

import React, { useEffect, useState } from 'react';

import { Loader2, FileText } from 'lucide-react';

import { QuoteService } from '@/features/sales/quotation/services/quote.service';

import {
    CustomerInfoResponse,
    GetDetailQuoteByIdResponse,
} from '@/features/sales/quotation/models/quote-detail-response';

import {
    CustomerRespondToQuoteCommand,
    PaymentTerm,
    QuoteResponseStatus,
    StoreQuoteService,
} from '../../../services/store-quote.service';

import StoreCustomerService, {
    CustomerDetail,
} from '../../../services/store-customer.service';

import { useUser } from '@/shared/hooks/use-user';

import { toast } from 'sonner';

import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';

import { cardClass } from './constants';
import {
    AcceptQuoteModal,
    QuoteHeader,
    QuoteSummary,
    QuoteTable,
    RejectQuoteModal,
} from './components';

import { CustomerCard, SupportCard } from '../components';

export default function QuotationDetailView({
    quotationId,
    onBack,
}: {
    quotationId?: string;
    onBack: () => void;
}) {
    const { user } = useUser();

    const [quote, setQuote] =
        useState<GetDetailQuoteByIdResponse>();

    const [customer, setCustomer] =
        useState<CustomerInfoResponse>();

    const [loading, setLoading] = useState(true);

    const [acceptModalOpen, setAcceptModalOpen] =
        useState(false);

    const [rejectModalOpen, setRejectModalOpen] =
        useState(false);

    const [rejectReason, setRejectReason] =
        useState('');

    const [rejectSubmitting, setRejectSubmitting] =
        useState(false);

    const [shippingForm, setShippingForm] =
        useState({
            recipientName: '',
            recipientPhone: '',
            shippingAddress: '',
            paymentTerm: PaymentTerm.FullPayment,
        });

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

    useEffect(() => {
        const fetchCustomer = async () => {
            if (!user?.id) return;

            try {
                const res =
                    await StoreCustomerService.getDetailCustomerByAccountId(
                        user.id
                    );

                if (res) {
                    setShippingForm((prev) => ({
                        ...prev,
                        recipientName:
                            res.shippingInfo?.receiverName ||
                            res.name ||
                            '',

                        recipientPhone:
                            res.shippingInfo?.receiverPhone ||
                            res.phone ||
                            '',

                        shippingAddress:
                            res.shippingInfo
                                ?.shippingAddress ||
                            res.address ||
                            '',
                    }));
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchCustomer();
    }, [user?.id]);

    const submitAccept = async () => {
        if (!quote || !quotationId) return;

        try {
            setLoading(true);

            const payload: CustomerRespondToQuoteCommand =
            {
                responseType:
                    QuoteResponseStatus.Accepted,

                paymentTerm:
                    shippingForm.paymentTerm,

                shippingAddress:
                    shippingForm.shippingAddress,

                recipientName:
                    shippingForm.recipientName,

                recipientPhone:
                    shippingForm.recipientPhone,

                feedback:
                    'Khách hàng xác nhận báo giá.',
            };

            await StoreQuoteService.customerResponse(
                quotationId,
                payload
            );

            setQuote({
                ...quote,
                status: QuoteStatus.ORDERED,
            });

            toast.success(
                'Xác nhận báo giá thành công'
            );

            setAcceptModalOpen(false);
        } catch (err) {
            console.error(err);

            toast.error(
                'Không thể xác nhận báo giá'
            );
        } finally {
            setLoading(false);
        }
    };

    const submitReject = async () => {
        if (!quotationId || !rejectReason) return;

        try {
            setRejectSubmitting(true);

            await QuoteService.reject(
                quotationId,
                {
                    reason: rejectReason,
                }
            );

            setQuote((prev) =>
                prev
                    ? {
                        ...prev,
                        status:
                            QuoteStatus.RETURNED,
                    }
                    : prev
            );

            toast.success(
                'Đã từ chối báo giá'
            );

            setRejectModalOpen(false);
        } catch (err) {
            console.error(err);

            toast.error(
                'Không thể từ chối báo giá'
            );
        } finally {
            setRejectSubmitting(false);
        }
    };

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
        <div className="min-h-screen bg-[#f6f7fb]">
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
                loading={loading}
                shippingForm={shippingForm}
                setShippingForm={setShippingForm}
                onSubmit={submitAccept}
            />

            <RejectQuoteModal
                open={rejectModalOpen}
                onOpenChange={setRejectModalOpen}
                rejectReason={rejectReason}
                setRejectReason={setRejectReason}
                rejectSubmitting={
                    rejectSubmitting
                }
                onSubmit={submitReject}
            />
        </div>
    );
}