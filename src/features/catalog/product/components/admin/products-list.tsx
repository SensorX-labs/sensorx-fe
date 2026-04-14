'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';

import { MOCK_PRODUCTS } from '../../mocks/product-mocks';
import { MOCK_INTERNAL_PRICES } from '../../mocks/internal-price-mocks';
import { ProductStatus } from '../../enums/product-status';

const statusColor: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'bg-green-100 text-green-600',
  [ProductStatus.INACTIVE]: 'bg-gray-100 text-gray-400'
};

const statusLabel: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'Đang hoạt động',
  [ProductStatus.INACTIVE]: 'Tạm ngưng'
};

export function ProductList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = 
        (product.code?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (product.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (product.manufacturer?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredProducts, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getProductPrice = (productId: string, productCode?: string) => {
    const priceData = MOCK_INTERNAL_PRICES.find(p => p.productId === productId || p.productId === productCode);
    return priceData ? priceData.suggestedPrice.toLocaleString('vi-VN') + ' đ' : '--';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Link 
          href="/catalog/products/new?action=create" 
          className="admin-btn-primary flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          Tạo hàng hóa
        </Link>
      </div>

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm SKU, tên hàng hóa, nhà sản xuất..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white text-gray-600"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value={ProductStatus.ACTIVE}>Đang hoạt động</option>
              <option value={ProductStatus.INACTIVE}>Tạm ngưng</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left px-6 py-4 tracking-label uppercase">SKU</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Tên hàng hóa</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Nhà sản xuất</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Loại hàng</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Đơn giá gợi ý</th>
              <th className="text-left px-6 py-4 tracking-label uppercase">Trạng thái</th>
              <th className="text-center px-6 py-4 tracking-label uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">
                  {p.code || '--'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {p.productImages && p.productImages.length > 0 && (
                      <div className="w-8 h-8 rounded border border-gray-100 overflow-hidden hide-on-mobile">
                        <img src={p.productImages[0].imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="font-semibold text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700 italic">
                  {p.manufacturer || '--'}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {p.category?.name || '--'}
                </td>
                <td className="px-6 py-4 font-bold text-green-600">
                  {getProductPrice(p.id!, p.code)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[p.status]}`}>
                    {statusLabel[p.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => router.push(`/catalog/products/${p.id}?action=detail`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                      onClick={() => router.push(`/catalog/products/${p.id}?action=update`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <span className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
            </span>
            <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 rounded"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <Button
                      key={pageNum}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 p-0 rounded ${isActive ? "bg-[var(--admin-primary)] text-white" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                      onClick={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 rounded"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
