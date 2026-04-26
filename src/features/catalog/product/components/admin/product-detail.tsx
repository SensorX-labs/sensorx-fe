'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ActionType } from '@/shared/constants/action-type';
import {
  Layers,
  Image as ImageIcon,
  DollarSign,
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  BookOpen
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import Link from 'next/link';
import { MOCK_INTERNAL_PRICES } from '../../mocks/internal-price-mocks';
import { ProductStatus } from '../../enums/product-status';
import { NotionEditor } from '@/shared/components/notion-editor';
import { ProductService } from '../../services/product-service';
import { ProductDetail as ProductDetailModel } from '../../models';
import { toast } from 'sonner';

interface ProductDetailProps {
  id: string;
}

const statusColor: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'bg-green-50 text-green-700 border-green-200',
  [ProductStatus.INACTIVE]: 'bg-gray-50 text-gray-700 border-gray-200'
};

const statusLabel: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'Đang hoạt động',
  [ProductStatus.INACTIVE]: 'Tạm ngưng'
};

export function ProductDetail({ id }: ProductDetailProps) {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');

  const [action, setAction] = useState<ActionType>((actionParam as ActionType) || ActionType.DETAIL);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(id !== 'new');
  const [initialProduct, setInitialProduct] = useState<any>(null);

  const isCreate = action === ActionType.CREATE || id === 'new';

  useEffect(() => {
    const fetchProduct = async () => {
      if (id === 'new') {
        const newProduct = {
          productAttributes: [],
          productImages: [],
          productShowcases: []
        };
        setFormData(newProduct);
        setInitialProduct(newProduct);
        setLoading(false);
        return;
      }

      try {
        const response = await ProductService.getDetail(id);
        if (response.isSuccess && response.value) {
          const data = {
            ...response.value,
            productAttributes: response.value.attributes || [],
            productImages: response.value.images?.map(url => ({ imageUrl: url })) || [],
            productShowcases: response.value.showcase ? [response.value.showcase] : []
          };
          setFormData(data);
          setInitialProduct(data);
        }
      } catch (error) {
        console.error(">>> Lỗi khi lấy chi tiết sản phẩm:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const [selectedImg, setSelectedImg] = useState(0);

  // Lấy dữ liệu giá mẫu cho sản phẩm này
  const internalPrice = MOCK_INTERNAL_PRICES.find(ip => ip.productId === (formData.code || formData.id));

  useEffect(() => {
    if (!isCreate) {
      if (actionParam === ActionType.UPDATE)
        setAction(ActionType.UPDATE);
      else
        setAction(ActionType.DETAIL);
    }
  }, [actionParam, isCreate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-medium">Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  if (!isCreate && !initialProduct)
    return <div className="p-6 text-gray-600">Không tìm thấy hàng hóa</div>;

  const isEditing = action === ActionType.CREATE || action === ActionType.UPDATE;
  const images = formData.productImages ?? [];

  const handleSave = () => {
    console.log("Saving product data:", formData);
    setAction(ActionType.DETAIL);
  };

  const handleCancel = () => {
    if (action === ActionType.CREATE) {
      // logic redirect
    } else {
      setFormData(initialProduct);
      setAction(ActionType.DETAIL);
    }
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold admin-title uppercase">
            {action === ActionType.CREATE ? 'Tạo mới' : action === ActionType.UPDATE ? 'Chỉnh sửa' : 'Chi tiết'} hàng hóa
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-brand-green hover:bg-brand-green-hover text-white rounded shadow-lg shadow-brand-green/20">
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </Button>
              <Button variant="outline" className="rounded text-gray-700" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </>
          ) : (
            <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-100" onClick={() => setAction(ActionType.UPDATE)}>
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}

          {action === ActionType.DETAIL && (
            <Button variant="outline" className="rounded text-red-600 hover:bg-red-50 border-red-200">
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          )}

          <Link href="/catalog/products">
            <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/30">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700">Thông tin cơ bản</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 admin-text-primary w-2/5 font-semibold">Tên sản phẩm</td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                        placeholder="Nhập tên hàng hóa"
                      />
                    ) : (
                      <span className="text-gray-900 font-medium">{formData.name}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 admin-text-primary font-semibold">Mã hàng (SKU)</td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                        placeholder="VD: SP001"
                      />
                    ) : (
                      <span className="text-gray-900 font-medium tracking-wider">{formData.code || '--'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 admin-text-primary font-semibold">Nhà sản xuất</td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.manufacture || ''}
                        onChange={(e) => setFormData({ ...formData, manufacture: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                        placeholder="Tên nhà sản xuất"
                      />
                    ) : (
                      <span className="text-gray-900 font-medium italic">{formData.manufacture || '--'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 admin-text-primary font-semibold">Danh mục</td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.category?.name || ''}
                        onChange={(e) => setFormData({ ...formData, category: { ...formData.category, name: e.target.value } })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                        placeholder="Danh mục"
                      />
                    ) : (
                      <span className="text-gray-900 font-medium">{formData.category?.name || '--'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 admin-text-primary font-semibold">Đơn vị tính</td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.unit || ''}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                        placeholder="VD: Cái, Bộ, Mét..."
                      />
                    ) : (
                      <span className="text-gray-900 font-medium">{formData.unit || '--'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 admin-text-primary font-semibold">Trạng thái</td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <select
                        value={formData.status || ProductStatus.ACTIVE}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                      >
                        <option value={ProductStatus.ACTIVE}>{statusLabel[ProductStatus.ACTIVE]}</option>
                        <option value={ProductStatus.INACTIVE}>{statusLabel[ProductStatus.INACTIVE]}</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColor[formData.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {statusLabel[formData.status] || formData.status}
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Hình ảnh sản phẩm */}
          <div className="border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50/30">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700">Hình ảnh</h4>
              {images.length > 0 && (
                <span className="ml-auto text-xs text-gray-400 font-medium">{images.length} ảnh</span>
              )}
            </div>
            {images.length > 0 ? (
              <div className="p-4 space-y-3">
                <div className="w-full aspect-square rounded border border-gray-100 overflow-hidden bg-gray-50 flex justify-center items-center shadow-inner">
                  {images[selectedImg] ? (
                    <img
                      src={images[selectedImg].imageUrl}
                      alt={`${formData.name} - ảnh ${selectedImg + 1}`}
                      className="w-full h-full object-cover transition-all hover:scale-105"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-200" />
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 flex-wrap justify-center">
                    {images.map((img: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImg(idx)}
                        className={`w-12 h-12 rounded border-2 overflow-hidden transition-all ${selectedImg === idx
                          ? 'border-brand-green ring-2 ring-brand-green/20'
                          : 'border-gray-100 hover:border-gray-300'
                          }`}
                      >
                        <img src={img.imageUrl} alt={`thumb-${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <ImageIcon className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-xs text-gray-400">Chưa có hình ảnh hàng hóa.</p>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-4 rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-wider border-gray-200 hover:bg-brand-green/5 hover:text-brand-green hover:border-brand-green transition-all">
                    + Thêm ảnh
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Bảng giá tham khảo */}
          <div className="border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50/30">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700">Chính sách giá bán</h4>
              {internalPrice && (
                <div className="ml-auto flex gap-4 text-xs">
                  <span className="text-gray-400">Giá sàn: <span className="text-red-500 font-bold">{internalPrice.floorPrice.toLocaleString('vi-VN')} đ</span></span>
                  <span className="text-gray-400">Gợi ý: <span className="text-brand-green font-bold">{internalPrice.suggestedPrice.toLocaleString('vi-VN')} đ</span></span>
                </div>
              )}
            </div>
            <div className="p-0">
              {internalPrice && internalPrice.priceTiers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-500 border-b border-gray-100 uppercase">
                        <th className="px-6 py-3 font-bold text-xs tracking-wider">Số lượng tối thiểu</th>
                        <th className="px-6 py-3 font-bold text-xs tracking-wider text-right">Giá áp dụng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {internalPrice.priceTiers.map((tier: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-6 py-4 text-gray-900 font-medium">Từ {tier.fromQuantity} {formData.unit || 'Cái'}</td>
                          <td className="px-6 py-4 text-right font-bold text-brand-green">
                            {tier.price.toLocaleString('vi-VN')} <span className="text-[10px] font-normal text-gray-400 uppercase">VNĐ</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center">
                  <p className="text-sm text-gray-400 mb-4 italic">Chưa có thông tin bậc giá cho mặt hàng này.</p>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-wider border-gray-200 hover:bg-brand-green/5">
                      + Thêm bậc giá
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Thuộc tính mở rộng */}
          <div className="border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50/30">
              <Layers className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700">Thông số kỹ thuật</h4>
            </div>
            <div className="p-0">
              {formData.productAttributes && formData.productAttributes.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {formData.productAttributes.map((attr: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50/30">
                        <td className="px-6 py-3 w-1/3 admin-text-primary font-bold bg-gray-50/20">{attr.name}</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{attr.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-400 italic">Không có thuộc tính mở rộng.</p>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="mt-4 rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-wider border-gray-200">
                      + Thêm thuộc tính
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Hướng dẫn sử dụng / Mô tả */}
          <div className="border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50/30">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700">Mô tả sản phẩm</h4>
            </div>
            <div className={isEditing ? "p-0" : "p-6"}>
              <NotionEditor
                content={formData.productShowcases?.[0]?.body || ''}
                onChange={(content) => {
                  const newShowcases = [...(formData.productShowcases || [])];
                  if (newShowcases[0]) {
                    newShowcases[0].body = content;
                  } else {
                    newShowcases.push({ summary: '', body: content });
                  }
                  setFormData({ ...formData, productShowcases: newShowcases });
                }}
                editable={isEditing}
              />
              {!isEditing && (!formData.productShowcases || formData.productShowcases.length === 0) && (
                <p className="text-sm text-gray-400 italic">Chưa có thông tin mô tả chi tiết.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
