'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/shared/components/admin/confirm-dialog';
import UnitOfQuantityService from '../../services/unit-of-quantity-services';

interface UnitOfQuantityDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  unitId: string | null;
  unitName: string | null;
  onSuccess: () => void;
}

export function UnitOfQuantityDeleteDialog({
  isOpen,
  onOpenChange,
  unitId,
  unitName,
  onSuccess,
}: UnitOfQuantityDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!unitId) {
      return;
    }

    setLoading(true);
    try {
      await UnitOfQuantityService.delete(unitId);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Xóa đơn vị tính"
      description={
        unitName
          ? `Bạn có chắc muốn xóa "${unitName}" không?`
          : 'Bạn có chắc muốn xóa bản ghi này không?'
      }
      onConfirm={handleConfirm}
      confirmText="Xóa"
      type="danger"
      loading={loading}
    />
  );
}
