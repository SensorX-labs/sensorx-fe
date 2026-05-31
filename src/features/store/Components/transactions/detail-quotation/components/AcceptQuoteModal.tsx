import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';

import { Button } from '@/shared/components/shadcn-ui/button';

import {
    inputClass,
    textareaClass,
} from '../../Constants/ui.constant';

import { cn } from '@/shared/utils';
import { PaymentTerm, CustomerRespondToQuoteCommand, QuoteResponseStatus, StoreQuoteService } from '@/features/store/services/store-quote.service';
import StoreCustomerService from '@/features/store/services/store-customer.service';
import { useUser } from '@/shared/hooks/use-user';
import { toast } from 'sonner';
import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';

export function AcceptQuoteModal({
    open,
    onOpenChange,
    quote,
    onSuccess,
}: any) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [shippingForm, setShippingForm] = useState({
        recipientName: '',
        recipientPhone: '',
        shippingAddress: '',
        paymentTerm: PaymentTerm.FullPayment,
    });
    const effectivePaymentTerm = PaymentTerm.FullPayment;

    useEffect(() => {
        const fetchCustomer = async () => {
            if (!user?.id) return;
            try {
                const res = await StoreCustomerService.getDetailCustomerByAccountId(user.id);
                if (res) {
                    setShippingForm((prev) => ({
                        ...prev,
                        recipientName: res.shippingInfo?.receiverName || res.name || '',
                        recipientPhone: res.shippingInfo?.receiverPhone || res.phone || '',
                        shippingAddress: res.shippingInfo?.shippingAddress || res.address || '',
                    }));
                }
            } catch (err) {
                console.error(err);
            }
        };
        if (open) fetchCustomer();
    }, [user?.id, open]);



    const submitAccept = async () => {
        if (!quote || !quote.id) return;
        try {
            setLoading(true);
            const paymentTerm = PaymentTerm.FullPayment;
            const payload: CustomerRespondToQuoteCommand = {
                responseType: QuoteResponseStatus.Accepted,
                paymentTerm,
                shippingAddress: shippingForm.shippingAddress,
                recipientName: shippingForm.recipientName,
                recipientPhone: shippingForm.recipientPhone,
                feedback: 'Khách hàng xác nhận báo giá.',
            };
            await StoreQuoteService.customerResponse(quote.id, payload);
            toast.success('Xác nhận báo giá thành công');
            if (onSuccess) onSuccess(QuoteStatus.ORDERED);
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            toast.error('Không thể xác nhận báo giá');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-2xl rounded-3xl border-0 p-0 overflow-hidden">

                <DialogTitle className="sr-only">
                    Xác nhận báo giá
                </DialogTitle>

                <div className="p-8">

                    <h3 className="text-2xl font-semibold text-gray-900">
                        Xác nhận báo giá
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                        Kiểm tra lại thông tin
                        trước khi xác nhận.
                    </p>

                    <div className="grid grid-cols-2 gap-6 mt-8">

                        {/* LEFT */}

                        <div className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Người nhận
                                </label>

                                <input
                                    type="text"
                                    value={
                                        shippingForm.recipientName
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setShippingForm(
                                            (
                                                p: any
                                            ) => ({
                                                ...p,
                                                recipientName:
                                                    e
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    className={
                                        inputClass
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                </label>

                                <input
                                    type="text"
                                    value={
                                        shippingForm.recipientPhone
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setShippingForm(
                                            (
                                                p: any
                                            ) => ({
                                                ...p,
                                                recipientPhone:
                                                    e
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    className={
                                        inputClass
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ
                                </label>

                                <textarea
                                    rows={4}
                                    value={
                                        shippingForm.shippingAddress
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setShippingForm(
                                            (
                                                p: any
                                            ) => ({
                                                ...p,
                                                shippingAddress:
                                                    e
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    className={
                                        textareaClass
                                    }
                                />
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div>
                            <div className="rounded-xl bg-gray-50 border border-gray-100 p-6">

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Tổng đơn
                                    </span>

                                    <span className="font-semibold">
                                        {quote.grandTotal.toLocaleString(
                                            'vi-VN'
                                        )}{' '}
                                        đ
                                    </span>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">

                                    <span className="font-medium">
                                        Thanh toán
                                    </span>

                                    <span className="text-lg font-bold">
                                        {quote.grandTotal.toLocaleString(
                                            'vi-VN'
                                        )}{' '}
                                        đ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">

                        <Button
                            variant="outline"
                            className="flex-1 h-12 rounded-xl"
                            onClick={() =>
                                onOpenChange(
                                    false
                                )
                            }
                        >
                            Hủy
                        </Button>

                        <Button
                            className="flex-1 h-12 rounded-xl bg-gray-900 hover:bg-black"
                            onClick={
                                submitAccept
                            }
                            disabled={
                                loading
                            }
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}