'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn-ui/card';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Package,
  Calendar,
  Tag,
  ShieldCheck,
  TrendingDown,
  Info,
  Box
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ProductSelectionDialog,
  Product
} from '@/shared/components/business/product-selection-dialog';

interface InternalPriceFormProps {
  onBack: () => void;
}

export function InternalPriceForm({ onBack }: InternalPriceFormProps) {
  const [loading, setLoading] = useState(false);

  // Mock product selection state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    suggestedPrice: 0,
    floorPrice: 0,
    expiresAt: '',
    notes: '',
    tiers: [
      { quantity: 1, price: 0 }
    ]
  });

  const handleAddTier = () => {
    const lastTier = formData.tiers[formData.tiers.length - 1];
    setFormData({
      ...formData,
      tiers: [...formData.tiers, { quantity: (lastTier?.quantity || 0) + 10, price: lastTier?.price || 0 }]
    });
  };

  const handleRemoveTier = (index: number) => {
    if (formData.tiers.length <= 1) return;
    const newTiers = formData.tiers.filter((_, i) => i !== index);
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleTierChange = (index: number, field: string, value: number) => {
    const newTiers = [...formData.tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Logic validation
    if (formData.suggestedPrice < formData.floorPrice) {
      toast.error("Giá đề xuất không được nhỏ hơn giá sàn");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Tạo bảng giá nội bộ thành công");
      onBack();
    } catch (error) {
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-1000 pb-20 -mt-4 w-full">
      {/* Sticky Header Actions */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-none mb-1">Thêm Bảng giá mới</h2>
              <p className="text-slate-400 text-xs font-medium">Thiết lập chính sách giá nội bộ cho sản phẩm</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 rounded-xl text-sm font-bold border-slate-200 px-6" onClick={onBack} disabled={loading}>Hủy bỏ</Button>
            <Button
              className="h-11 rounded-xl text-sm font-bold admin-btn-primary gap-2 px-8 shadow-lg shadow-emerald-500/20"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>Lưu bảng giá</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full px-1">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Left Column: Basic Info (2/5 width) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              {/* Thêm px-5 py-4 để thu nhỏ chiều cao thẻ Header */}
              <CardHeader className="bg-white border-b border-slate-100 px-5 py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                  <Package className="w-4 h-4 text-emerald-500" />
                  Thông tin sản phẩm & Giá cơ sở
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-4 space-y-5">
                {/* Product Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Chọn sản phẩm</label>
                  {!selectedProduct ? (
                    <div
                      onClick={() => setIsDialogOpen(true)}
                      className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all group"
                    >
                      <Plus className="w-6 h-6 text-slate-300 mb-1 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-sm font-medium text-slate-400 group-hover:text-slate-600 transition-colors">Nhấn để tìm kiếm sản phẩm</span>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsDialogOpen(true)}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-emerald-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center overflow-hidden border border-emerald-100">
                          {selectedProduct.images.length > 0 ? (
                            <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                          ) : (
                            <Box className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{selectedProduct.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Mã: {selectedProduct.code} • NSX: {selectedProduct.manufacture}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400 text-[10px] uppercase font-bold">Thay đổi</Button>
                    </div>
                  )}
                </div>

                <ProductSelectionDialog
                  isOpen={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  onSelect={(p) => {
                    setSelectedProduct(p);
                    setIsDialogOpen(false);
                  }}
                />

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Giá đề xuất niêm yết
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full h-11 bg-white border border-slate-200 rounded-lg pl-4 pr-10 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        placeholder="0"
                        value={formData.suggestedPrice || ''}
                        onChange={(e) => setFormData({ ...formData, suggestedPrice: Number(e.target.value) })}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₫</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Giá sàn tối thiểu
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full h-11 bg-white border border-slate-200 rounded-lg pl-4 pr-10 text-sm font-bold focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all"
                        placeholder="0"
                        value={formData.floorPrice || ''}
                        onChange={(e) => setFormData({ ...formData, floorPrice: Number(e.target.value) })}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₫</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Thời hạn hiệu lực
                    </label>
                    <input
                      type="date"
                      className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Price Tiers (3/5 width) */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden h-full">
              {/* Thêm px-5 py-3 để ép khoảng cách cho vừa với cái Nút "Thêm bậc" */}
              <CardHeader className="bg-white border-b border-slate-100 px-5 py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                  Cấu hình phân tầng giá (Tiers)
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold" onClick={handleAddTier}>
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm bậc
                </Button>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-4 px-2">
                    <div className="col-span-5"><span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Mốc số lượng (≥)</span></div>
                    <div className="col-span-5"><span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Đơn giá áp dụng</span></div>
                    <div className="col-span-1 text-right"></div>
                  </div>

                  {formData.tiers.map((tier, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center animate-in slide-in-from-top-2 duration-300">
                      <div className="col-span-5 relative">
                        <input
                          type="number"
                          className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-lg pl-3 pr-8 font-bold text-sm focus:bg-white transition-all outline-none"
                          value={tier.quantity}
                          onChange={(e) => handleTierChange(index, 'quantity', Number(e.target.value))}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">SP</span>
                      </div>
                      <div className="col-span-5 relative">
                        <input
                          type="number"
                          className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-lg pl-3 pr-8 font-bold text-sm focus:bg-white transition-all outline-none"
                          value={tier.price || ''}
                          onChange={(e) => handleTierChange(index, 'price', Number(e.target.value))}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">₫</span>
                      </div>
                      <div className="col-span-1 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-300 hover:text-rose-500 hover:bg-rose-50"
                          onClick={() => handleRemoveTier(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
