'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  XCircle,
  Layers
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { ProductService } from '../../services/product-service';
import { ProductPageList, ProductStats } from '../../models';
import { ProductStatus } from '../../enums/product-status';
import { toast } from 'sonner';

const statusColor: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'bg-green-50 text-green-700 border-green-200',
  [ProductStatus.INACTIVE]: 'bg-gray-50 text-gray-700 border-gray-200'
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
  const [products, setProducts] = useState<ProductPageList[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Lấy thống kê
      const statsRes = await ProductService.getStats();
      if (statsRes.isSuccess && statsRes.value) {
        setStats(statsRes.value);
      }

      // 2. Lấy danh sách sản phẩm
      const listRes = await ProductService.getProducts({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        searchTerm: searchTerm || undefined,
      });

      if (listRes.isSuccess && listRes.value) {
        setProducts(listRes.value.items);
        setTotalItems(listRes.value.totalCount);
      }
    } catch (error) {
      console.error(">>> Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-blue-50 flex items-center justify-center text-blue-500">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tổng hàng hóa</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{stats?.totalCount ?? 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-green-50 flex items-center justify-center text-green-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Đang hoạt động</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{stats?.activeCount ?? 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-gray-50 flex items-center justify-center text-gray-400">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tạm ngưng</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{stats?.inactiveCount ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Link
          href="/catalog/products/new?action=create"
          className="admin-btn-primary flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          Tạo hàng hóa
        </Link>
      </div>

      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin"></div>
          </div>
        )}

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center p-4 border-b border-gray-50">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm SKU, tên hàng hóa, nhà sản xuất..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-brand-green/20 text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-brand-green/20 text-sm bg-white text-gray-600"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value={ProductStatus.ACTIVE}>Đang hoạt động</option>
              <option value={ProductStatus.INACTIVE}>Tạm ngưng</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left px-6 py-4 tracking-label uppercase w-24">SKU</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Tên hàng hóa</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Nhà sản xuất</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Phân loại</th>
                <th className="text-left px-6 py-4 tracking-label uppercase">Trạng thái</th>
                <th className="text-center px-6 py-4 tracking-label uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length > 0 ? products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-900 tracking-wider">
                    {p.code || '--'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                        {p.images && p.images.length > 0 ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-gray-900 group-hover:text-brand-green transition-colors">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 italic">
                    {p.manufacture || '--'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                      {p.categoryName || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColor[p.status as ProductStatus] ?? 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                      {statusLabel[p.status as ProductStatus] || p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Xem chi tiết"
                        onClick={() => router.push(`/catalog/products/${p.id}?action=detail`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded"
                        title="Chỉnh sửa"
                        onClick={() => router.push(`/catalog/products/${p.id}?action=update`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <span className="text-xs text-gray-500 font-medium">
              Hiển thị <span className="text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="text-gray-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> trong tổng số <span className="text-gray-900">{totalItems}</span> sản phẩm
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 rounded border-gray-200"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500" />
              </Button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = currentPage === pageNum;
                // Chỉ hiển thị giới hạn các trang nếu quá nhiều
                if (totalPages > 7 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                  if (Math.abs(pageNum - currentPage) === 3) return <span key={pageNum} className="px-1 text-gray-300">...</span>;
                  return null;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 rounded text-xs ${isActive ? "bg-brand-green text-white border-brand-green" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}
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
                className="h-8 w-8 p-0 rounded border-gray-200"
              >
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
