'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

// Sub-components
import { CategoryStats } from './category-stats';
import { CategoryHeader } from './category-header';
import { CategoryTable } from './category-table';
import { CategoryTree } from './category-tree';
import { CategoryForm } from './category-form';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import {
  AdminPageContainer,
  AdminContentCard,
} from '@/shared/components/admin/layout';
import { Category } from '../../models';
import CategoryService from '../../services/category-services';

export default function CategoryManagement() {
  // State cho dữ liệu
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');

  // State cho tìm kiếm và phân trang local
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Search Navigation state
  const [matchingIds, setMatchingIds] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

  // State cho Modal Tạo/Sửa
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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
    setCurrentPage(1);
  }, [searchTerm, viewMode, activeTab]);

  // Điều khiển Next/Prev
  const handleNextMatch = () => {
    if (matchingIds.length === 0) return;
    setCurrentMatchIndex(prev => (prev + 1) % matchingIds.length);
  };

  const handlePrevMatch = () => {
    if (matchingIds.length === 0) return;
    setCurrentMatchIndex(prev => (prev - 1 + matchingIds.length) % matchingIds.length);
  };

  const openEditModal = (cat: Category) => {
    setSelectedCategory(cat);
    setIsFormOpen(true);
  };

  const openCreateModal = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  return (
    <AdminPageContainer>
      <CategoryStats
        categories={allCategories}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <AdminContentCard>
        <CategoryHeader
          viewMode={viewMode}
          onViewModeChange={(mode) => {
            setViewMode(mode);
            setCurrentPage(1);
            setSearchTerm('');
            setMatchingIds([]);
            setCurrentMatchIndex(-1);
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
              matchingIds={[]}
              currentMatchIndex={-1}
              onEdit={openEditModal}
              onRefresh={fetchData}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0">
            <CategoryTree
              categories={allCategories}
              searchTerm={searchTerm}
              activeId={currentMatchIndex !== -1 ? matchingIds[currentMatchIndex] : null}
              onEdit={openEditModal}
              onRefresh={fetchData}
              onMatchesChange={(matches) => {
                setMatchingIds(matches);
                if (matches.length > 0 && currentMatchIndex === -1) {
                  setCurrentMatchIndex(0);
                } else if (matches.length === 0) {
                  setCurrentMatchIndex(-1);
                }
              }}
            />
          </div>
        )}

        {/* Local Pagination UI */}
        {viewMode === 'table' && (
          <LocalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </AdminContentCard>

      <CategoryForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={selectedCategory}
        allCategories={allCategories}
        onSuccess={fetchData}
      />
    </AdminPageContainer>
  );
}
