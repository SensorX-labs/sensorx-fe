'use client';

import React from 'react';
import { ArrowLeft, Save, X, Barcode, Package, Clock, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Badge } from '@/shared/components/shadcn-ui/badge';

interface ProductFormHeaderProps {
  mode: 'create' | 'update';
  formData: any;
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
}

export function ProductFormHeader({ mode, formData, isSaving, onBack, onSave }: ProductFormHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white px-6 py-4 rounded border border-slate-200 shadow-sm sticky top-0 z-20 transition-all">
      {/* Left section: Title & Back Button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-[#2B3674]" />
        </Button>
        
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#2B3674]">
              {mode === 'create' ? 'Thiết lập Hàng hóa' : 'Cập nhật Hàng hóa'}
            </h2>
            {mode === 'update' && (
              <Badge variant="outline" className="font-mono text-[#4318FF] border-[#E9EDF7] bg-[#F4F7FE] px-2.5 py-0.5">
                <Barcode className="w-3 h-3 mr-1.5 opacity-60" />
                {formData.code || '---'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[#A3AED0] text-sm font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {mode === 'create' ? 'Cung cấp thông tin để đưa sản phẩm vào hệ thống' : 'Cập nhật thông tin chi tiết và cấu hình thuộc tính'}
            </p>
          </div>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors h-10 font-medium" 
          onClick={onBack}
        >
          <X className="w-4 h-4" /> Hủy
        </Button>
        
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="h-10 px-6 gap-2 bg-[#4318FF] hover:bg-[#3311DB] text-white font-bold rounded shadow-lg shadow-indigo-200 transition-all"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Đang lưu...' : 'Lưu hàng hóa'}
        </Button>
      </div>
    </div>
  );
}
