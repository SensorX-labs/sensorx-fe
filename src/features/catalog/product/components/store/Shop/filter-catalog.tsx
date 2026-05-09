'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import CategoryService from '@/features/catalog/category/services/category-services';
import { Category, CategoryAllListResult } from '@/features/catalog/category/models';
import { CategoryTreeItem, buildCategoryTree } from './category-tree-item';

interface FilterCatalogProps {
    onFiltersChange?: (filters: FilterState) => void;
    onClose?: () => void;
}

export interface FilterState {
    collections: string[];
    categories: string[];
    search: string;
}

export function FilterCatalog({
    onFiltersChange,
    onClose,
}: FilterCatalogProps) {
    const [expandedSections, setExpandedSections] = useState({
        search: true,
        collection: false,
        category: true,
    });

    const [filters, setFilters] = useState<FilterState>({
        collections: [],
        categories: [],
        search: '',
    });

    const [categories, setCategories] = useState<CategoryAllListResult>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const result = await CategoryService.getAll();
                if (result) {
                    setCategories(result);
                }
            } catch (error) {
                console.error(">>> Lỗi khi fetch categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const categoryTree = buildCategoryTree(categories);

    // đóng mở phần lọc
    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // áp dụng lọc
    const handleFilterChange = (type: keyof FilterState, value: string) => {
        const currentArray = (filters[type] as string[]) || [];
        const isSelected = currentArray.includes(value);

        let newArray: string[];
        if (type === 'categories') {
            newArray = isSelected ? [] : [value];
        } else {
            newArray = isSelected
                ? currentArray.filter((item) => item !== value)
                : [...currentArray, value];
        }

        const newFilters = { ...filters, [type]: newArray };
        setFilters(newFilters);
        onFiltersChange?.(newFilters);
    };

    // loại bỏ tất cả lọc
    const clearAllFilters = () => {
        const resetFilters: FilterState = {
            collections: [],
            categories: [],
            search: '',
        };
        setFilters(resetFilters);
        onFiltersChange?.(resetFilters);
    };

    // đếm bộ lọc áp dụng
    const activeFilterCount = filters.collections.length + filters.categories.length + (filters.search ? 1 : 0);

    return (
        <div className="w-full md:w-64 pr-0 md:pr-4">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-filter-border">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">
                    BỘ LỌC
                </h3>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="text-[10px] font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest"
                    >
                        Xóa tất cả
                    </button>
                )}
            </div>

            {/* tìm kiếm theo từ khóa */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('search')}
                    className="w-full flex items-center justify-between py-4 group"
                >
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900">
                        Tìm kiếm
                    </span>
                    <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-300 ${expandedSections.search ? '' : '-rotate-90'}`}
                    />
                </button>
                {expandedSections.search && (
                    <div className="pb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tên sản phẩm, mã..."
                                value={filters.search}
                                onChange={(e) => {
                                    const newFilters = { ...filters, search: e.target.value };
                                    setFilters(newFilters);
                                    onFiltersChange?.(newFilters);
                                }}
                                className="w-full px-4 py-3 text-xs border border-filter-border rounded-none bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                            />
                            <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* lọc theo danh mục */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('category')}
                    className="w-full flex items-center justify-between py-4 group"
                >
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900">
                        Danh mục
                    </span>
                    <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-300 ${expandedSections.category ? '' : '-rotate-90'}`}
                    />
                </button>
                {expandedSections.category && (
                    <div className="space-y-1 pb-6">
                        {loadingCategories ? (
                            <div className="text-[10px] text-gray-400 uppercase animate-pulse">Đang tải...</div>
                        ) : categoryTree.length > 0 ? (
                            categoryTree.map((node) => (
                                <CategoryTreeItem
                                    key={node.id}
                                    node={node}
                                    level={0}
                                    selectedCategories={filters.categories}
                                    onCategorySelect={(id) => handleFilterChange('categories', id)}
                                />
                            ))
                        ) : (
                            <div className="text-[10px] text-gray-400 uppercase italic">Không có danh mục</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterCatalog;
