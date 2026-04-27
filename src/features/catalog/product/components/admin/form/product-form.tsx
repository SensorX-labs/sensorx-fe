'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CategorySelectionDialog } from '@/shared/components/admin/selection-modal';
import ProductService from '../../../services/product-service';
import imageService from '@/shared/services/image-service';

// Import sub-components
import {
  ProductFormHeader,
  ProductInfoSection,
  ProductImageSection,
  ProductAttributeSection,
  ProductShowcaseSection
} from './sections';
import { ProductDetail } from '../../../models';
import { ProductStatus } from '../../../enums/product-status';

interface ProductFormProps {
  product?: ProductDetail;
  mode: 'create' | 'update';
  onBack: () => void;
}

export function ProductForm({ product: initialProduct, mode, onBack }: ProductFormProps) {
  const [loading, setLoading] = useState(mode === 'update');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const [formData, setFormData] = useState<ProductDetail>({
    id: '',
    code: '',
    name: '',
    manufacture: '',
    categoryId: null,
    categoryName: '',
    unit: '',
    images: [],
    attributes: [],
    showcase: '',
    status: ProductStatus.ACTIVE,
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    if (mode === 'update' && initialProduct?.id) {
      const fetchProduct = async () => {
        setLoading(true);
        const res = await ProductService.getDetail(initialProduct.id);
        if (res.isSuccess && res.value) {
          setFormData(res.value);
        }
        setLoading(false);
      };
      fetchProduct();
    }
  }, [mode, initialProduct]);

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Vui lòng nhập tên hàng hóa");
      return;
    }

    try {
      setIsSaving(true);
      const command = {
        ...formData,
        categoryId: formData.categoryId,
        unit: formData.unit || '',
        showcase: formData.showcase || '',
        images: formData.images || [],
        attributes: formData.attributes || []
      };

      const res = mode === 'create'
        ? await ProductService.create(command)
        : await ProductService.update(initialProduct?.id || '', command);

      if (res.isSuccess) {
        toast.success(mode === 'create' ? "Tạo hàng hóa thành công" : "Cập nhật hàng hóa thành công");
        onBack();
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi lưu dữ liệu");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper handlers for complex fields
  const handleUploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      const res = await imageService.upload(file, 'products');

      if (res.isSuccess && res.value) {
        setFormData({
          ...formData,
          images: [...(formData.images || []), res.value]
        });

        toast.success("Tải ảnh lên thành công");
      }
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const image = formData.images[index];
    if (!image) return;
    try {
      await imageService.deleteImage(image);
      const newImages = [...(formData.images || [])];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
    } catch (error) {
      toast.error("Lỗi khi xóa ảnh");
    }
  };

  const handleAddAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...(formData.attributes || []), { name: '', value: '' }]
    });
  };

  const handleRemoveAttribute = (index: number) => {
    const newAttrs = [...(formData.attributes || [])];
    newAttrs.splice(index, 1);
    setFormData({ ...formData, attributes: newAttrs });
  };

  const handleAttributeChange = (index: number, field: 'name' | 'value', value: string) => {
    const newAttrs = [...(formData.attributes || [])];
    newAttrs[index] = { ...newAttrs[index], [field]: value };
    setFormData({ ...formData, attributes: newAttrs });
  };

  const handleShowcaseChange = (content: string) => {
    setFormData({ ...formData, showcase: content });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Đang khởi tạo form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <ProductFormHeader
        mode={mode}
        formData={formData}
        isSaving={isSaving}
        onBack={onBack}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <ProductInfoSection
            formData={formData}
            setFormData={setFormData}
            onOpenCategoryDialog={() => setIsCategoryDialogOpen(true)}
          />

          <ProductImageSection
            imageUrls={formData.images || []}
            onRemoveImage={handleRemoveImage}
            onUploadImage={handleUploadImage}
            isUploading={isUploading}
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <ProductAttributeSection
            attributes={formData.attributes || []}
            onAddAttribute={handleAddAttribute}
            onRemoveAttribute={handleRemoveAttribute}
            onAttributeChange={handleAttributeChange}
          />

          <ProductShowcaseSection
            content={formData.showcase || ''}
            onChange={handleShowcaseChange}
          />
        </div>
      </div>

      <CategorySelectionDialog
        isOpen={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSelect={(category) => {
          setFormData({
            ...formData,
            categoryId: category.id,
            categoryName: category.name
          });
        }}
      />
    </div>
  );
}
