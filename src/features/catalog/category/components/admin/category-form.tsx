'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Search, ChevronRight, FolderTree } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/shared/components/shadcn-ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/shared/components/shadcn-ui/popover";
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import { Textarea } from '@/shared/components/shadcn-ui/textarea';
import { getAllDescendantIds } from './category-utils';
import { Category } from '../../models/category-model';
import CategoryService from '../../services/category-services';
import { toast } from 'sonner';

interface CategoryFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null; // null = Create, Category = Edit
  allCategories: Category[];
  onSuccess: () => void;
}

export function CategoryForm({
  isOpen,
  onOpenChange,
  category,
  allCategories,
  onSuccess
}: CategoryFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [parentSearch, setParentSearch] = useState('');
  const [isParentPopoverOpen, setIsParentPopoverOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: 'root'
  });

  // Populate form when category changes (Edit mode)
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        parentId: category.parentId || 'root'
      });
    } else {
      setFormData({ name: '', description: '', parentId: 'root' });
    }
    setParentSearch('');
  }, [category, isOpen]);

  const descendants = useMemo(
    () => (category ? getAllDescendantIds(allCategories, category.id) : []),
    [category, allCategories]
  );

  const filteredParents = useMemo(
    () => allCategories.filter(c => {
      const isSelf = c.id === category?.id;
      const isDescendant = descendants.includes(c.id);
      const matchesSearch = c.name.toLowerCase().includes(parentSearch.toLowerCase());
      return !isSelf && !isDescendant && matchesSearch;
    }),
    [allCategories, category, descendants, parentSearch]
  );

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    setSubmitting(true);
    try {
      if (category) {
        // Chế độ Sửa (Hiện tại server đang hỗ trợ updateParent)
        const response = await CategoryService.updateParent(category.id, {
          parentId: formData.parentId === 'root' ? undefined : formData.parentId
        });
        if (response.isSuccess) {
          toast.success(response.message || "Cập nhật danh mục thành công");
          onSuccess();
          onOpenChange(false);
        }
      } else {
        // Chế độ Tạo
        const response = await CategoryService.create({
          name: formData.name,
          description: formData.description,
          parentId: formData.parentId === 'root' ? undefined : formData.parentId
        });
        if (response.isSuccess) {
          toast.success(response.message || "Tạo danh mục thành công");
          onSuccess();
          onOpenChange(false);
        }
      }
    } catch (error: any) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle className="tracking-title text-xl">
            {category ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
          </DialogTitle>
          {category && (
            <p className="text-xs text-gray-400 mt-0.5">
              Tạo lúc: {new Date(category.createdAt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          )}
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="tracking-label text-xs font-semibold uppercase text-gray-400">Tên danh mục</label>
              <Input
                placeholder="Nhập tên danh mục..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!!category}
                className="focus-visible:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="tracking-label text-xs font-semibold uppercase text-gray-400">Danh mục cha</label>
              <Popover open={isParentPopoverOpen} onOpenChange={setIsParentPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal bg-white border-input hover:bg-white hover:border-blue-400 focus:border-blue-400 transition-colors text-left h-10"
                  >
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      {formData.parentId === 'root' ? (
                        <span className="text-muted-foreground">Không có (Danh mục gốc)</span>
                      ) : (
                        <span className="text-foreground">{allCategories.find((c) => c.id === formData.parentId)?.name}</span>
                      )}
                    </div>
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 rotate-90 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-0 shadow-2xl border-gray-200" align="start">
                  <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center px-3 bg-white rounded border border-gray-200 focus-within:border-blue-400 transition-colors">
                      <Search className="w-4 h-4 text-gray-400 mr-2" />
                      <input
                        className="flex h-10 w-full rounded bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
                        placeholder="Tìm kiếm danh mục..."
                        value={parentSearch}
                        onChange={(e) => setParentSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div
                    className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <button
                      className={`w-full text-left px-4 py-2.5 text-sm rounded mb-1 transition-all ${formData.parentId === 'root' ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
                      onClick={() => {
                        setFormData({ ...formData, parentId: 'root' });
                        setIsParentPopoverOpen(false);
                      }}
                    >
                      Không có (Danh mục gốc)
                    </button>
                    <div className="h-px bg-gray-100 my-1 mx-2" />
                    {filteredParents.length > 0 ? (
                      filteredParents.map((c) => (
                        <button
                          key={c.id}
                          className={`w-full text-left px-4 py-2.5 text-sm rounded mb-1 transition-all flex items-center justify-between ${formData.parentId === c.id ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
                          onClick={() => {
                            setFormData({ ...formData, parentId: c.id });
                            setIsParentPopoverOpen(false);
                          }}
                        >
                          <span className="truncate">{c.name}</span>
                          {c.parentName && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${formData.parentId === c.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {c.parentName}
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-xs text-gray-400 italic">
                        Không tìm thấy danh mục nào
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="tracking-label text-xs font-semibold uppercase text-gray-400">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả danh mục..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={!!category}
              className="focus-visible:ring-blue-500/20 min-h-[100px] border-gray-200"
            />
          </div>
        </div>
        <DialogFooter className="bg-gray-50/50 p-4 -mx-6 -mb-6 rounded-b-lg border-t border-gray-100">
          <Button variant="outline" className="rounded text-sm font-semibold" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button
            className="admin-btn-primary rounded"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting && <FolderTree className="w-4 h-4 mr-2 animate-spin" />}
            {category ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
