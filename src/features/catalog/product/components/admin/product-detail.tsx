'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ActionType } from '@/shared/constants/action-type';
import { Layers, Image as ImageIcon, DollarSign, ArrowLeft, Edit, Trash2, Save, X, BookOpen } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import Link from 'next/link';
import { mockProductById } from '@/features/catalog/product/mocks/mock-product';
import { ProductStatus } from '@/features/catalog/product/models/product-status';
import { NotionEditor } from '@/shared/components/notion-editor';

interface ProductDetailProps {
  id: string;
}

const statusColor: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'bg-green-50 text-green-700 border-green-200',
  [ProductStatus.DISCONTINUED]: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabel: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'Đang hoạt động',
  [ProductStatus.DISCONTINUED]: 'Ngừng kinh doanh',
};

export function ProductDetail({ id }: ProductDetailProps) {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');
  
  const isCreate = actionParam === ActionType.CREATE;
  
  const initialProduct = isCreate ? {
    id: '', code: '', name: '', manufacture: '', status: ProductStatus.ACTIVE,
    category: { id: '', code: '', name: '' },
    unit: { id: '', code: '', name: '' },
    priceList: { tiers: [] },
    attributes: [],
    images: []
  } : mockProductById(id);

  const [action, setAction] = useState<ActionType>(
    (actionParam as ActionType) || ActionType.DETAIL
  );

  const [formData, setFormData] = useState<any>(initialProduct || {});
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    if (!isCreate) {
      if (actionParam === ActionType.UPDATE) setAction(ActionType.UPDATE);
      else setAction(ActionType.DETAIL);
    }
  }, [actionParam, isCreate]);

  if (!isCreate && !initialProduct) return <div className="p-6 text-gray-600">Không tìm thấy hàng hóa</div>;

  const isEditing = action === ActionType.CREATE || action === ActionType.UPDATE;
  const images = formData.images ?? [];

  const handleSave = () => {
    // Logic lưu
    console.log("Nội dung markdown");
    console.log(formData.usageGuide);
    
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
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold admin-title uppercase">
            {action === ActionType.CREATE ? 'Tạo mới' : action === ActionType.UPDATE ? 'Chỉnh sửa' : 'Chi tiết'} hàng hóa
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
          <>
            <Button variant="outline" className="rounded admin-btn-primary border-transparent" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Lưu
            </Button>
            <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
          </>
        ) : (
          <Button variant="outline" className="rounded text-gray-700 hover:bg-gray-50" onClick={() => setAction(ActionType.UPDATE)}>
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
          {/* thông tin cơ bản sản phẩm */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Thông tin cơ bản</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Tên sản phẩm</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.name || ''} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                        placeholder="Nhập tên hàng hóa"
                      />
                    ) : (
                      <span className="text-gray-900 font-medium">{formData.name}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Mã sản phẩm (SKU)</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.code || ''} 
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                        placeholder="VD: SP001"
                      />
                    ) : (
                      <span className="text-gray-900 font-medium">{formData.code}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Nhà sản xuất</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.manufacture || ''} 
                        onChange={(e) => setFormData({ ...formData, manufacture: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                        placeholder="Tên nhà sản xuất"
                      />
                    ) : (
                      <span className="text-gray-900 font-medium">{formData.manufacture || '--'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Danh mục</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.category?.name || ''} 
                        onChange={(e) => setFormData({ ...formData, category: { ...formData.category, name: e.target.value } })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                        placeholder="Danh mục"
                      />
                    ) : (
                      <span className="text-gray-900 font-medium">{formData.category?.name || '--'}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Trạng thái</td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <select
                        value={formData.status || ProductStatus.ACTIVE}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[var(--brand-green-500)] focus:ring-1 focus:ring-[var(--brand-green-500)]"
                      >
                        <option value={ProductStatus.ACTIVE}>{statusLabel[ProductStatus.ACTIVE]}</option>
                        <option value={ProductStatus.DISCONTINUED}>{statusLabel[ProductStatus.DISCONTINUED]}</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded border text-xs font-medium ${statusColor[formData.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {statusLabel[formData.status] || formData.status}
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ảnh của sản phẩm */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Hình ảnh sản phẩm</h4>
              {images.length > 0 && (
                <span className="ml-auto text-xs text-gray-400">{images.length} ảnh</span>
              )}
            </div>
            {images.length > 0 ? (
              <div className="p-4 space-y-3">

                <div className="w-full aspect-square rounded border border-gray-100 overflow-hidden bg-gray-50 flex justify-center items-center">
                  {images.length > 0 && images[selectedImg] ? (
                    <img
                      src={images[selectedImg].imageUrl}
                      alt={`${formData.name} - ảnh ${selectedImg + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-200" />
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {images.map((img: any, idx: number) => (
                      <button
                        key={img.id || idx}
                        onClick={() => setSelectedImg(idx)}
                        className={`w-14 h-14 rounded border-2 overflow-hidden transition-all ${
                          selectedImg === idx
                            ? 'border-[var(--brand-green-500)]'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img src={img.imageUrl} alt={`thumb-${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <ImageIcon className="w-8 h-8 text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">Chưa có hình ảnh.</p>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-2 rounded admin-btn-primary border-transparent">
                    + Thêm ảnh
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* bảng giá */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <h4 className="text-base font-medium text-gray-900">Bảng giá tham khảo</h4>
            </div>
            <div className="p-6">
              {formData.priceList?.tiers && formData.priceList.tiers.length > 0 ? (
                <div className="overflow-x-auto rounded border border-gray-100">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Số lượng tối thiểu</th>
                        <th className="px-4 py-3 font-medium">Giá bán</th>
                        <th className="px-4 py-3 font-medium">Giá tối thiểu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formData.priceList.tiers.map((tier: any) => (
                        <tr key={tier.id}>
                          <td className="px-4 py-3 text-gray-900">{tier.quantity}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tier.defaultPrice)}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tier.minPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                   <p className="text-sm text-gray-500 mb-4">Chưa có thông tin bảng giá.</p>
                   {isEditing && (
                     <Button variant="outline" size="sm" className="rounded admin-btn-primary border-transparent">
                       + Thêm bậc giá
                     </Button>
                   )}
                </div>
              )}
            </div>
          </div>

          {/* thuộc tính mở rộng của sản phẩm */}
          <div className="border border-gray-200 bg-white rounded">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-400" />
              <h4 className="text-base font-medium text-gray-900">Thuộc tính mở rộng</h4>
            </div>
            <div className="p-0">
              {formData.attributes && formData.attributes.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {formData.attributes.map((attr: any) => (
                      <tr key={attr.id}>
                        <td className="px-6 py-3 w-1/3 admin-text-primary font-semibold">{attr.name}</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{attr.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-500 mb-4">Sản phẩm này không có thuộc tính phụ.</p>
                  {isEditing && (
                     <Button variant="outline" size="sm" className="rounded admin-btn-primary border-transparent">
                       + Thêm thuộc tính
                     </Button>
                   )}
                </div>
              )}
            </div>
          </div>

          {/* Hướng dẫn sử dụng */}
          <div className="border border-gray-200 bg-white rounded overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-white">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <h4 className="text-base font-medium text-gray-900">Hướng dẫn sử dụng</h4>
            </div>
            <div className={isEditing ? "p-0" : "p-6"}>
              <NotionEditor 
                content={formData.usageGuide || ''} 
                onChange={(content) => setFormData({ ...formData, usageGuide: content })}
                editable={isEditing}
              />
              {!isEditing && !formData.usageGuide && (
                <p className="text-sm text-gray-500 italic">Chưa có hướng dẫn sử dụng cho sản phẩm này.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
