'use client';

import React, { useState } from 'react';
import { ConfirmDialog } from '@/shared/components/admin/confirm-dialog';
import { toast } from 'sonner';
import CategoryService from '../../services/category-services';

interface CategoryDeleteDialogProps {
  categoryId: string | null;
  categoryName: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CategoryDeleteDialog({
  categoryId,
  categoryName,
  isOpen,
  onOpenChange,
  onSuccess
}: CategoryDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!categoryId) return;
    
    setLoading(true);
    try {
      const response = await CategoryService.delete(categoryId);
      if (response.isSuccess) {
        toast.success(response.message || "Xóa danh mục thành công");
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Xác nhận xóa danh mục?"
      description={`Bạn có chắc chắn muốn xóa danh mục "${categoryName}"? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm thuộc danh mục này.`}
      onConfirm={handleDelete}
      confirmText="Xóa danh mục"
      type="danger"
      loading={loading}
    />
  );
}
