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
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface InternalPriceFormProps {
  onBack: () => void;
}

export function InternalPriceForm({ onBack }: InternalPriceFormProps) {
  const [loading, setLoading] = useState(false);

  // Mock product selection state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-1200 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Thêm Bảng giá mới</h2>
            <p className="text-slate-400 text-sm">Thiết lập chính sách giá nội bộ cho sản phẩm</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack} disabled={loading}>Hủy bỏ</Button>
          <Button
            className="admin-btn-primary gap-2 px-6 shadow-lg shadow-emerald-500/20"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Lưu bảng giá</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-50">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                <Package className="w-4 h-4 text-emerald-500" />
                Thông tin sản phẩm & Giá cơ sở
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Product Selection Placeholder */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Chọn sản phẩm</label>
                <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                  <Plus className="w-6 h-6 text-slate-300 mb-1" />
                  <span className="text-sm font-medium text-slate-400">Nhấn để tìm kiếm sản phẩm</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Giá đề xuất niêm yết
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full h-11 bg-white border border-slate-200 rounded-lg pl-4 pr-10 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      placeholder="0"
                      value={formData.suggestedPrice || ''}
                      onChange={(e) => setFormData({ ...formData, suggestedPrice: Number(e.target.value) })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₫</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Giá sàn tối thiểu
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full h-11 bg-white border border-slate-200 rounded-lg pl-4 pr-10 font-bold focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all"
                      placeholder="0"
                      value={formData.floorPrice || ''}
                      onChange={(e) => setFormData({ ...formData, floorPrice: Number(e.target.value) })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₫</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
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
            </CardContent>
          </Card>

          {/* Price Tiers Management */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                Cấu hình phân tầng giá (Tiers)
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold" onClick={handleAddTier}>
                <Plus className="w-4 h-4 mr-1" />
                Thêm bậc
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-2">
                  <div className="col-span-5"><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mốc số lượng (≥)</span></div>
                  <div className="col-span-5"><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Đơn giá áp dụng</span></div>
                  <div className="col-span-2 text-right"></div>
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
                    <div className="col-span-2 text-right">
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

        {/* Right Column: Tips & Rules */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-indigo-900 text-indigo-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <AlertCircle className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-white text-lg font-bold tracking-tight">Quy tắc vàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black border border-emerald-500/20">1</div>
                  <p className="text-xs leading-relaxed text-indigo-100/80">
                    <strong className="text-white font-bold">Giá sàn:</strong> Là "lằn ranh đỏ". Sales không được chốt thấp hơn giá này mà không có duyệt từ sếp.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black border border-emerald-500/20">2</div>
                  <p className="text-xs leading-relaxed text-indigo-100/80">
                    <strong className="text-white font-bold">Phân tầng:</strong> Nên thiết lập ít nhất 3 bậc (Mẫu: 20-50-100 sản phẩm) để kích thích khách mua nhiều.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black border border-emerald-500/20">3</div>
                  <p className="text-xs leading-relaxed text-indigo-100/80">
                    <strong className="text-white font-bold">Giảm dần:</strong> Đơn giá bậc sau luôn phải nhỏ hơn bậc trước.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-xl border border-white/10 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-300 shrink-0" />
                <p className="text-[11px] italic text-indigo-200">
                  Mẹo: Đặt Giá sàn lớn hơn Giá vốn khoảng 10-15% để đảm bảo luôn có lợi nhuận gộp an toàn.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
