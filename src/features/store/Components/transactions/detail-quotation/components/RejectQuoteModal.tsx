import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';

import { Button } from '@/shared/components/shadcn-ui/button';

export function RejectQuoteModal({
    open,
    onOpenChange,
    rejectReason,
    setRejectReason,
    rejectSubmitting,
    onSubmit,
}: any) {
    const reasons = [
        'Giá quá cao',
        'Không phù hợp nhu cầu',
        'Đã chọn nhà cung cấp khác',
        'Khác',
    ];

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-lg rounded-3xl border-0 p-0 overflow-hidden">

                <DialogTitle className="sr-only">
                    Từ chối báo giá
                </DialogTitle>

                <div className="p-8">

                    <h3 className="text-2xl font-semibold text-gray-900">
                        Từ chối báo giá
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                        Hãy cho chúng tôi biết lý do
                        để cải thiện dịch vụ tốt
                        hơn.
                    </p>

                    <div className="mt-8 space-y-3">

                        {reasons.map(
                            (
                                reason
                            ) => (
                                <label
                                    key={
                                        reason
                                    }
                                    className={`
                                        flex items-start gap-4
                                        rounded-xl border p-5
                                        cursor-pointer
                                        transition-all
                                        ${rejectReason ===
                                            reason
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <input
                                        type="radio"
                                        name="rejectReason"
                                        checked={
                                            rejectReason ===
                                            reason
                                        }
                                        onChange={() =>
                                            setRejectReason(
                                                reason
                                            )
                                        }
                                        className="mt-1"
                                    />

                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {
                                                reason
                                            }
                                        </p>
                                    </div>
                                </label>
                            )
                        )}
                    </div>

                    {rejectReason ===
                        'Khác' && (
                            <textarea
                                rows={4}
                                placeholder="Nhập lý do của bạn..."
                                className="
                                mt-4 w-full
                                rounded-xl
                                border border-gray-200
                                p-4
                                outline-none
                                resize-none
                                transition-all
                                focus:ring-4
                                focus:ring-gray-900/5
                                focus:border-gray-900
                            "
                                onChange={(
                                    e
                                ) =>
                                    setRejectReason(
                                        e
                                            .target
                                            .value
                                    )
                                }
                            />
                        )}

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
                            className="
                                flex-1 h-12 rounded-xl
                                bg-gray-900
                                hover:bg-black
                            "
                            onClick={
                                onSubmit
                            }
                            disabled={
                                !rejectReason ||
                                rejectSubmitting
                            }
                        >
                            {rejectSubmitting
                                ? 'Đang xử lý...'
                                : 'Xác nhận'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}