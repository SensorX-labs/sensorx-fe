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
import { Supplier } from '../../models';
import SupplierService from '../../services/supplier-services';

interface SupplierFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onSuccess: () => void;
}

interface SupplierFormContentProps extends SupplierFormProps {
  formKey: string;
}

function SupplierFormContent({
  isOpen,
  onOpenChange,
  supplier,
  onSuccess,
  formKey,
}: SupplierFormContentProps) {
  const [name, setName] = useState(supplier?.name ?? '');
  const [description, setDescription] = useState(supplier?.description ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên nhà cung cấp');
      return;
    }

    setSubmitting(true);
    try {
      if (supplier) {
        await SupplierService.update(supplier.id, {
          name: name.trim(),
          description: description.trim() || undefined,
        });
      } else {
        await SupplierService.create({
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
            {supplier ? 'Chỉnh sửa nhà cung cấp' : 'Tạo nhà cung cấp mới'}
          </DialogTitle>
        </DialogHeader>
        <div key={formKey} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Tên nhà cung cấp
            </label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nhập tên nhà cung cấp..."
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
            {supplier ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SupplierForm(props: SupplierFormProps) {
  const formKey = `${props.supplier?.id ?? 'new'}-${props.isOpen ? 'open' : 'closed'}`;
  return <SupplierFormContent {...props} formKey={formKey} />;
}
