import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/shadcn-ui/dialog';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import { Button } from '@/shared/components/shadcn-ui/button';
import {
  Search,
  Box,
  Factory,
  PackageSearch,
  CheckCircle2,
  Barcode
} from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  code: string;
  manufacture: string;
  categoryName: string;
  images: string[];
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'PRD-851115057',
    code: 'PRD-260424-851115057',
    name: 'Tasty Rubber Tuna',
    manufacture: 'Lâm, Dương and Phan',
    categoryName: 'Cảm biến quang',
    images: []
  },
  {
    id: 'PRD-851115058',
    code: 'PRD-260424-851115058',
    name: 'Industrial Pressure Sensor',
    manufacture: 'SensorX Global',
    categoryName: 'Cảm biến áp suất',
    images: []
  },
  {
    id: 'PRD-851115059',
    code: 'PRD-260424-851115059',
    name: 'Electromagnetic Flow Meter',
    manufacture: 'FlowTech Solutions',
    categoryName: 'Đồng hồ đo',
    images: []
  },
];

interface ProductSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (product: Product) => void;
}

export function ProductSelectionDialog({
  isOpen,
  onOpenChange,
  onSelect
}: ProductSelectionDialogProps) {
  const [search, setSearch] = useState('');

  // Lọc sản phẩm
  const filtered = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Mở rộng max-width một chút để item có không gian thở khi kéo dài */}
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden border-slate-100 shadow-2xl rounded-2xl bg-white flex flex-col h-[85vh] max-h-[800px]">

        {/* Header & Search Area - Cố định phía trên */}
        <DialogHeader className="p-6 pb-5 bg-white border-b border-slate-100 shrink-0 z-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <PackageSearch className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-800 tracking-tight">
                Chọn sản phẩm
              </DialogTitle>
              <p className="text-slate-500 text-sm mt-0.5">
                Tìm kiếm sản phẩm để thiết lập bảng giá nội bộ
              </p>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Nhập tên hoặc mã sản phẩm (VD: SP001)..."
              className="pl-12 h-12 bg-slate-50/80 border-slate-200 hover:border-emerald-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium rounded-xl shadow-inner shadow-slate-100/50 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </DialogHeader>

        {/* Product List Area - Flex-1 để chiếm toàn bộ phần giữa, tràn viền */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar p-3">
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-2 w-full">
              {filtered.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelect(p)}
                  // Item thiết kế tràn ngang, chia flex layout rõ ràng
                  className="group bg-white p-4 rounded-xl border border-slate-200/60 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 cursor-pointer transition-all duration-200 flex items-center justify-between w-full"
                >

                  {/* Cột trái: Hình ảnh + Info chính */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-100 group-hover:border-emerald-100 transition-colors">
                      {p.images?.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <Box className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h4 className="text-base font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                          {p.name}
                        </h4>
                        <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          {p.categoryName}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Barcode className="w-4 h-4 text-slate-400" />
                          <span className="font-mono text-slate-600">{p.code}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                        <div className="flex items-center gap-1.5 truncate">
                          <Factory className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{p.manufacture}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cột phải: Action Button - Đẩy sát lề phải */}
                  <div className="shrink-0 pl-4 border-l border-slate-100 group-hover:border-emerald-100 transition-colors flex items-center h-full">
                    <Button
                      variant="ghost"
                      className="h-10 px-5 rounded-lg font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Chọn sản phẩm
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-20">
              <div className="w-20 h-20 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-700">Không tìm thấy sản phẩm</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-[250px]">
                Không có sản phẩm nào khớp với "{search}". Vui lòng thử từ khóa khác.
              </p>
            </div>
          )}
        </div>

        {/* Footer - Cố định phía dưới */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center px-6 shrink-0 z-10">
          <p className="text-xs font-bold text-slate-400">
            Hiển thị <span className="text-slate-700">{filtered.length}</span> kết quả
          </p>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
            <span className="flex items-center justify-center w-4 h-4 rounded bg-white border shadow-sm text-[10px] font-bold">↵</span>
            <span>Click để chọn nhanh</span>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}