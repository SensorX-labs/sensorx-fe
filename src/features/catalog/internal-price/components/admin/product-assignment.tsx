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
import { Checkbox } from '@/shared/components/shadcn-ui/checkbox';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Search, Save, CheckCircle } from 'lucide-react';
import { Input } from '@/shared/components/shadcn-ui/input';
import { MOCK_PRODUCTS } from '../../mocks';

export function ProductAssignment() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleProduct = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === MOCK_PRODUCTS.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(MOCK_PRODUCTS.map(p => p.id)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Tìm sản phẩm theo tên, mã..." 
            className="pl-10 bg-slate-50 border-none"
          />
        </div>
        {selectedIds.size > 0 && (
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Save className="w-4 h-4" />
            Áp dụng cho {selectedIds.size} sản phẩm
          </Button>
        )}
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedIds.size === MOCK_PRODUCTS.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Mã sản phẩm</TableHead>
              <TableHead>Hãng</TableHead>
              <TableHead>ĐVT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PRODUCTS.map((product) => (
              <TableRow key={product.id} className="hover:bg-slate-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedIds.has(product.id)}
                    onCheckedChange={() => toggleProduct(product.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{product.code}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
        <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
        <div className="text-sm text-blue-700">
          <strong>Lưu ý:</strong> Việc áp dụng bảng giá này sẽ ghi đè các thiết lập giá cũ của sản phẩm được chọn.
        </div>
      </div>
    </div>
  );
}
