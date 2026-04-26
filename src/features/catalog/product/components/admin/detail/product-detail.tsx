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
  Box,
  XCircle,
  CheckCircle2,
  Ban,
  Zap
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { MOCK_INTERNAL_PRICES } from '../../../mocks/internal-price-mocks';
import { ProductStatus } from '../../../enums/product-status';
import { NotionEditor } from '@/shared/components/notion-editor';
import { ProductService } from '../../../services/product-service';
import { ConfirmDialog } from '@/shared/components/admin/confirm-dialog';
import { toast } from 'sonner';
import { ProductDetail } from '../../../models';

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

export function ProductDetailView({ productId, onBack, onEdit }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductDetail>();
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);

  // State for Confirm Dialogs
  const [statusConfirm, setStatusConfirm] = useState({ isOpen: false, loading: false });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, loading: false });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductService.getDetail(productId);
        if (response.isSuccess && response.value) {
          setProduct(response.value);
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

  const handleToggleStatus = async () => {
    if (!product) return;
    const newStatus = product.status === ProductStatus.ACTIVE ? ProductStatus.INACTIVE : ProductStatus.ACTIVE;

    setStatusConfirm({ ...statusConfirm, loading: true });
    try {
      const res = await ProductService.changeStatus(product.id, newStatus);
      if (res.isSuccess) {
        toast.success(product.status === ProductStatus.ACTIVE ? "Đã ngừng kinh doanh sản phẩm" : "Đã kích hoạt sản phẩm thành công");
        setStatusConfirm({ isOpen: false, loading: false });
        // Quay lại trang list để xem thay đổi
        onBack();
      }
    } catch (error) {
      toast.error("Lỗi khi thay đổi trạng thái");
      setStatusConfirm({ ...statusConfirm, loading: false });
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    setDeleteConfirm({ ...deleteConfirm, loading: true });
    try {
      const res = await ProductService.deleteProduct(product.id);
      if (res.isSuccess) {
        toast.success("Xóa sản phẩm thành công");
        onBack();
      }
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm");
    } finally {
      setDeleteConfirm({ isOpen: false, loading: false });
    }
  };

  const images = product?.images ?? [];

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between bg-white p-4 rounded border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-50">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Chi tiết hàng hóa</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product?.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {product?.status === ProductStatus.ACTIVE ? (
            <Button
              variant="outline"
              className="rounded border-amber-100 text-amber-600 font-bold hover:bg-amber-50"
              onClick={() => setStatusConfirm({ ...statusConfirm, isOpen: true })}
            >
              <Ban className="w-4 h-4 mr-2" /> Ngừng kinh doanh
            </Button>
          ) : (
            <Button
              variant="outline"
              className="rounded border-emerald-100 text-emerald-600 font-bold hover:bg-emerald-50"
              onClick={() => setStatusConfirm({ ...statusConfirm, isOpen: true })}
            >
              <Zap className="w-4 h-4 mr-2 text-emerald-500 fill-emerald-500" /> Kích hoạt lại
            </Button>
          )}
          <Button
            variant="outline"
            className="rounded border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
            onClick={() => onEdit(product)}
          >
            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
          </Button>
          <Button
            variant="outline"
            className="rounded border-rose-100 text-rose-600 font-bold hover:bg-rose-50"
            onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: true })}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Thông tin chính */}
          <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông tin chính</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tên hàng hóa</p>
                <p className="text-base font-bold text-slate-800">{product?.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã hàng</p>
                  <div className="flex items-center gap-1.5 text-slate-700 font-mono font-bold uppercase">
                    <Barcode className="w-3.5 h-3.5 text-slate-400" />
                    {product?.code}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trạng thái</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider ${product?.status ? statusColor[product.status] : ''}`}>
                    {product?.status ? statusLabel[product.status] : '--'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nhà sản xuất</p>
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Factory className="w-3.5 h-3.5 text-slate-400" />
                  {product?.manufacture || '--'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Danh mục</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                    {product?.categoryName || '--'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đơn vị tính</p>
                  <span className="text-slate-700 font-bold italic">{product?.unit || '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hình ảnh */}
          <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hình ảnh sản phẩm</h4>
              <ImageIcon className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-4 space-y-4">
              <div className="aspect-square rounded bg-slate-50 border border-slate-100 overflow-hidden group">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImg]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={product?.name}
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
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(idx)}
                      className={`
                        w-16 h-16 rounded border-2 flex-shrink-0 overflow-hidden transition-all
                        ${selectedImg === idx ? 'border-emerald-500 scale-95' : 'border-slate-100 hover:border-slate-200'}
                      `}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Chính sách giá */}
          <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
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
                        <td className="px-6 py-4 text-slate-700 font-bold">Từ {tier.fromQuantity} {product?.unit}</td>
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
          <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông số kỹ thuật</h4>
              <Layers className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-0">
              {product?.attributes && product.attributes.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-50">
                    {product.attributes.map((attr: any, idx: number) => (
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
          <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mô tả chi tiết</h4>
              <BookOpen className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-6 min-h-[200px]">
              <NotionEditor
                content={product?.showcase || ''}
                editable={false}
              />
              {!product?.showcase && (
                <div className="flex flex-col items-center justify-center text-slate-300 py-10">
                  <p className="text-xs font-bold uppercase tracking-widest italic text-slate-400">Chưa có nội dung mô tả</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={statusConfirm.isOpen}
        onOpenChange={(open) => setStatusConfirm({ ...statusConfirm, isOpen: open })}
        title={product?.status === ProductStatus.ACTIVE ? "Xác nhận ngừng kinh doanh" : "Xác nhận kích hoạt"}
        description={product?.status === ProductStatus.ACTIVE
          ? `Bạn có chắc chắn muốn ngừng kinh doanh sản phẩm "${product?.name}"?`
          : `Bạn có muốn kích hoạt lại sản phẩm "${product?.name}"?`}
        onConfirm={handleToggleStatus}
        confirmText="Xác nhận"
        type={product?.status === ProductStatus.ACTIVE ? "warning" : "question"}
        loading={statusConfirm.loading}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, isOpen: open })}
        title="Xác nhận xóa hàng hóa"
        description={`Bạn có chắc chắn muốn xóa sản phẩm "${product?.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        confirmText="Xác nhận xóa"
        type="danger"
        loading={deleteConfirm.loading}
      />
    </div>
  );
}
