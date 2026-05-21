import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/shadcn-ui/popover';
import { BadgeInfo } from 'lucide-react';

export function InternalPricePopover({
  onSelect,
  children,
  priceData,
}: {
  onSelect: (price: number) => void;
  children: React.ReactNode;
  priceData?: any;
}) {
  const [open, setOpen] = useState(false);

  if (!priceData) return <>{children}</>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          {children}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600">
            <BadgeInfo size={14} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 space-y-2 bg-white shadow-md border-blue-100 z-50 relative" align="end" sideOffset={5}>
        <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2 border-b border-blue-50 pb-1">Gợi ý giá nội bộ</div>
        <div className="space-y-1.5">
          <div
            className="flex justify-between items-center text-sm p-1.5 hover:bg-blue-50 rounded cursor-pointer transition-colors"
            onClick={() => {
              onSelect(priceData.importPrice);
              setOpen(false);
            }}
          >
            <span className="text-gray-600">Giá nhập:</span>
            <span className="font-medium text-gray-900">{priceData.importPrice.toLocaleString('vi-VN')} đ</span>
          </div>
          <div
            className="flex justify-between items-center text-sm p-1.5 hover:bg-blue-50 rounded cursor-pointer transition-colors"
            onClick={() => {
              onSelect(priceData.wholesalePrice);
              setOpen(false);
            }}
          >
            <span className="text-gray-600">Giá sỉ:</span>
            <span className="font-medium text-gray-900">{priceData.wholesalePrice.toLocaleString('vi-VN')} đ</span>
          </div>
          <div
            className="flex justify-between items-center text-sm p-1.5 hover:bg-blue-50 rounded cursor-pointer transition-colors"
            onClick={() => {
              onSelect(priceData.retailPrice);
              setOpen(false);
            }}
          >
            <span className="text-gray-600">Giá lẻ:</span>
            <span className="font-medium text-gray-900">{priceData.retailPrice.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
