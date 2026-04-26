'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn-ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/shadcn-ui/popover';
import { Calendar as CalendarComponent } from '@/shared/components/shadcn-ui/calendar';
import { cn } from '@/shared/utils/cn';
import { ExtendInternalPriceRequest, InternalPrice } from '../../../models';
import InternalPriceService from '../../../services/internal-price-services';

interface ExtendPriceDialogProps {
  price: InternalPrice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ExtendPriceDialog({ price, open, onOpenChange, onSuccess }: ExtendPriceDialogProps) {
  const [date, setDate] = useState<Date | undefined>(
    price.expiresAt ? new Date(price.expiresAt) : undefined
  );
  const [loading, setLoading] = useState(false);

  const handleExtend = async () => {
    if (!date) {
      toast.error("Vui lòng chọn ngày hết hạn mới");
      return;
    }

    if (date <= new Date()) {
      toast.error("Ngày hết hạn mới phải lớn hơn ngày hiện tại");
      return;
    }

    setLoading(true);
    try {
      const request: ExtendInternalPriceRequest = {
        expiresAt: date.toISOString(),
      };
      const response = await InternalPriceService.extend(price.id, request);
      if (response.isSuccess) {
        toast.success("Gia hạn bảng giá thành công");
        onSuccess();
      }
    } catch (error) {
      // Axios interceptor handles global error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Gia hạn sử dụng</DialogTitle>
          <DialogDescription className="text-slate-500">
            Thay đổi ngày hết hạn cho bảng giá của sản phẩm <span className="font-semibold text-slate-700">{price.productName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Ngày hết hạn mới
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal border-slate-200 h-11",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: vi }) : <span>Chọn ngày...</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date <= new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-[11px] text-slate-400 italic">
              * Lưu ý: Hệ thống không hỗ trợ gia hạn vô thời hạn cho loại bảng giá này.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Hủy
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
            onClick={handleExtend}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận gia hạn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
