'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  FolderTree,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  LayoutGrid,
  GripVertical,
} from 'lucide-react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Button } from '@/shared/components/shadcn-ui/button';
import { toast } from "sonner";

// Sub-components
import { CategoryStats } from './category-stats';
import { CategoryHeader } from './category-header';
import { CategoryTable } from './category-table';
import { CategoryTree, RootDropZone } from './category-tree';
import { CategoryForm } from './category-form';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import { Category } from '../../models/category-model';
import CategoryService from '../../services/category-services';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';

export default function CategoryManagement() {
  // D&D Sensors — khai báo ở đây để DndContext bao cả tree và RootDropZone
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // State cho dữ liệu
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');

  // State cho tìm kiếm và phân trang local
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

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
    setLoading(true);
    try {
      const response = await CategoryService.getAll();
      if (response.isSuccess && response.value) {
        setAllCategories(response.value);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter dữ liệu local cho Table View
  const filteredCategories = allCategories.filter(cat => {
    // 1. Filter by Tab
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'root' && !cat.parentId) ||
      (activeTab === 'sub' && cat.parentId);

    if (!matchesTab) return false;

    // 2. Filter by Search Term
    return cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

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
  }, [searchTerm, viewMode, allCategories, activeTab]);

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
        }
      }
    } catch (error: any) {
      console.error('Submit error:', error);
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
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
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
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-left-4 duration-1200" style={{ height: `calc(100vh - ${LAYOUT_CONSTANTS.HEADER_HEIGHT + LAYOUT_CONSTANTS.FOOTER_HEIGHT}px)` }}>
      <CategoryStats
        categories={allCategories}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
        <CategoryHeader
          viewMode={viewMode}
          onViewModeChange={(mode) => {
            setViewMode(mode);
            setCurrentPage(1);
            setSearchTerm('');
          }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          matchingIds={matchingIds}
          currentMatchIndex={currentMatchIndex}
          onPrevMatch={handlePrevMatch}
          onNextMatch={handleNextMatch}
          onCreateClick={openCreateModal}
        />

        {/* Main Content Area */}
        {viewMode === 'table' ? (
          <div className="flex-1 overflow-y-auto min-h-0">
            <CategoryTable
              loading={loading}
              categories={paginatedItems}
              searchTerm={searchTerm}
              matchingIds={matchingIds}
              currentMatchIndex={currentMatchIndex}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {activeId && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <RootDropZone />
              </div>
            )}

            {/* Drag Overlay — ghost theo con trỏ khi kéo */}
            <DragOverlay>
              {activeId ? (
                <div className="bg-white px-4 py-3 rounded-lg shadow-xl border-2 border-blue-500 flex items-center gap-3 opacity-95">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="font-bold text-gray-900">{allCategories.find(c => c.id === activeId)?.name}</span>
                </div>
              ) : null}
            </DragOverlay>

            {/* Tree scroll area */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <CategoryTree
                categories={allCategories}
                searchTerm={searchTerm}
                matchingIds={matchingIds}
                currentMatchIndex={currentMatchIndex}
                activeId={activeId}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            </div>
          </DndContext>
        )}

        {/* Local Pagination UI */}
        {viewMode === 'table' && (
          <LocalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
