import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/shadcn-ui/popover';

export function InternalPricePopover({
  onSelect,
  children,
  disabled,
  priceData
}: {
  onSelect: (price: number) => void;
  children: React.ReactNode;
  disabled?: boolean;
  priceData?: any;
}) {
  const [open, setOpen] = useState(false);

  const tiers = priceData?.priceTiers || [];

  if (disabled || tiers.length === 0 || !React.isValidElement(children)) return <>{children}</>;

  const trigger = React.cloneElement(children as React.ReactElement<any>, {
    onClick: (e: React.MouseEvent) => {
      if ((children as any).props.onClick) (children as any).props.onClick(e);
      setOpen(true);
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>{trigger}</div>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="w-48 p-1 shadow-md border border-gray-200"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
          {tiers.map((tier: any, idx: number) => (
            <button
              key={idx}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(tier.priceAmount);
                setOpen(false);
              }}
              className="px-3 py-2 text-left hover:bg-gray-100 text-xs flex justify-between items-center transition-colors"
            >
              <span className="text-gray-500 font-medium">SL ≥ {tier.quantity}:</span>
              <span className="font-bold text-gray-900">
                {tier.priceAmount.toLocaleString('vi-VN')}
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
