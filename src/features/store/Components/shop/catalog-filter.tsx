'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import CategoryService from '@/features/catalog/category/services/category-services';
import { CategoryAllListResult } from '@/features/catalog/category/models';
import { CategoryTreeItem, buildCategoryTree } from './category-tree-item';

interface CatalogFilterProps {
    onFiltersChange?: (filters: FilterState) => void;
}

export interface FilterState {
    collections: string[];
    categories: string[];
    search: string;
}

export function CatalogFilter({
    onFiltersChange,
}: CatalogFilterProps) {
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
    // Fetch categories
    useEffect(() => {
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
        <div className="bg-[#F9F9FB] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full lg:w-64 select-none shadow-md rounded-2xl border-t-4 border-t-[#0D9488] p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200 dark:border-zinc-800/80">
                <h3 className="text-xs font-heading font-extrabold uppercase tracking-widest text-stone-950 dark:text-white">
                    BỘ LỌC
                </h3>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="text-[10px] font-sans font-bold text-stone-400 hover:text-[#0D9488] dark:hover:text-emerald-400 transition-colors uppercase tracking-widest cursor-pointer"
                    >
                        Xóa tất cả
                    </button>
                )}
            </div>

            {/* tìm kiếm theo từ khóa */}
            <div className="mb-4">
                <button
                    onClick={() => toggleSection('search')}
                    className="w-full flex items-center justify-between py-3 group cursor-pointer"
                >
                    <span className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-stone-800 dark:text-white">
                        Tìm kiếm
                    </span>
                    <ChevronDown
                        size={14}
                        className={`text-stone-400 transition-transform duration-300 ${expandedSections.search ? '' : '-rotate-90'}`}
                    />
                </button>
                {expandedSections.search && (
                    <div className="pb-4">
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
                                className="w-full px-4 py-2.5 text-xs border border-stone-250 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-950 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all font-sans font-semibold shadow-sm"
                            />
                            <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* lọc theo danh mục */}
            <div className="mb-4">
                <button
                    onClick={() => toggleSection('category')}
                    className="w-full flex items-center justify-between py-3 group cursor-pointer"
                >
                    <span className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-stone-800 dark:text-white">
                        Danh mục
                    </span>
                    <ChevronDown
                        size={14}
                        className={`text-stone-400 transition-transform duration-300 ${expandedSections.category ? '' : '-rotate-90'}`}
                    />
                </button>
                {expandedSections.category && (
                    <div className="space-y-1 pb-4">
                        {loadingCategories ? (
                            <div className="text-[10px] text-stone-400 uppercase animate-pulse">Đang tải...</div>
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
                            <div className="text-[10px] text-stone-400 uppercase italic">Không có danh mục</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogFilter;
