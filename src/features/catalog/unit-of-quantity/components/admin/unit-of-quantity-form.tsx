'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { UnitOfQuantity } from '../../models';
import UnitOfQuantityService from '../../services/unit-of-quantity-services';

interface UnitOfQuantityFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  unit: UnitOfQuantity | null;
  onSuccess: () => void;
}

interface UnitOfQuantityFormContentProps extends UnitOfQuantityFormProps {
  formKey: string;
}

function UnitOfQuantityFormContent({
  isOpen,
  onOpenChange,
  unit,
  onSuccess,
  formKey,
}: UnitOfQuantityFormContentProps) {
  const [name, setName] = useState(unit?.name ?? '');
  const [description, setDescription] = useState(unit?.description ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên đơn vị tính');
      return;
    }

    setSubmitting(true);
    try {
      if (unit) {
        await UnitOfQuantityService.update(unit.id, {
          name: name.trim(),
          description: description.trim() || undefined,
        });
      } else {
        await UnitOfQuantityService.create({
          name: name.trim(),
          description: description.trim() || undefined,
        });
      }

      onSuccess();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle className="text-xl tracking-tight">
            {unit ? 'Chỉnh sửa đơn vị tính' : 'Tạo đơn vị tính mới'}
          </DialogTitle>
        </DialogHeader>
        <div key={formKey} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Tên đơn vị tính
            </label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nhập tên đơn vị tính..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Mô tả
            </label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Nhập mô tả ngắn..."
              className="min-h-[110px]"
            />
          </div>
        </div>
        <DialogFooter className="border-t border-slate-100 bg-slate-50/60 p-4 -mx-6 -mb-6 rounded-b-lg">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button className="admin-btn-primary rounded" onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {unit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UnitOfQuantityForm(props: UnitOfQuantityFormProps) {
  const formKey = `${props.unit?.id ?? 'new'}-${props.isOpen ? 'open' : 'closed'}`;
  return <UnitOfQuantityFormContent {...props} formKey={formKey} />;
}
