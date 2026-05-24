'use client';

import React, { useMemo } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';

interface PaymentQrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderCode: string;
  paymentStatus: string;
  paymentAmount: number;
  qrUrl?: string;
  qrLabel: string;
}

export function PaymentQrModal({
  open,
  onOpenChange,
  orderCode,
  paymentStatus,
  paymentAmount,
  qrUrl,
  qrLabel,
}: PaymentQrModalProps) {
  const hasQr = Boolean(qrUrl);
  const displayedAmount = useMemo(() => {
    if (!qrUrl) {
      return paymentAmount;
    }

    try {
      const url = new URL(qrUrl);
      const amountParam = url.searchParams.get('amount');
      const parsedAmount = amountParam ? Number(amountParam) : NaN;

      if (Number.isFinite(parsedAmount) && parsedAmount > 0) {
        return parsedAmount;
      }
    } catch {
      // Fall back to the amount passed from the order payload.
    }

    return paymentAmount;
  }, [qrUrl, paymentAmount]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden bg-white border-gray-100" showCloseButton>
        <div className="p-6 sm:p-8 space-y-6">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-wide text-gray-900">
              <CreditCard className="w-5 h-5 text-[var(--brand-green)]" />
              Thanh toán đơn hàng
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 uppercase tracking-widest font-bold">
              {orderCode}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded border border-gray-100 bg-gray-50/60 px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Trạng thái</p>
                <p className="text-sm font-bold text-gray-900">{paymentStatus}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Số tiền</p>
                <p className="text-sm font-bold text-gray-900">{displayedAmount.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Mã QR thanh toán</p>
                  <p className="text-sm font-bold text-gray-900">{qrLabel}</p>
                </div>
                {!hasQr && (
                  <span className="text-[10px] uppercase tracking-widest font-bold text-red-600">Không có QR</span>
                )}
              </div>

              {hasQr ? (
                <div className="flex justify-center">
                  <img
                    src={qrUrl}
                    alt={`QR thanh toán ${orderCode}`}
                    className="w-full max-w-[320px] rounded-xl border border-gray-100 bg-white object-contain"
                  />
                </div>
              ) : (
                <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Chưa có mã QR thanh toán cho đơn hàng này.</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="uppercase tracking-widest text-[10px] font-bold">
              Đóng
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentQrModal;
