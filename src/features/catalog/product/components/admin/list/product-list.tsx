'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { StatCards } from './product-stats';
import { ProductTable } from './product-table';
import { ProductPageList, ProductStats } from '../../../models';
import { ProductService } from '../../../services/product-service';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import {
  AdminPageContainer,
  AdminContentCard,
  AdminHeaderBar
} from '@/shared/components/admin/layout';
import { toast } from 'sonner';
import { ProductStatus } from '../../../enums/product-status';

interface ProductListProps {
  onViewDetail: (product: ProductPageList) => void;
  onCreate: () => void;
  onEdit: (product: ProductPageList) => void;
}

export function ProductList({ onViewDetail, onCreate, onEdit }: ProductListProps) {
  const [products, setProducts] = useState<ProductPageList[]>([]);
  const [stats, setStats] = useState<ProductStats | undefined>();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchStats = useCallback(async () => {
    const statsRes = await ProductService.getStats();
    if (statsRes.isSuccess && statsRes.value) {
      setStats(statsRes.value);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const listRes = await ProductService.getProducts({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        searchTerm: searchTerm || undefined,
        status: activeTab !== 'all' ? (activeTab === 'active' ? ProductStatus.ACTIVE : ProductStatus.INACTIVE) : undefined
      });

      if (listRes.isSuccess && listRes.value) {
        setProducts(listRes.value.items);
        setTotalItems(listRes.value.totalCount);
      }
    } catch (error) {
      console.error(">>> Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, activeTab]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <AdminPageContainer offsetBottom={40}>
      <div className="shrink-0">
        <StatCards stats={stats} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <AdminContentCard>
        <AdminHeaderBar>
          {/* Search Input (Left) */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm mã SKU, tên hàng hóa..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl text-sm text-slate-700 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>

          {/* Action Buttons (Right) */}
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={onCreate} size="sm" className="h-10 admin-btn-primary gap-2 shadow-lg shadow-emerald-500/20 font-black uppercase tracking-widest text-[10px]">
              <Plus className="w-4 h-4" />
              Tạo hàng hóa
            </Button>
          </div>
        </AdminHeaderBar>

        {/* Main Data Table */}
        <div className="relative overflow-x-auto flex-1 min-h-0 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <ProductTable
              products={products}
              onViewDetail={onViewDetail}
              onEdit={onEdit}
            />
          )}
        </div>

        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="py-3"
        />
      </AdminContentCard>
    </AdminPageContainer>
  );
}
