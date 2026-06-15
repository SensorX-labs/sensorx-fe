import { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  User,
  ClipboardCheck,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';
import { Button } from '@/shared/components/shadcn-ui/button';
import { inputClass, textareaClass } from '../../Constants/ui.constant';
import {
  PaymentTerm,
  CustomerRespondToQuoteCommand,
  QuoteResponseStatus,
  StoreQuoteService,
} from '@/features/store/services/store-quote.service';
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
      const payload: CustomerRespondToQuoteCommand = {
        responseType: QuoteResponseStatus.Accepted,
        paymentTerm: PaymentTerm.FullPayment,
        shippingAddress: shippingForm.shippingAddress,
        recipientName: shippingForm.recipientName,
        recipientPhone: shippingForm.recipientPhone,
        feedback: 'Khách hàng xác nhận báo giá.',
      };

      await StoreQuoteService.customerResponse(quote.id, payload);

      if (onSuccess) onSuccess(QuoteStatus.ORDERED);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error('Không thể xác nhận báo giá');
    } finally {
      setLoading(false);
    }
  };

  const summaryItems = [
    { label: 'Mã báo giá', value: quote?.code || '---' },
    { label: 'Số sản phẩm', value: `${quote?.items?.length || 0} mục` },
    { label: 'Phương thức', value: 'Chuyển khoản' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-[30px] border-0 bg-white p-0 sm:max-w-4xl">
        <DialogTitle className="sr-only">Xác nhận báo giá</DialogTitle>

        <div className="border-b border-[#edf1f4] bg-[#f8fafc] px-8 py-7">
          <h3 className="text-2xl font-semibold text-gray-900">Xác nhận báo giá</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Kiểm tra lại thông tin giao nhận và tổng giá trị trước khi chốt báo giá.
            Sau bước này hệ thống sẽ tạo đơn hàng theo thông tin bạn xác nhận.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 p-8">
            <div className="rounded-2xl border border-[#e6ebf1] bg-[#fbfcfd] p-5">
              <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                <ClipboardCheck className="h-4 w-4 text-gray-500" />
                Thông tin giao nhận
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="h-4 w-4 text-gray-400" />
                    Người nhận
                  </label>
                  <input
                    type="text"
                    value={shippingForm.recipientName}
                    onChange={(e) =>
                      setShippingForm((p: any) => ({
                        ...p,
                        recipientName: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4 text-gray-400" />
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={shippingForm.recipientPhone}
                    onChange={(e) =>
                      setShippingForm((p: any) => ({
                        ...p,
                        recipientPhone: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    Địa chỉ giao hàng
                  </label>
                  <textarea
                    rows={4}
                    value={shippingForm.shippingAddress}
                    onChange={(e) =>
                      setShippingForm((p: any) => ({
                        ...p,
                        shippingAddress: e.target.value,
                      }))
                    }
                    className={textareaClass}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e6ebf1] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                <ShieldCheck className="h-4 w-4 text-gray-500" />
                Lưu ý xác nhận
              </div>
              <p className="text-sm leading-6 text-gray-500">
                Bằng việc xác nhận, bạn đồng ý sử dụng thông tin giao nhận ở đây để
                tạo đơn hàng tương ứng với báo giá đã chọn. Nếu cần chỉnh lại địa chỉ
                hoặc đầu mối nhận hàng, hãy cập nhật trước khi tiếp tục.
              </p>
            </div>
          </div>

          <div className="border-t border-[#edf1f4] bg-[#f8fafc] p-8 lg:border-l lg:border-t-0">
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#e6ebf1] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                  <ClipboardCheck className="h-4 w-4 text-gray-500" />
                  Tóm tắt xác nhận
                </div>

                <div className="space-y-3">
                  {summaryItems.map((item) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-[110px_1fr] items-center gap-4 rounded-xl border border-[#edf1f4] bg-[#fbfcfd] px-4 py-3"
                    >
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#d9ebdf] bg-[linear-gradient(180deg,#f6fbf7_0%,#eef8f1_100%)] p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <Wallet className="h-4 w-4 text-emerald-700" />
                  Thanh toán
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tổng đơn</span>
                    <span className="font-semibold text-gray-900">
                      {quote?.grandTotal?.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Điều khoản</span>
                    <span className="font-semibold text-gray-900">Thanh toán 100%</span>
                  </div>

                  <div className="border-t border-emerald-100 pt-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                          Số tiền xác nhận
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Đơn hàng sẽ được tạo theo giá trị này
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-emerald-700">
                        {quote?.grandTotal?.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 border-t border-[#edf1f4] bg-white px-8 py-6">
          <Button
            variant="outline"
            className="h-12 flex-1 rounded-xl border-gray-200"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>

          <Button
            className="h-12 flex-1 rounded-xl bg-gray-900 hover:bg-black"
            onClick={submitAccept}
            disabled={loading}
          >
            {loading ? 'Đang xác nhận...' : 'Xác nhận báo giá'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
