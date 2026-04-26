'use client';

import React, { useState } from 'react';
import { ConfirmDialog } from '@/shared/components/admin/confirm-dialog';
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title="Xác nhận vô hiệu hóa?"
      description={`Hành động này sẽ vô hiệu hóa bảng giá của sản phẩm "${price.productName}". Bảng giá này sẽ không còn được áp dụng cho các giao dịch mới.`}
      onConfirm={handleDeactivate}
      confirmText="Vô hiệu hóa"
      type="danger"
      loading={loading}
    />
  );
}
