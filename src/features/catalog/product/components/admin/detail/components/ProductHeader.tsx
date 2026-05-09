'use client';

import React from 'react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import { ProductStatus } from '../../../../enums/product-status';
import { Calendar, ArrowLeft, Edit, Trash2, Ban, Zap, Package, Clock } from 'lucide-react';
import { GetPageProductDetailResponse } from '../../../../models';

interface ProductHeaderProps {
  product?: GetPageProductDetailResponse;
  onBack: () => void;
  onEdit: (product: any) => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export function ProductHeader({ product, onBack, onEdit, onToggleStatus, onDelete }: ProductHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-2">
      {/* Left section: Title & Back Button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-[#2B3674]" />
        </Button>
        
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#2B3674]">
              Chi tiết Hàng hóa
            </h2>
            <Badge variant="outline" className="font-mono text-[#4318FF] border-[#E9EDF7] bg-[#F4F7FE] px-2.5 py-0.5">
              <Package className="w-3 h-3 mr-1.5 opacity-60" />
              {product?.code || '---'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-[#A3AED0] text-sm flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Cập nhật {product?.createdAt ? new Date(product.createdAt).toLocaleDateString('vi-VN') : '---'}
            </p>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <p className="text-[#A3AED0] text-sm flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {product?.status === ProductStatus.ACTIVE ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
            </p>
          </div>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-2">
        {product?.status === ProductStatus.ACTIVE ? (
          <Button
            variant="outline"
            className="gap-2 border-slate-200 text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-colors h-10 font-medium"
            onClick={onToggleStatus}
          >
            <Ban className="w-4 h-4" /> Ngừng kinh doanh
          </Button>
        ) : (
          <Button
            variant="outline"
            className="gap-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50 transition-colors h-10 font-medium"
            onClick={onToggleStatus}
          >
            <Zap className="w-4 h-4 fill-emerald-500" /> Kích hoạt lại
          </Button>
        )}

        <Button
          variant="outline"
          className="gap-2 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors h-10 font-medium"
          onClick={() => onEdit(product)}
        >
          <Edit className="w-4 h-4" /> Chỉnh sửa
        </Button>

        <Button
          variant="destructive"
          className="gap-2 h-10 font-medium"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" /> Xóa
        </Button>
      </div>
    </div>
  );
}