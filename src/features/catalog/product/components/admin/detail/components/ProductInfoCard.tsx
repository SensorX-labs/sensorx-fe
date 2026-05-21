'use client';

import React from 'react';
import { Barcode, Factory, Tag, Scale } from 'lucide-react';
import { GetPageProductDetailResponse } from '../../../../models';
import { ProductStatus } from '../../../../enums/product-status';

interface ProductInfoCardProps {
  product?: GetPageProductDetailResponse;
}

const statusColor: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'bg-emerald-50/80 text-emerald-700 border-emerald-100',
  [ProductStatus.INACTIVE]: 'bg-slate-50 text-slate-600 border-slate-200'
};

const statusLabel: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'Đang hoạt động',
  [ProductStatus.INACTIVE]: 'Tạm ngưng'
};

export function ProductInfoCard({ product }: ProductInfoCardProps) {
  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">Thông tin chính</h4>
      </div>

      <div className="p-6 space-y-7">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Tên hàng hóa</p>
          <p className="text-base font-bold text-slate-800 leading-snug">{product?.name || '--'}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Mã hàng</p>
            <div className="flex items-center gap-2 text-sm text-slate-700 font-mono font-bold uppercase bg-slate-50 px-3 py-1.5 rounded border border-slate-100 w-fit">
              <Barcode className="w-4 h-4 text-slate-400" />
              {product?.code || '--'}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Trạng thái</p>
            {product?.status ? (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[11px] font-bold uppercase tracking-wider ${statusColor[product.status]}`}>
                {product.status === ProductStatus.ACTIVE && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
                {statusLabel[product.status]}
              </span>
            ) : (
              <span className="text-sm font-medium text-slate-500">--</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Nhà cung cấp</p>
          <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
            <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <Factory className="w-3.5 h-3.5 text-slate-400" />
            </div>
            {product?.supplierName || '--'}
          </div>
        </div>

        <div className="w-full h-px bg-slate-100"></div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Danh mục</p>
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-sm font-semibold text-slate-700">
                {product?.categoryName || '--'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Đơn vị tính</p>
            <div className="flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-sm font-bold text-slate-700">
                {product?.unitOfQuantityName || '--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
