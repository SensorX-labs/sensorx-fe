import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/shadcn-ui/table';
import { PriceTier } from '../../../models';
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
    <div className={`overflow-hidden rounded border border-slate-200 bg-white shadow-sm ${compact ? 'mx-4 mb-4' : ''}`}>
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-b border-slate-200">
            <TableHead className="w-[80px] text-center font-semibold uppercase text-slate-400 text-[10px] tracking-wider">
              Tier
            </TableHead>
            <TableHead className="font-semibold uppercase text-slate-400 text-[10px] tracking-wider">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Khoảng số lượng
              </div>
            </TableHead>
            <TableHead className="text-right font-semibold uppercase text-slate-400 text-[10px] tracking-wider pr-6">
              <div className="flex items-center justify-end gap-2">
                <TrendingDown className="w-4 h-4" />
                Đơn giá áp dụng
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTiers.map((tier, idx) => (
            <TableRow key={idx} className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                  {idx + 1}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">
                    Từ {tier.quantity.toLocaleString('vi-VN')} sản phẩm
                  </span>
                  {!compact && (
                    <span className="text-[10px] text-slate-400 font-medium italic mt-0.5">
                      {idx < sortedTiers.length - 1
                        ? `Áp dụng cho đến ${sortedTiers[idx + 1].quantity - 1} sản phẩm`
                        : 'Áp dụng cho mọi số lượng lớn nhất'}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex flex-col items-end">
                  <span className="text-base font-bold text-emerald-600 tracking-tight">
                    {tier.price.toLocaleString('vi-VN')}
                    <span className="ml-1 text-[10px] font-bold uppercase text-emerald-500/70">₫</span>
                  </span>
                  {!compact && idx > 0 && (
                    <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1 mt-0.5">
                      ↓ Giảm {((1 - tier.price / sortedTiers[0].price) * 100).toFixed(1)}% so với Tier 1
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {sortedTiers.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Package className="w-8 h-8 opacity-20" />
                  <p className="text-sm font-medium">Chưa có Price Tier nào được thiết lập</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
