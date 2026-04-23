'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FolderTree,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { toast } from "sonner";

// Sub-components
import { CategoryStats } from './category-stats';
import { CategoryTable } from './category-table';
import { CategoryTree, RootDropZone } from './category-tree';
import { CategoryForm } from './category-form';
import CategoryService from '../../../services/category-services';
import { Category } from '../../../models/category-model';
import { buildTree } from './category-utils';

export default function CategoryManagement() {
  // State cho dữ liệu
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');

  // State cho tìm kiếm và phân trang local
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // State cho search navigation trong Tree View
  const [matchingIds, setMatchingIds] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

  // State cho Modal Tạo/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [parentSearch, setParentSearch] = useState('');
  const [isParentPopoverOpen, setIsParentPopoverOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: 'root'
  });

  // Fetch dữ liệu
  const fetchData = useCallback(async () => {
    setLoading(false); // Đã có dữ liệu từ Checkpoint trước đó? Giả sử lấy thật
    setLoading(true);
    try {
      const response = await CategoryService.getAll();
      if (response.isSuccess && response.value) {
        setAllCategories(response.value);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error("Lỗi kết nối Server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter dữ liệu local cho Table View
  const filteredCategories = allCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination local logic
  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedItems = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm

    if (viewMode === 'tree' && searchTerm.trim()) {
      const matches = allCategories
        .filter(cat =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .map(cat => cat.id);
      setMatchingIds(matches);
      setCurrentMatchIndex(matches.length > 0 ? 0 : -1);
    } else {
      setMatchingIds([]);
      setCurrentMatchIndex(-1);
    }
  }, [searchTerm, viewMode, allCategories]);

  // Logic cuộn đến phần tử đang focus
  useEffect(() => {
    if (viewMode === 'tree' && currentMatchIndex !== -1 && matchingIds[currentMatchIndex]) {
      const targetId = matchingIds[currentMatchIndex];
      const element = document.getElementById(`tree-item-${targetId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentMatchIndex, matchingIds, viewMode]);

  const handleNextMatch = () => {
    if (matchingIds.length === 0) return;
    setCurrentMatchIndex(prev => (prev + 1) % matchingIds.length);
  };

  const handlePrevMatch = () => {
    if (matchingIds.length === 0) return;
    setCurrentMatchIndex(prev => (prev - 1 + matchingIds.length) % matchingIds.length);
  };

  // Xử lý Tạo/Sửa
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const response = await CategoryService.updateParent(editingId, {
          parentId: formData.parentId === 'root' ? undefined : formData.parentId
        });
        if (response.isSuccess) {
          toast.success(response.message || "Cập nhật danh mục thành công");
          setIsModalOpen(false);
          fetchData();
        } else {
          toast.error(response.message || "Không thể cập nhật danh mục");
        }
      } else {
        const response = await CategoryService.create({
          name: formData.name,
          description: formData.description,
          parentId: formData.parentId === 'root' ? undefined : formData.parentId
        });
        if (response.isSuccess) {
          toast.success(response.message || "Tạo danh mục thành công");
          setIsModalOpen(false);
          setFormData({ name: '', description: '', parentId: 'root' });
          fetchData();
        } else {
          toast.error(response.message || "Không thể tạo danh mục");
        }
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      const response = await CategoryService.delete(id);
      if (response.isSuccess) {
        toast.success(response.message || "Xóa danh mục thành công");
        fetchData();
      } else {
        toast.error(response.message || "Không thể xóa danh mục");
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error("Lỗi khi xóa danh mục");
    }
  };

  const openEditModal = (cat: Category) => {
    setEditingId(cat.id);
    setParentSearch('');
    setFormData({
      name: cat.name,
      description: cat.description || '',
      parentId: cat.parentId || 'root'
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setParentSearch('');
    setFormData({ name: '', description: '', parentId: 'root' });
    setIsModalOpen(true);
  };

  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    const activeItem = allCategories.find(c => c.id === active.id);
    if (!activeItem) return;

    if (over === null || over.id === 'root-drop-zone') {
      if (activeItem.parentId === null) return;
      if (confirm(`Bạn muốn đưa "${activeItem.name}" ra làm danh mục gốc?`)) {
        try {
          const res = await CategoryService.updateParent(activeItem.id, { parentId: undefined });
          if (res.isSuccess) {
            toast.success(res.message || "Đã chuyển thành danh mục gốc");
            fetchData();
          } else {
            toast.error(res.message || "Thất bại khi chuyển thành danh mục gốc");
          }
        } catch (error) {
          toast.error("Lỗi khi thay đổi vị trí");
        }
      }
      return;
    }

    if (active.id === over.id) return;
    const overItem = allCategories.find(c => c.id === over.id);

    if (overItem) {
      if (confirm(`Bạn muốn chuyển "${activeItem.name}" vào làm con của "${overItem.name}"?`)) {
        try {
          const res = await CategoryService.updateParent(activeItem.id, { parentId: overItem.id });
          if (res.isSuccess) {
            toast.success(res.message || "Đã thay đổi danh mục cha");
            fetchData();
          } else {
            toast.error(res.message || "Thất bại khi thay đổi danh mục cha");
          }
        } catch (error) {
          toast.error("Lỗi khi thay đổi vị trí");
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <CategoryStats categories={allCategories} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            className={`h-8 px-3 rounded-lg transition-all ${viewMode === 'table' ? 'admin-btn-primary shadow-sm' : 'hover:bg-gray-100 text-gray-600'}`}
            onClick={() => { setViewMode('table'); setCurrentPage(1); setSearchTerm(''); }}
          >
            <LayoutList className="w-4 h-4 mr-2" />
            Danh sách
          </Button>
          <Button
            variant={viewMode === 'tree' ? 'default' : 'ghost'}
            size="sm"
            className={`h-8 px-3 rounded-lg transition-all ${viewMode === 'tree' ? 'admin-btn-primary shadow-sm' : 'hover:bg-gray-100 text-gray-600'}`}
            onClick={() => { setViewMode('tree'); setCurrentPage(1); setSearchTerm(''); }}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Dạng Cây
          </Button>
        </div>
        <Button
          className="admin-btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20"
          onClick={openCreateModal}
        >
          <FolderTree className="w-4 h-4" />
          Tạo danh mục
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Sticky Search Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-50 p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-400 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {viewMode === 'tree' && matchingIds.length > 0 && (
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-100 shadow-lg shadow-blue-500/5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="px-3 py-1 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Kết quả</span>
                  <span className="text-xs font-black text-blue-700 min-w-[3rem] text-center">
                    {currentMatchIndex + 1} <span className="text-blue-300 mx-0.5">/</span> {matchingIds.length}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95" 
                    onClick={handlePrevMatch}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95" 
                    onClick={handleNextMatch}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto max-h-[70vh] min-h-[400px]">
          {viewMode === 'table' ? (
            <CategoryTable
              loading={loading}
              categories={paginatedItems}
              searchTerm={searchTerm}
              matchingIds={matchingIds}
              currentMatchIndex={currentMatchIndex}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ) : (
            <CategoryTree
              categories={allCategories}
              searchTerm={searchTerm}
              matchingIds={matchingIds}
              currentMatchIndex={currentMatchIndex}
              activeId={activeId}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onEdit={openEditModal}
              onDelete={handleDelete}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          )}
        </div>

        {/* Root Drop Zone - Outside Scroll */}
        {viewMode === 'tree' && activeId && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
            <RootDropZone />
          </div>
        )}

        {/* Local Pagination UI */}
        {viewMode === 'table' && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 text-gray-600 sticky bottom-0 z-20">
            <span className="text-xs font-medium">
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = currentPage;
                  if (totalPages > 5) {
                    if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                  } else {
                    pageNum = i + 1;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 p-0 rounded-lg text-xs font-bold ${currentPage === pageNum ? 'admin-btn-primary' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CategoryForm
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        submitting={submitting}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        allCategories={allCategories}
        parentSearch={parentSearch}
        setParentSearch={setParentSearch}
        isParentPopoverOpen={isParentPopoverOpen}
        setIsParentPopoverOpen={setIsParentPopoverOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
