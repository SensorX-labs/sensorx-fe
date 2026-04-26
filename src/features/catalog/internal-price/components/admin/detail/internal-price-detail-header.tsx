'use client';

import { Button } from '@/shared/components/shadcn-ui/button';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import { ArrowLeft, Calendar, Copy, Ban } from 'lucide-react';
import { InternalPrice } from '../../../models';

interface DetailHeaderProps {
  price: InternalPrice;
  onBack: () => void;
  onExtend: () => void;
  onDeactivate: () => void;
}

export function DetailHeader({ price, onBack, onExtend, onDeactivate }: DetailHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#2B3674]">Chi tiết Bảng giá</h2>
            <Badge variant="outline" className="font-mono text-[#4318FF] border-[#E9EDF7] bg-[#F4F7FE]">
              {price.id}
            </Badge>
          </div>
          <p className="text-[#A3AED0] text-sm flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3" />
            Tạo ngày {new Date(price.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="gap-2 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
          onClick={onExtend}
        >
          <Calendar className="w-4 h-4" />
          Gia hạn
        </Button>
        <Button variant="outline" className="gap-2 border-slate-200">
          <Copy className="w-4 h-4" />
          Nhân bản
        </Button>
        <Button variant="destructive" className="gap-2" onClick={onDeactivate}>
          <Ban className="w-4 h-4" />
          Vô hiệu hóa
        </Button>
      </div>
    </div>
  );
}
