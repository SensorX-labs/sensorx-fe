'use client';

import React, { useState } from 'react';
import { ConfirmDialog } from '@/shared/components/admin/confirm-dialog';
import { Category } from '../../models';
import CategoryService from '../../services/category-services';

interface CategoryMoveDialogProps {
  activeCategory: Category | null;
  targetCategory: Category | null; // null có nghĩa là chuyển thành danh mục gốc
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CategoryMoveDialog({
  activeCategory,
  targetCategory,
  isOpen,
  onOpenChange,
  onSuccess
}: CategoryMoveDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleMove = async () => {
    if (!activeCategory) return;

    setLoading(true);
    try {
      const parentId = targetCategory ? targetCategory.id : undefined;
      const response = await CategoryService.updateParent(activeCategory.id, { parentId });

      if (response) {
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  const title = targetCategory ? "Thay đổi danh mục cha" : "Thay đổi danh mục gốc";
  const description = targetCategory
    ? `Bạn có muốn chuyển danh mục "${activeCategory?.name}" vào làm con của "${targetCategory.name}" không?`
    : `Bạn có muốn đưa danh mục "${activeCategory?.name}" ra làm danh mục gốc không?`;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onConfirm={handleMove}
      confirmText="Xác nhận di chuyển"
      type="question"
      loading={loading}
    />
  );
}
