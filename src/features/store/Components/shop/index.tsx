'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, SlidersHorizontal, LayoutGrid, List, Loader2 } from 'lucide-react';
import ProductCard from './product-card';
import { FilterCatalog, FilterState } from './filter-catalog';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';
import { ProductService } from '@/features/catalog/product/services/product-service';
import { ProductLoadMoreForModal } from '@/features/catalog/product/models/product-load-more';

type SortOption = 'newest' | 'name-asc' | 'name-desc';

export default function Shop() {
    const PAGE_SIZE = 9;

    const [filters, setFilters] = useState<FilterState>({
        collections: [],
        categories: [],
        search: '',
    });

    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [products, setProducts] = useState<ProductLoadMoreForModal[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Pagination state
    const [lastId, setLastId] = useState<string | undefined>();
    const [lastValue, setLastValue] = useState<string | undefined>();

    // Fetch products
    const fetchProducts = useCallback(async (isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        try {
            const query = {
                pageSize: PAGE_SIZE,
                searchTerm: filters.search || undefined,
                categoryId: filters.categories.length > 0 ? filters.categories[0] : undefined,
                sortByName: sortBy !== 'newest' ? true : false,
                isDescending: sortBy !== 'name-asc' ? true : false,
                lastId: isLoadMore ? lastId : undefined,
                lastValue: isLoadMore ? lastValue : undefined,
            };

            const result = await ProductService.getLoadMore(query);

            if (result) {
                if (isLoadMore) {
                    setProducts(prev => [...prev, ...result.items]);
                } else {
                    setProducts(result.items);
                }

                setHasMore(result.hasNext);
                setLastId(result.lastId);
                setLastValue(result.lastValue);
            }
        } catch (error) {
            console.error('>>> Lỗi khi fetch sản phẩm:', error);
            if (!isLoadMore) setProducts([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filters, sortBy, lastId, lastValue]);

    // Initial fetch and filter change
    useEffect(() => {
        fetchProducts(false);
    }, [filters, sortBy]);

    // Load favorites
    useEffect(() => {
        const saved = localStorage.getItem('bookmarkedProducts');
        if (saved) setFavorites(JSON.parse(saved));
    }, []);

    // Save favorites
    useEffect(() => {
        localStorage.setItem('bookmarkedProducts', JSON.stringify(favorites));
    }, [favorites]);

    const handleAddToFavorite = (productId: string) => {
        setFavorites((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <div className="min-h-screen bg-page-background">
            <StoreBreadcrumb
                items={[
                    { label: 'Trang chủ', href: '/' },
                    { label: 'Cửa hàng' }
                ]}
                backLink="/"
                backLabel="Quay lại trang chủ"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filter */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <FilterCatalog onFiltersChange={setFilters} />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-filter-border">
                            <div className="flex items-center gap-4">
                                <button className="p-2 text-gray-900 bg-product-card-bg"><LayoutGrid size={18} /></button>
                                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><List size={18} /></button>
                                <div className="w-px h-4 bg-filter-border mx-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    <span className="text-gray-900">{products.length}</span> SẢN PHẨM
                                </span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <label htmlFor="sort" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900 cursor-pointer transition-colors">
                                        Sắp xếp
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="sort"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="appearance-none bg-transparent border-none py-1 pr-6 text-[11px] font-bold uppercase tracking-widest text-gray-900 focus:outline-none cursor-pointer"
                                        >
                                            <option value="newest">Mới nhất</option>
                                            <option value="name-asc">Tên: A-Z</option>
                                            <option value="name-desc">Tên: Z-A</option>
                                        </select>
                                        <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-4">
                                <Loader2 size={40} className="animate-spin text-brand-green" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Đang tải sản phẩm...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id}
                                            name={product.name}
                                            image={product.images?.[0] || '/assets/images/products/default.png'}
                                            isFavorite={favorites.includes(product.id)}
                                            onAddToFavorite={() => handleAddToFavorite(product.id)}
                                            product={product as any}
                                        />
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className="flex justify-center mt-20">
                                        <button
                                            onClick={() => fetchProducts(true)}
                                            disabled={loadingMore}
                                            className="group relative px-12 py-5 bg-white border border-gray-900 overflow-hidden transition-all duration-500"
                                        >
                                            <div className="absolute inset-0 w-0 bg-gray-900 transition-all duration-500 ease-out group-hover:w-full" />
                                            <span className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-gray-900 group-hover:text-white flex items-center gap-3">
                                                {loadingMore ? (
                                                    <>Đang tải <Loader2 size={12} className="animate-spin" /></>
                                                ) : (
                                                    'Xem thêm sản phẩm'
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-gray-200">
                                <SlidersHorizontal size={48} className="text-gray-200 mb-6" />
                                <h3 className="text-lg font-bold uppercase tracking-widest text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Hãy thử thay đổi tiêu chí lọc hoặc từ khóa tìm kiếm</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};