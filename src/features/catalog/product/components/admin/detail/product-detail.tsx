'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  BookOpen,
  LayoutDashboard
} from 'lucide-react';
import { ProductStatus } from '../../../enums/product-status';
import { ProductService } from '../../../services/product-service';
import { ConfirmDialog } from '@/shared/components/admin/confirm-dialog';
import { toast } from 'sonner';
import { GetPageProductDetailResponse } from '../../../models';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/shadcn-ui/tabs';

// Sub-components
import { ProductHeader } from './components/ProductHeader';
import { ProductInfoCard } from './components/ProductInfoCard';
import { ProductAttributesCard } from './components/ProductAttributesCard';
import { ProductImagesCard } from './components/ProductImagesCard';
import { ProductDescriptionCard } from './components/ProductDescriptionCard';
import { ProductPriceHistoryTab } from './components/ProductPriceHistoryTab';
import { ProductPriceSummaryCard } from './components/ProductPriceSummaryCard';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onEdit: (product: any) => void;
}

export function ProductDetailView({ productId, onBack, onEdit }: ProductDetailProps) {
  const [product, setProduct] = useState<GetPageProductDetailResponse>();
  const [loading, setLoading] = useState(true);

  // State for Confirm Dialogs
  const [statusConfirm, setStatusConfirm] = useState({ isOpen: false, loading: false });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, loading: false });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductService.getPageDetail(productId);
        if (response) {
          setProduct(response);
        }
      } catch (error) {
        console.error(">>> Error fetching product detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
      if (res) {
        setStatusConfirm({ isOpen: false, loading: false });
        onBack();
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setStatusConfirm({ ...statusConfirm, loading: false });
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    setDeleteConfirm({ ...deleteConfirm, loading: true });
    try {
      const res = await ProductService.deleteProduct(product.id);
      if (res) {
        onBack();
      }
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setDeleteConfirm({ isOpen: false, loading: false });
    }
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Bar */}
      <ProductHeader
        product={product}
        onBack={onBack}
        onEdit={onEdit}
        onToggleStatus={() => setStatusConfirm({ ...statusConfirm, isOpen: true })}
        onDelete={() => setDeleteConfirm({ ...deleteConfirm, isOpen: true })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Essential Info */}
        <div className="lg:col-span-1 space-y-6">
          <ProductInfoCard product={product} />
          <ProductAttributesCard attributes={product?.attributes} />
          <ProductImagesCard images={product?.images} productName={product?.name} />
        </div>

        {/* Right Column: Detailed Content with Tabs */}
        <div className="lg:col-span-2 relative min-h-[600px]">
          <div className="lg:absolute lg:inset-0 bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <Tabs defaultValue="details" className="w-full flex flex-col h-full">

              {/* Vùng chứa TabsList với border-bottom mờ để làm nền cho đường line của Tab */}
              <div className="px-8 bg-white border-b border-slate-100">
                <TabsList className="h-14 w-full bg-transparent p-0 flex gap-8 items-center justify-start">
                  <TabsTrigger
                    value="details"
                    className="
                      relative h-14 rounded-none border-b-2 border-transparent px-2 gap-2.5 
                      text-[13px] font-semibold uppercase tracking-wider text-slate-500 
                      hover:text-slate-800 hover:bg-slate-50/50
                      data-[state=active]:border-b-emerald-500 data-[state=active]:bg-transparent 
                      data-[state=active]:shadow-none data-[state=active]:text-emerald-600 
                      transition-all duration-200 -mb-[1px]
                    "
                  >
                    <BookOpen className="w-[18px] h-[18px]" />
                    Thông tin chi tiết
                  </TabsTrigger>

                  <TabsTrigger
                    value="price-history"
                    className="
                      relative h-14 rounded-none border-b-2 border-transparent px-2 gap-2.5 
                      text-[13px] font-semibold uppercase tracking-wider text-slate-500 
                      hover:text-slate-800 hover:bg-slate-50/50
                      data-[state=active]:border-b-emerald-500 data-[state=active]:bg-transparent 
                      data-[state=active]:shadow-none data-[state=active]:text-emerald-600 
                      transition-all duration-200 -mb-[1px]
                    "
                  >
                    <DollarSign className="w-[18px] h-[18px]" />
                    Lịch sử áp dụng giá
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Phần Content */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
                <TabsContent value="details" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-top-2 duration-500">
                  <ProductPriceSummaryCard price={product?.internalPricesSuggestion} unit={product?.unit} />
                  <ProductDescriptionCard showcase={product?.showcase} />
                </TabsContent>

                <TabsContent value="price-history" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-top-2 duration-500">
                  <ProductPriceHistoryTab
                    productId={productId}
                    currentPriceId={product?.internalPricesSuggestion?.id}
                    unit={product?.unit}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialogs */}
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
