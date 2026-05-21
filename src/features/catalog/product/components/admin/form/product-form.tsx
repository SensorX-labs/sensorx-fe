'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CategorySelectionDialog } from '@/shared/components/admin/selection-modal';
import ProductService from '../../../services/product-service';
import SupplierService from '@/features/catalog/supplier/services/supplier-services';
import UnitOfQuantityService from '@/features/catalog/unit-of-quantity/services/unit-of-quantity-services';

import {
  ProductFormHeader,
  ProductInfoSection,
  ProductImageSection,
  ProductAttributeSection,
  ProductShowcaseSection
} from './sections';
import { ProductDetail } from '../../../models';
import { ProductStatus } from '../../../enums/product-status';
import imageService from '@/shared/services/image.service';
import { Supplier } from '@/features/catalog/supplier/models';
import { UnitOfQuantity } from '@/features/catalog/unit-of-quantity/models';

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
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [units, setUnits] = useState<UnitOfQuantity[]>([]);

  const [formData, setFormData] = useState<ProductDetail>({
    id: '',
    code: '',
    name: '',
    supplierId: null,
    supplierName: '',
    categoryId: null,
    categoryName: '',
    unitOfQuantityId: null,
    unitOfQuantityName: '',
    images: [],
    attributes: [],
    showcase: '',
    status: ProductStatus.ACTIVE,
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    const loadOptions = async () => {
      const [supplierResult, unitResult] = await Promise.all([
        SupplierService.getAll(),
        UnitOfQuantityService.getAll()
      ]);

      setSuppliers(supplierResult || []);
      setUnits(unitResult || []);
    };

    loadOptions();
  }, []);

  useEffect(() => {
    if (mode === 'update' && initialProduct?.id) {
      const fetchProduct = async () => {
        setLoading(true);
        const res = await ProductService.getDetail(initialProduct.id);
        if (res) {
          setFormData(res);
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
    if (!formData.supplierId) {
      toast.error("Vui lòng chọn nhà cung cấp");
      return;
    }
    if (!formData.unitOfQuantityId) {
      toast.error("Vui lòng chọn đơn vị tính");
      return;
    }

    try {
      setIsSaving(true);
      const command = {
        name: formData.name,
        supplierId: formData.supplierId,
        categoryId: formData.categoryId,
        unitOfQuantityId: formData.unitOfQuantityId,
        showcase: formData.showcase || '',
        images: formData.images || [],
        attributes: formData.attributes || []
      };

      if (mode === 'create') {
        await ProductService.create(command);
      } else {
        await ProductService.update(initialProduct?.id || '', command);
      }

      onBack();
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      const res = await imageService.upload(file, 'products');

      if (res) {
        setFormData({
          ...formData,
          images: [...(formData.images || []), res]
        });
      }
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
    } catch {
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
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1 space-y-6">
          <ProductInfoSection
            formData={formData}
            setFormData={setFormData}
            onOpenCategoryDialog={() => setIsCategoryDialogOpen(true)}
            suppliers={suppliers}
            units={units}
          />

          <ProductImageSection
            imageUrls={formData.images || []}
            onRemoveImage={handleRemoveImage}
            onUploadImage={handleUploadImage}
            isUploading={isUploading}
          />

          <ProductAttributeSection
            attributes={formData.attributes || []}
            onAddAttribute={handleAddAttribute}
            onRemoveAttribute={handleRemoveAttribute}
            onAttributeChange={handleAttributeChange}
          />
        </div>

        <div className="lg:col-span-2 relative min-h-[600px]">
          <div className="lg:absolute lg:inset-0">
            <ProductShowcaseSection
              content={formData.showcase || ''}
              onChange={handleShowcaseChange}
              className="h-full"
            />
          </div>
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
