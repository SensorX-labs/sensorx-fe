import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';

import { Button } from '@/shared/components/shadcn-ui/button';

import {
    inputClass,
    textareaClass,
} from '../constants';

import { cn } from '@/shared/utils';
import { PaymentTerm } from '@/features/store/services/store-quote.service';

export function AcceptQuoteModal({
    open,
    onOpenChange,
    quote,
    shippingForm,
    setShippingForm,
    onSubmit,
    loading,
}: any) {
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

                            <div className="space-y-3">

                                <label
                                    className={cn(
                                        'flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition-all',
                                        shippingForm.paymentTerm ===
                                            PaymentTerm.FullPayment
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        checked={
                                            shippingForm.paymentTerm ===
                                            PaymentTerm.FullPayment
                                        }
                                        onChange={() =>
                                            setShippingForm(
                                                (
                                                    p: any
                                                ) => ({
                                                    ...p,
                                                    paymentTerm:
                                                        PaymentTerm.FullPayment,
                                                })
                                            )
                                        }
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            Thanh toán
                                            toàn bộ
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            100% giá
                                            trị đơn
                                            hàng
                                        </p>
                                    </div>
                                </label>

                                <label
                                    className={cn(
                                        'flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition-all',
                                        shippingForm.paymentTerm ===
                                            PaymentTerm.Deposit
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        checked={
                                            shippingForm.paymentTerm ===
                                            PaymentTerm.Deposit
                                        }
                                        onChange={() =>
                                            setShippingForm(
                                                (
                                                    p: any
                                                ) => ({
                                                    ...p,
                                                    paymentTerm:
                                                        PaymentTerm.Deposit,
                                                })
                                            )
                                        }
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            Đặt cọc
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Thanh toán
                                            trước 30%
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-6">

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
                                        {shippingForm.paymentTerm ===
                                            PaymentTerm.Deposit
                                            ? (
                                                quote.grandTotal *
                                                0.3
                                            ).toLocaleString(
                                                'vi-VN'
                                            )
                                            : quote.grandTotal.toLocaleString(
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
                            className="flex-1 h-12 rounded-2xl"
                            onClick={() =>
                                onOpenChange(
                                    false
                                )
                            }
                        >
                            Hủy
                        </Button>

                        <Button
                            className="flex-1 h-12 rounded-2xl bg-gray-900 hover:bg-black"
                            onClick={
                                onSubmit
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