'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, SlidersHorizontal, LayoutGrid, List, Loader2, Sparkles } from 'lucide-react';
import ProductCard from './product-card';
import { CatalogFilter, FilterState } from './catalog-filter';
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

    return (
        <div className="min-h-screen bg-[#ffffff] dark:bg-stone-950 relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[400px] left-1/6 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[200px] right-1/6 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.04] dark:bg-indigo-500/[0.06] blur-[150px] pointer-events-none" />

            {/* Catalog Banner */}
            <div className="relative py-20 bg-stone-950 overflow-hidden border-b border-stone-900">
                {/* Background image & gradient overlay */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <img 
                        src="/assets/images/banner_7.jpeg" 
                        alt="Catalog Header Background" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-[#042F2E]/90 to-transparent" />
                </div>

                {/* Floating glow orb */}
                <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[90px] -translate-y-1/2" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={11} /> Thiết bị chính hãng 100%
                    </div>
                    <h1 className="font-heading text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Danh Mục Sản Phẩm
                    </h1>
                    <p className="text-stone-300 text-xs md:text-sm font-sans max-w-md mt-3 leading-relaxed font-light">
                        Hệ thống cảm biến và thiết bị tự động hoá công nghiệp hiệu suất cao từ các nhà sản xuất hàng đầu toàn cầu.
                    </p>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-[#FCF9F4] dark:bg-stone-900 border-b border-gray-150/50 dark:border-stone-850">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <StoreBreadcrumb
                        items={[
                            { label: 'Trang chủ', href: '/' },
                            { label: 'Cửa hàng' }
                        ]}
                        backLink="/"
                        backLabel="Quay lại trang chủ"
                    />
                </div>
            </div>

            {/* Catalog content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filter */}
                    <aside className="w-full lg:w-68 flex-shrink-0">
                        <CatalogFilter onFiltersChange={setFilters} />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-gray-200/50 dark:border-stone-800">
                            <div className="flex items-center gap-4">
                                <button className="p-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><LayoutGrid size={18} /></button>
                                <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><List size={18} /></button>
                                <div className="w-px h-4 bg-gray-200 dark:bg-stone-800 mx-2" />
                                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">
                                    <span className="text-gray-900 dark:text-white">{products.length}</span> SẢN PHẨM
                                </span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <label htmlFor="sort" className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white cursor-pointer transition-colors">
                                        Sắp xếp
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="sort"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="appearance-none bg-transparent border-none py-1 pr-6 text-[11px] font-sans font-bold uppercase tracking-widest text-gray-900 dark:text-white focus:outline-none cursor-pointer"
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
                                <Loader2 size={40} className="animate-spin text-emerald-600" />
                                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gray-450">Đang tải sản phẩm...</p>
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
                                            product={product as any}
                                        />
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className="flex justify-center mt-20">
                                        <button
                                            onClick={() => fetchProducts(true)}
                                            disabled={loadingMore}
                                            className="group relative px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                                        >
                                            <span className="relative text-[10px] font-sans font-bold uppercase tracking-[0.25em] flex items-center gap-3">
                                                {loadingMore ? (
                                                    <>Đang tải <Loader2 size={12} className="animate-spin text-white" /></>
                                                ) : (
                                                    'Xem thêm sản phẩm'
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-gray-200 dark:border-stone-800 rounded-lg">
                                <SlidersHorizontal size={48} className="text-gray-200 dark:text-stone-700 mb-6" />
                                <h3 className="text-lg font-heading font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Hãy thử thay đổi tiêu chí lọc hoặc từ khóa tìm kiếm</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}