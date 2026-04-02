'use client';

import React, { useState } from 'react';
import { Layers, Image as ImageIcon, DollarSign, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import Link from 'next/link';
import { mockProductById } from '@/features/catalog/product/mocks/mock-product';
import { ProductStatus } from '@/features/catalog/product/models/product-status';

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
  const product = mockProductById(id);
  const [selectedImg, setSelectedImg] = useState(0);

  if (!product) return <div className="p-6 text-gray-600">Không tìm thấy hàng hóa</div>;

  const images = product.images ?? [];

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" className="rounded text-gray-700">
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
        <Button variant="outline" className="rounded text-red-600 hover:bg-red-50 border-red-200">
          <Trash2 className="w-4 h-4 mr-2" />
          Xóa
        </Button>
        <Link href="/catalog/products">
          <Button variant="outline" className="rounded text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
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
                  <td className="px-6 py-3 admin-text-primary w-2/5">Tên sản phẩm</td>
                  <td className="px-6 py-3 text-gray-900 font-medium">{product.name}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary">Mã sản phẩm</td>
                  <td className="px-6 py-3 text-gray-900 font-medium">{product.code}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary">Nhà sản xuất</td>
                  <td className="px-6 py-3 text-gray-900 font-medium">{product.manufacture || '--'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary">Danh mục</td>
                  <td className="px-6 py-3 text-gray-900 font-medium">{product.category?.name || '--'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary">Đơn vị tính</td>
                  <td className="px-6 py-3 text-gray-900 font-medium">{product.unit?.name || '--'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary">Trạng thái</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-0.5 rounded border text-xs font-medium ${statusColor[product.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {statusLabel[product.status] || product.status}
                    </span>
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

                <div className="w-full rounded border border-gray-100 overflow-hidden bg-gray-50">
                  <img
                    src={images[selectedImg].imageUrl}
                    alt={`${product.name} - ảnh ${selectedImg + 1}`}
                    className="w-full object-cover"
                  />
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImg(idx)}
                        className={`w-14 h-14 rounded border-2 overflow-hidden transition-all ${
                          selectedImg === idx
                            ? 'border-gray-800'
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
              {product.priceList?.tiers && product.priceList.tiers.length > 0 ? (
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
                      {product.priceList.tiers.map((tier) => (
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
                <p className="text-sm text-gray-500 text-center py-4">Chưa có thông tin bảng giá.</p>
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
              {product.attributes && product.attributes.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {product.attributes.map((attr) => (
                      <tr key={attr.id}>
                        <td className="px-6 py-3 w-1/3 admin-text-primary">{attr.name}</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{attr.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6">
                  <p className="text-sm text-gray-500 text-center py-4">Sản phẩm này không có thuộc tính phụ.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
