'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/shadcn-ui/alert-dialog';
import { toast } from 'sonner';
import { InternalPrice } from '../../../models';
import InternalPriceService from '../../../services/internal-price-services';

interface DeactivatePriceDialogProps {
  price: InternalPrice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeactivatePriceDialog({ price, open, onOpenChange, onSuccess }: DeactivatePriceDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      const response = await InternalPriceService.deactivate(price.id);
      if (response.isSuccess) {
        toast.success("Vô hiệu hóa bảng giá thành công");
        onSuccess();
      }
    } catch (error) {
      // Interceptor handles global error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-slate-900">Xác nhận vô hiệu hóa?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            Hành động này sẽ vô hiệu hóa bảng giá của sản phẩm <span className="font-semibold text-slate-700">{price.productName}</span>. 
            Bảng giá này sẽ không còn được áp dụng cho các giao dịch mới.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200"
            onClick={(e) => {
              e.preventDefault();
              handleDeactivate();
            }}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận vô hiệu hóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
