'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/components/shadcn-ui/dialog';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';

interface RejectQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting?: boolean;
}

export function RejectQuoteModal({ isOpen, onClose, onConfirm, isSubmitting }: RejectQuoteModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setReason('');
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Từ chối báo giá</DialogTitle>
          <DialogDescription>
            Vui lòng nhập lý do từ chối báo giá này. Thông tin này sẽ được lưu lại để theo dõi.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do từ chối..."
            className="col-span-3 min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm} disabled={!reason.trim() || isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
