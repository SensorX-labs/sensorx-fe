'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/shadcn-ui/table';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/shadcn-ui/dropdown-menu';
import {
  Plus,
  MoreHorizontal,
  Eye,
  Ban,
  Copy,
  Search,
  Filter,
  FileDown,
  FileUp,
  Download,
  ChevronLast,
  History,
  User,
  ArrowUpDown
} from 'lucide-react';
import { StatCards } from './internal-price-stats';
import { PriceTierTable } from './price-tier-table';
import { InternalPrice, InternalPriceStatus } from '../../models';
import { MOCK_INTERNAL_PRICES } from '../../mocks';
import { Checkbox } from '@/shared/components/shadcn-ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/shared/components/shadcn-ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/components/shadcn-ui/tooltip';
import { Separator } from '@/shared/components/shadcn-ui/separator';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';

interface InternalPriceListProps {
  onViewDetail: (price: InternalPrice) => void;
}

export function InternalPriceList({ onViewDetail }: InternalPriceListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quickViewPrice, setQuickViewPrice] = useState<InternalPrice | null>(null);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === MOCK_INTERNAL_PRICES.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(MOCK_INTERNAL_PRICES.map(p => p.id)));
    }
  };

  const getStatusBadge = (status: InternalPriceStatus) => {
    const badgeMap: Record<InternalPriceStatus, { label: string, color: string, tooltip: string }> = {
      'Active': {
        label: 'Đang hiệu lực',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        tooltip: 'Bảng giá đang được áp dụng cho các giao dịch hiện tại.'
      },
      'ExpiringSoon': {
        label: 'Sắp hết hạn',
        color: 'bg-amber-50 text-amber-700 border-amber-100',
        tooltip: 'Bảng giá sẽ hết hiệu lực trong vòng 7 ngày tới.'
      },
      'Expired': {
        label: 'Đã hết hạn',
        color: 'bg-rose-50 text-rose-700 border-rose-100',
        tooltip: 'Bảng giá đã qua ngày hết hạn và không thể sử dụng.'
      }
    };

    const config = badgeMap[status];

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={`${config.color} font-medium`}>
              {config.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs max-w-[200px]">{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-left-4 duration-1200" style={{ height: `calc(100vh - ${LAYOUT_CONSTANTS.HEADER_HEIGHT + LAYOUT_CONSTANTS.FOOTER_HEIGHT}px)` }}>
      <StatCards />

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col min-h-0">

        {/* Unified Header Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-50 p-4 shrink-0 z-10">
          <div className="flex items-center gap-4">

            {/* Search Input (Left) */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mã giá, tên sản phẩm..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm text-slate-700 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>

            {/* Action Buttons (Right) */}
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" className="h-9 gap-2 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm">
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Nhập CSV</span>
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm">
                <FileUp className="w-4 h-4" />
                <span className="hidden sm:inline">Xuất Excel</span>
              </Button>
              <Button size="sm" className="h-9 admin-btn-primary gap-2 shadow-lg shadow-emerald-500/20">
                <Plus className="w-4 h-4" />
                Tạo bảng giá
              </Button>
            </div>
          </div>

          {/* Bulk Action Bar (Visible when items selected) */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2 px-4 rounded-lg animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-emerald-800">Đã chọn {selectedIds.size} mục</span>
                <Separator orientation="vertical" className="h-4 bg-emerald-200" />
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-emerald-700 hover:bg-emerald-100 gap-2 h-8">
                    <Ban className="w-4 h-4" /> Vô hiệu hóa
                  </Button>
                  <Button variant="ghost" size="sm" className="text-emerald-700 hover:bg-emerald-100 gap-2 h-8">
                    <Download className="w-4 h-4" /> Tải về
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="text-emerald-700">Bỏ chọn</Button>
            </div>
          )}
        </div>

        {/* Main Data Table */}
        <div className="relative overflow-x-auto flex-1 min-h-0">
          <Table>
            <TableHeader className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
              <TableRow className="border-none">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedIds.size === MOCK_INTERNAL_PRICES.length && MOCK_INTERNAL_PRICES.length > 0}
                    onCheckedChange={toggleAll}
                    className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />
                </TableHead>
                <TableHead className="admin-table-th">Mã bảng giá</TableHead>
                <TableHead className="admin-table-th">Sản phẩm</TableHead>
                <TableHead className="admin-table-th text-right group cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-end gap-1">
                    Giá đề xuất <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                </TableHead>
                <TableHead className="admin-table-th text-center group cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    Giá sàn <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                </TableHead>
                <TableHead className="admin-table-th text-center group cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    Trạng thái <Filter className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                </TableHead>
                <TableHead className="admin-table-th group cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-1">
                    Ngày hết hạn <Filter className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                </TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INTERNAL_PRICES.map((price) => (
                <React.Fragment key={price.id}>
                  <TableRow
                    className={`group cursor-pointer hover:bg-emerald-50/30 transition-all ${selectedIds.has(price.id) ? 'bg-emerald-50' : ''}`}
                    onClick={() => setQuickViewPrice(price)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(price.id)}
                        onCheckedChange={() => toggleSelection(price.id)}
                        className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-[11px] font-bold text-emerald-700">{price.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-bold text-slate-800 text-[13px]">{price.productName}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">{price.productId}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-700">
                      {price.suggestedPrice.toLocaleString() + " " + price.suggestedPriceCurrency}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-bold text-xs border border-rose-100">
                        {price.floorPrice.toLocaleString() + " " + price.floorPriceCurrency}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(price.status)}
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium text-xs">
                      {new Date(price.expiresAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="gap-2" onClick={() => onViewDetail(price)}>
                            <Eye className="w-4 h-4 text-emerald-600" /> Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Copy className="w-4 h-4 text-emerald-600" /> Nhân bản
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600">
                            <Ban className="w-4 h-4" /> Vô hiệu hóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hiển thị 1-4 trên tổng số 128 bảng giá</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 border-slate-200 text-slate-500" disabled>Trước</Button>
            <Button variant="outline" size="sm" className="h-8 border-slate-200 text-slate-500">Sau</Button>
          </div>
        </div>
      </div>

      {/* Quick View Drawer */}
      <Sheet open={!!quickViewPrice} onOpenChange={() => setQuickViewPrice(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] border-l-emerald-100 overflow-y-auto">
          {quickViewPrice && (
            <div className="space-y-8 py-4">
              <SheetHeader>
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <BadgeDollarSign className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Xem nhanh bảng giá</span>
                </div>
                <SheetTitle className="text-2xl font-bold text-slate-900 leading-tight">
                  {quickViewPrice.productName}
                </SheetTitle>
                <SheetDescription className="font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block w-fit text-xs font-bold">
                  ID: {quickViewPrice.id}
                </SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Giá đề xuất</p>
                  <p className="text-lg font-black text-slate-900">{quickViewPrice.suggestedPrice.toLocaleString()} ₫</p>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Giá sàn</p>
                  <p className="text-lg font-black text-rose-700">{quickViewPrice.floorPrice.toLocaleString()} ₫</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <History className="w-4 h-4 text-emerald-500" />
                  Lịch sử thay đổi & Thông tin
                </div>
                <div className="space-y-4 border-l-2 border-emerald-100 ml-2 pl-6">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    <p className="text-xs font-bold text-slate-900">Thiết lập bảng giá mới</p>
                    <p className="text-[10px] text-slate-400 font-medium">24/04/2026 14:30</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                      <User className="w-3 h-3" />
                      <span>Thực hiện bởi: <strong>Admin Nguyễn Văn A</strong></span>
                    </div>
                  </div>
                  <div className="relative opacity-60">
                    <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white" />
                    <p className="text-xs font-bold text-slate-900">Điều chỉnh giá sàn (+5%)</p>
                    <p className="text-[10px] text-slate-400 font-medium">10/03/2026 09:15</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <ChevronLast className="w-4 h-4 text-emerald-500" />
                  Phân tầng giá hiện tại
                </div>
                <PriceTierTable tiers={quickViewPrice.priceTiers} compact={false} />
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 admin-btn-primary" onClick={() => onViewDetail(quickViewPrice)}>
                  Xem chi tiết đầy đủ
                </Button>
                <Button variant="outline" className="flex-1 border-slate-200">Đóng</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Keep this at the top for BadgeDollarSign which was used in StatCards or Sheet
function BadgeDollarSign(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
