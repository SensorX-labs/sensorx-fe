'use client';

import React from 'react';
import { ArrowLeft, Save, X, Barcode, Package } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';

interface ProductFormHeaderProps {
  mode: 'create' | 'update';
  formData: any;
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
}

export function ProductFormHeader({ mode, formData, isSaving, onBack, onSave }: ProductFormHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded border border-slate-100 shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Button>
        <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              {mode === 'create' ? 'Thiết lập hàng hóa' : 'Cập nhật hàng hóa'}
            </h2>
            {mode === 'update' && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
                <Barcode className="w-3.5 h-3.5" />
                {formData.code}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {mode === 'create' ? 'Cung cấp thông tin để đưa sản phẩm vào hệ thống' : 'Cập nhật thông tin chi tiết và cấu hình thuộc tính hàng hóa'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="rounded border-slate-200 text-slate-700 font-bold hover:bg-slate-50" onClick={onBack}>
          <X className="w-4 h-4 mr-2" /> Hủy
        </Button>
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="admin-btn-primary h-10 px-6 rounded shadow-lg shadow-emerald-500/20 font-black uppercase tracking-widest text-[10px]"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaving ? 'Đang lưu...' : 'Lưu hàng hóa'}
        </Button>
      </div>
    </div>
  );
}
