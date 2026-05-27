import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';
import { PaymentMethod } from '@/features/sales/quotation/constants/payment-method';
import { PaymentTern } from '@/features/sales/quotation/constants/payment-term';

export const statusColor: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-600 border-gray-200',
  [QuoteStatus.PENDING]: 'bg-blue-50 text-blue-700 border-blue-200',
  [QuoteStatus.RETURNED]: 'bg-red-50 text-red-700 border-red-200',
  [QuoteStatus.APPROVED]: 'bg-green-50 text-green-700 border-green-200',
  [QuoteStatus.SENT]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [QuoteStatus.ORDERED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [QuoteStatus.EXPIRED]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  [QuoteStatus.CANCELLED]: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const statusLabel: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: 'Nháp',
  [QuoteStatus.PENDING]: 'Chờ duyệt',
  [QuoteStatus.RETURNED]: 'Bị từ chối',
  [QuoteStatus.APPROVED]: 'Đã duyệt',
  [QuoteStatus.SENT]: 'Đã gửi',
  [QuoteStatus.ORDERED]: 'Đã sinh đơn',
  [QuoteStatus.EXPIRED]: 'Hết hạn',
  [QuoteStatus.CANCELLED]: 'Đã hủy',
};

export const paymentMethodLabel: Record<string, string> = {
  [PaymentMethod.BANKTRANSFER]: 'Chuyển khoản',
  [PaymentMethod.CASH]: 'Tiền mặt',
  [PaymentMethod.ORTHER]: 'Phương thức khác',
};

export const paymentTermLabel: Record<string, string> = {
  [PaymentTern.FULLPAYMENT]: '100% Trả trước',
  [PaymentTern.DEPOSIT]: '30% Cọc',
};
