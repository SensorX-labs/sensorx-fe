import React from 'react';
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
import { Category } from '../../../models/category-model';
import { getAllDescendantIds } from './category-utils';

interface CategoryFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  submitting: boolean;
  editingId: string | null;
  formData: {
    name: string;
    description: string;
    parentId: string;
  };
  setFormData: (data: any) => void;
  allCategories: Category[];
  parentSearch: string;
  setParentSearch: (search: string) => void;
  isParentPopoverOpen: boolean;
  setIsParentPopoverOpen: (open: boolean) => void;
  onSubmit: () => void;
}

export function CategoryForm({
  isOpen,
  onOpenChange,
  submitting,
  editingId,
  formData,
  setFormData,
  allCategories,
  parentSearch,
  setParentSearch,
  isParentPopoverOpen,
  setIsParentPopoverOpen,
  onSubmit
}: CategoryFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="tracking-title text-xl">
            {editingId ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="tracking-label text-xs font-semibold uppercase text-gray-400">Tên danh mục</label>
            <Input
              placeholder="Nhập tên danh mục..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!!editingId}
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
                  className="w-full justify-between font-normal bg-gray-50/50 border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    {formData.parentId === 'root' ? (
                      <span className="text-gray-500">Không có (Danh mục gốc)</span>
                    ) : (
                      <span className="font-medium text-gray-900">{allCategories.find((c) => c.id === formData.parentId)?.name}</span>
                    )}
                  </div>
                  <ChevronRight className="ml-2 h-4 w-4 shrink-0 rotate-90 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[450px] p-0 shadow-2xl border-gray-200" align="start">
                <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center px-3 bg-white rounded-lg border border-gray-200 focus-within:border-blue-400 transition-colors">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
                      placeholder="Tìm kiếm danh mục..."
                      value={parentSearch}
                      onChange={(e) => setParentSearch(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()} // Chặn phím tắt modal
                    />
                  </div>
                </div>
                {/* Scrollable Area - Cố định chiều cao và cho phép cuộn */}
                <div 
                  className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar"
                  onWheel={(e) => e.stopPropagation()} // Đảm bảo scroll được trong Popover
                >
                  <button
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-lg mb-1 transition-all ${formData.parentId === 'root' ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => {
                      setFormData({ ...formData, parentId: 'root' });
                      setIsParentPopoverOpen(false);
                    }}
                  >
                    Không có (Danh mục gốc)
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2" />
                  {(() => {
                    const descendants = editingId ? getAllDescendantIds(allCategories, editingId) : [];
                    const filtered = allCategories.filter(c => {
                      const isSelf = c.id === editingId;
                      const isDescendant = descendants.includes(c.id);
                      const matchesSearch = c.name.toLowerCase().includes(parentSearch.toLowerCase());
                      return !isSelf && !isDescendant && matchesSearch;
                    });

                    return filtered.length > 0 ? (
                      filtered.map((c) => (
                        <button
                          key={c.id}
                          className={`w-full text-left px-4 py-2.5 text-sm rounded-lg mb-1 transition-all flex items-center justify-between ${formData.parentId === c.id ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
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
                    );
                  })()}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="tracking-label text-xs font-semibold uppercase text-gray-400">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả danh mục..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="focus-visible:ring-blue-500/20 min-h-[100px] border-gray-200"
            />
          </div>
        </div>
        <DialogFooter className="bg-gray-50/50 p-4 -mx-6 -mb-6 rounded-b-lg border-t border-gray-100">
          <Button variant="outline" className="rounded-lg text-sm font-semibold" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button
            className="admin-btn-primary rounded-lg"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting && <FolderTree className="w-4 h-4 mr-2 animate-spin" />}
            {editingId ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
