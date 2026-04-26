'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Image as ImageIcon,
  DollarSign,
  ArrowLeft,
  Edit,
  Trash2,
  BookOpen,
  Barcode,
  Factory,
  Box
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { MOCK_INTERNAL_PRICES } from '../../../mocks/internal-price-mocks';
import { ProductStatus } from '../../../enums/product-status';
import { NotionEditor } from '@/shared/components/notion-editor';
import { ProductService } from '../../../services/product-service';
import { toast } from 'sonner';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onEdit: (product: any) => void;
}

const statusColor: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [ProductStatus.INACTIVE]: 'bg-slate-50 text-slate-700 border-slate-200'
};

const statusLabel: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'Đang hoạt động',
  [ProductStatus.INACTIVE]: 'Tạm ngưng'
};

export function ProductDetail({ productId, onBack, onEdit }: ProductDetailProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductService.getDetail(productId);
        if (response.isSuccess && response.value) {
          const data = {
            ...response.value,
            productAttributes: response.value.attributes || [],
            productImages: response.value.images?.map(url => ({ imageUrl: url })) || [],
            productShowcases: response.value.showcase ? [response.value.showcase] : []
          };
          setProduct(data);
        }
      } catch (error) {
        console.error(">>> Error fetching product detail:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Lấy dữ liệu giá mẫu cho sản phẩm này
  const internalPrice = product ? MOCK_INTERNAL_PRICES.find(ip => ip.productId === (product.code || product.id)) : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Đang tải chi tiết...</p>
      </div>
    );
  }

  if (!product) return <div className="p-6 text-slate-600">Không tìm thấy hàng hóa</div>;

  const images = product.productImages ?? [];

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-50">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Chi tiết hàng hóa</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
            onClick={() => onEdit(product)}
          >
            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
          </Button>
          <Button variant="outline" className="rounded-xl border-rose-100 text-rose-600 font-bold hover:bg-rose-50">
            <Trash2 className="w-4 h-4 mr-2" /> Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Thông tin chính */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông tin chính</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tên hàng hóa</p>
                <p className="text-base font-bold text-slate-800">{product.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã hàng</p>
                  <div className="flex items-center gap-1.5 text-slate-700 font-mono font-bold uppercase">
                    <Barcode className="w-3.5 h-3.5 text-slate-400" />
                    {product.code}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trạng thái</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${statusColor[product.status]}`}>
                    {statusLabel[product.status]}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nhà sản xuất</p>
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Factory className="w-3.5 h-3.5 text-slate-400" />
                  {product.manufacture || '--'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Danh mục</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                    {product.categoryName || '--'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đơn vị tính</p>
                  <span className="text-slate-700 font-bold italic">{product.unit || '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hình ảnh */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hình ảnh sản phẩm</h4>
              <ImageIcon className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-4 space-y-4">
              <div className="aspect-square rounded-xl bg-slate-50 border border-slate-100 overflow-hidden group">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImg]?.imageUrl}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={product.name}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <Box className="w-12 h-12 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">No Image</p>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(idx)}
                      className={`
                        w-16 h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden transition-all
                        ${selectedImg === idx ? 'border-emerald-500 scale-95' : 'border-slate-100 hover:border-slate-200'}
                      `}
                    >
                      <img src={img.imageUrl} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Chính sách giá */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chính sách giá áp dụng</h4>
              <DollarSign className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-0">
              {internalPrice && internalPrice.priceTiers.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                      <th className="px-6 py-3 text-left">Số lượng tối thiểu</th>
                      <th className="px-6 py-3 text-right">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {internalPrice.priceTiers.map((tier: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 text-slate-700 font-bold">Từ {tier.fromQuantity} {product.unit}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-base font-black text-emerald-600">{tier.price.toLocaleString('vi-VN')}</span>
                          <span className="ml-1 text-[10px] font-bold text-slate-400 uppercase">đ</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <DollarSign className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest italic">Chưa thiết lập bảng giá</p>
                </div>
              )}
            </div>
          </div>

          {/* Thuộc tính & Thông số */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông số kỹ thuật</h4>
              <Layers className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-0">
              {product.productAttributes && product.productAttributes.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-50">
                    {product.productAttributes.map((attr: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4 w-1/3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/20">{attr.name}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{attr.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <Layers className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest italic">Không có thuộc tính mở rộng</p>
                </div>
              )}
            </div>
          </div>

          {/* Mô tả Notion */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mô tả chi tiết</h4>
              <BookOpen className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-6 min-h-[200px]">
              <NotionEditor
                content={product.productShowcases?.[0]?.body || ''}
                editable={false}
              />
              {(!product.productShowcases || product.productShowcases.length === 0) && (
                <div className="flex flex-col items-center justify-center text-slate-300 py-10">
                  <p className="text-xs font-bold uppercase tracking-widest italic text-slate-400">Chưa có nội dung mô tả</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
