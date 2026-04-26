'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Trash2,
  Layers,
  Box,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { ProductStatus } from '../../../enums/product-status';
import { NotionEditor } from '@/shared/components/notion-editor';
import { ProductService } from '../../../services/product-service';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: any;
  mode: 'create' | 'update';
  onBack: () => void;
}

const statusLabel: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'Đang hoạt động',
  [ProductStatus.INACTIVE]: 'Tạm ngưng'
};

export function ProductForm({ product: initialProduct, mode, onBack }: ProductFormProps) {
  const [loading, setLoading] = useState(mode === 'update');
  const [formData, setFormData] = useState<any>({
    name: '',
    code: '',
    manufacture: '',
    unit: '',
    categoryId: '',
    productAttributes: [],
    productImages: [],
    productShowcases: []
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (mode === 'update' && initialProduct?.id) {
        try {
          const response = await ProductService.getDetail(initialProduct.id);
          if (response.isSuccess && response.value) {
            const data = {
              ...response.value,
              categoryId: response.value.categoryId || undefined,
              productAttributes: response.value.attributes || [],
              productImages: response.value.images?.map(url => ({ imageUrl: url })) || [],
              productShowcases: response.value.showcase ? [response.value.showcase] : []
            };
            setFormData(data);
          }
        } catch (error) {
          toast.error("Không thể tải thông tin sản phẩm");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [mode, initialProduct]);

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc");
      return;
    }

    setIsSaving(true);
    try {
      const command = {
        name: formData.name,
        manufacture: formData.manufacture || '',
        categoryId: formData.categoryId || undefined,
        unit: formData.unit || '',
        showcase: formData.productShowcases?.[0]?.body || '',
        imageUrls: formData.productImages?.map((img: any) => img.imageUrl) || [],
        attributes: formData.productAttributes?.map((attr: any) => ({
          attributeName: attr.name,
          attributeValue: attr.value
        })) || []
      };

      const res = mode === 'create'
        ? await ProductService.create(command)
        : await ProductService.update(initialProduct.id, command);

      if (res.isSuccess) {
        toast.success(mode === 'create' ? "Tạo hàng hóa thành công" : "Cập nhật hàng hóa thành công");
        onBack();
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi lưu dữ liệu");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Đang khởi tạo form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-50">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              {mode === 'create' ? 'Thiết lập hàng hóa mới' : 'Cập nhật hàng hóa'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {mode === 'create' ? 'Cung cấp thông tin để đưa sản phẩm vào hệ thống' : `Đang chỉnh sửa: ${formData.code}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50" onClick={onBack}>
            <X className="w-4 h-4 mr-2" /> Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="admin-btn-primary h-10 px-6 rounded-xl shadow-lg shadow-emerald-500/20 font-black uppercase tracking-widest text-[10px]"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
              <Box className="w-4 h-4 text-slate-400" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông tin định danh</h4>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên hàng hóa <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-input-premium w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                  placeholder="Nhập tên đầy đủ của hàng hóa..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã hàng (SKU) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="admin-input-premium w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono font-bold text-slate-700 uppercase"
                    placeholder="VD: SP001"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nhà sản xuất</label>
                <input
                  type="text"
                  value={formData.manufacture}
                  onChange={(e) => setFormData({ ...formData, manufacture: e.target.value })}
                  className="admin-input-premium w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                  placeholder="Hãng sản xuất, thương hiệu..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Danh mục</label>
                  <input
                    type="text"
                    value={formData.categoryName || ''}
                    className="admin-input-premium w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                    placeholder="Loại hàng..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đơn vị tính</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="admin-input-premium w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                    placeholder="VD: Cái, Bộ, Mét..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bộ sưu tập hình ảnh</h4>
              <ImageIcon className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3">
                {formData.productImages.map((img: any, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 shadow-inner bg-slate-50">
                    <img src={img.imageUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-rose-500/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-rose-600 rounded-full h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <button className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 group">
                  <Plus className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Thêm ảnh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Attributes & Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông số kỹ thuật mở rộng</h4>
              <Layers className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {formData.productAttributes.map((attr: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-center animate-in slide-in-from-right-4 duration-300">
                    <input
                      type="text"
                      value={attr.name}
                      placeholder="Tên thuộc tính (VD: Cân nặng)"
                      className="flex-[2] px-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm font-bold text-slate-700"
                    />
                    <input
                      type="text"
                      value={attr.value}
                      placeholder="Giá trị (VD: 500g)"
                      className="flex-[3] px-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm font-bold text-slate-700"
                    />
                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 rounded-xl">
                  <Plus className="w-4 h-4 mr-2" /> Thêm thông số mới
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nội dung mô tả sản phẩm</h4>
              <LayoutGrid className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-0 min-h-[400px]">
              <NotionEditor
                content={formData.productShowcases?.[0]?.body || ''}
                onChange={(content) => {
                  const newShowcases = [...(formData.productShowcases || [])];
                  if (newShowcases[0]) newShowcases[0].body = content;
                  else newShowcases.push({ summary: '', body: content });
                  setFormData({ ...formData, productShowcases: newShowcases });
                }}
                editable={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
