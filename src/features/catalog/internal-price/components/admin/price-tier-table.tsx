import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/shadcn-ui/table';
import { PriceTier } from '../../models';
import { TrendingDown, Package } from 'lucide-react';

interface PriceTierTableProps {
  tiers: PriceTier[];
  compact?: boolean;
}

export function PriceTierTable({ tiers, compact = false }: PriceTierTableProps) {
  // Sort: quantity ascending, price descending (though price usually decreases with quantity)
  const sortedTiers = [...tiers].sort((a, b) => {
    if (a.quantity !== b.quantity) return a.quantity - b.quantity;
    return b.price - a.price;
  });

  return (
    <div className={`rounded-lg border bg-slate-50/50 ${compact ? 'mx-4 mb-4' : ''}`}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[150px]">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-400" />
                Số lượng
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-slate-400" />
                Đơn giá
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTiers.map((tier, idx) => (
            <TableRow key={idx} className="hover:bg-slate-100/50 transition-colors">
              <TableCell className="font-medium">Từ {tier.quantity} sản phẩm</TableCell>
              <TableCell className="text-emerald-600 font-semibold">
                {tier.price.toLocaleString('vi-VN')} ₫
              </TableCell>
            </TableRow>
          ))}
          {sortedTiers.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4 text-slate-400">
                Chưa có Price Tier nào được thiết lập
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
