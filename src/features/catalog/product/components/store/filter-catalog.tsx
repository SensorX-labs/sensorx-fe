'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { mockProductCategories } from '../../mocks/mock-product-category';

interface FilterCatalogProps {
    onFiltersChange?: (filters: FilterState) => void;
    onClose?: () => void;
}

export interface FilterState {
    collections: string[];
    categories: string[];
    search: string;
}

export const FilterCatalog: React.FC<FilterCatalogProps> = ({
    onFiltersChange,
    onClose,
}) => {
    const [expandedSections, setExpandedSections] = useState({
        search: false,
        collection: true,
        category: false,
    });

    const [filters, setFilters] = useState<FilterState>({
        collections: [],
        categories: [],
        search: '',
    });

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
        const newArray = currentArray.includes(value)
            ? currentArray.filter((item) => item !== value)
            : [...currentArray, value];

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
        <div className="w-full md:w-60 pr-0 md:pr-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-filter-border">
                <h3 className="text-base font-semibold uppercase tracking-wider text-gray-900">
                    Lọc theo:
                </h3>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider"
                    >
                        Xóa tất cả
                    </button>
                )}
            </div>

            {/* tìm kiếm theo từ khóa */}
            <div className="mb-8">
                <button
                    onClick={() => toggleSection('search')}
                    className="w-full flex items-center justify-between py-3 group cursor-pointer"
                >
                    <span className="text-sm font-semibold uppercase tracking-wider text-gray-900 group-hover:text-gray-600 transition-colors">
                        Tìm kiếm
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform duration-300 ${expandedSections.search ? '' : '-rotate-90'
                            }`}
                    />
                </button>
                {expandedSections.search && (
                    <div className="pl-2 pb-6 border-b border-filter-border">
                        <input
                            type="text"
                            placeholder="Nhập từ khóa..."
                            value={filters.search}
                            onChange={(e) => {
                                const newFilters = { ...filters, search: e.target.value };
                                setFilters(newFilters);
                                onFiltersChange?.(newFilters);
                            }}
                            className="w-full px-3 py-2 text-sm border border-filter-border rounded-none bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                    </div>
                )}
            </div>

            {/* lọc theo bộ sưu tập*/}
            <div className="mb-8">
                <button
                    onClick={() => toggleSection('collection')}
                    className="w-full flex items-center justify-between py-3 group cursor-pointer"
                >
                    <span className="text-sm font-semibold uppercase tracking-wider text-gray-900 group-hover:text-gray-600 transition-colors">
                        Bộ sưu tập
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform duration-300 ${expandedSections.collection ? '' : '-rotate-90'
                            }`}
                    />
                </button>
                {expandedSections.collection && (
                    <div className="pl-2 space-y-3 pb-6 border-b border-filter-border">
                        {['Hàng mới', 'Bán chạy nhất', 'Cuối cùng'].map((item) => (
                            <label key={item} className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.collections.includes(item)}
                                    onChange={() => handleFilterChange('collections', item)}
                                    className="w-4 h-4 rounded border-gray-300 text-gray-900 cursor-pointer"
                                />
                                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                    {item}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* lọc theo danh mục */}
            <div className="mb-8">
                <button
                    onClick={() => toggleSection('category')}
                    className="w-full flex items-center justify-between py-3 group cursor-pointer"
                >
                    <span className="text-sm font-semibold uppercase tracking-wider text-gray-900 group-hover:text-gray-600 transition-colors">
                        Danh mục
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform duration-300 ${expandedSections.category ? '' : '-rotate-90'
                            }`}
                    />
                </button>
                {expandedSections.category && (
                    <div className="pl-2 space-y-3 pb-6 border-b border-filter-border">
                        {mockProductCategories
                            .filter((category) => category.id != null)
                            .map((category) => (
                                <label key={category.id} className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.categories.includes(category.id!)}
                                        onChange={() => handleFilterChange('categories', category.id!)}
                                        className="w-4 h-4 rounded border-gray-300 text-gray-900 cursor-pointer"
                                    />
                                    <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                        {category.name}
                                    </span>
                                </label>
                            ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default FilterCatalog;
