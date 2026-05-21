'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/shared/components/admin/confirm-dialog';
import SupplierService from '../../services/supplier-services';

interface SupplierDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  supplierId: string | null;
  supplierName: string | null;
  onSuccess: () => void;
}

export function SupplierDeleteDialog({
  isOpen,
  onOpenChange,
  supplierId,
  supplierName,
  onSuccess,
}: SupplierDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!supplierId) {
      return;
    }

    setLoading(true);
    try {
      await SupplierService.delete(supplierId);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Xóa nhà cung cấp"
      description={
        supplierName
          ? `Bạn có chắc muốn xóa "${supplierName}" không?`
          : 'Bạn có chắc muốn xóa bản ghi này không?'
      }
      onConfirm={handleConfirm}
      confirmText="Xóa"
      type="danger"
      loading={loading}
    />
  );
}
