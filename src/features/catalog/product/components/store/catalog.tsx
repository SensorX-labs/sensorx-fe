'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ProductCard from './product-card';
import { FilterCatalog, FilterState } from './filter-catalog';
import { ProductListItem } from '../../models/product-list-response';
import { ProductService } from '../../services/product-service';
import { toast } from 'sonner';

// type ProductWithPrice = ProductListItem & { price: number; originalPrice?: number };

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular' | 'name-asc' | 'name-desc';

export const Catalog: React.FC = () => {
    const ITEMS_PER_PAGE = 9;

    const [filters, setFilters] = useState<FilterState>({
        collections: [],
        categories: [],
        search: '',
    });

    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [products, setProducts] = useState<(ProductListItem & { price: number; originalPrice?: number })[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const [isMounted, setIsMounted] = useState(false);

    // khởi tạo bookmarks từ localStorage khi mounted
    // Fetch products từ API
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const result = await ProductService.getProducts({ pageNumber: 1, pageSize: 100 });

            if (result.isSuccess && result.value) {
                // Gán thêm giá ảo vì API chưa có giá
                const productsWithPrice = result.value.items.map(p => ({
                    ...p,
                    price: 1500000, // Giá mặc định cho demo
                    originalPrice: 1500000 + 500000,
                    unit: p.unit ?? "cái"
                }));
                setProducts(productsWithPrice);
            } else {
                toast.error(result.message || 'Không thể tải danh sách sản phẩm');
                setProducts([]);
            }
        } catch (error: any) {
            console.error('>>> Lỗi khi fetch sản phẩm:', error);
            toast.error(error.message || 'Không thể tải danh sách sản phẩm');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('bookmarkedProducts');
            setFavorites(saved ? JSON.parse(saved) : []);
        }
        setIsMounted(true);
        fetchProducts();
    }, []);

    // lưu bookmarks vào localStorage
    useEffect(() => {
        if (isMounted && typeof window !== 'undefined') {
            localStorage.setItem('bookmarkedProducts', JSON.stringify(favorites));
        }
    }, [favorites]);

    // áp dụng lọc và sắp xếp sản phẩm
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (filters.categories.length > 0) {
            result = result.filter((p) => p.categoryId && filters.categories.includes(p.categoryId));
        }

        if (filters.search.trim()) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter((p) =>
                p.name.toLowerCase().includes(searchTerm) ||
                (p.manufacture && p.manufacture.toLowerCase().includes(searchTerm))
            );
        }

        // áp dụng sắp xếp
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
                break;
            case 'popular':
                result.sort((a, b) => ((a.id || '') > (b.id || '') ? 1 : -1));
                break;
            case 'newest':
            default:
                result.sort((a, b) => ((a.id || '') > (b.id || '') ? -1 : 1));
                break;
        }

        return result;
    }, [filters, sortBy, products]);

    // phân trang sản phẩm 
    const paginatedProducts = useMemo(() => {
        return filteredProducts.slice(0, displayCount);
    }, [filteredProducts, displayCount]);

    const handleShowMore = () => {
        setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
    };

    const handleAddToCart = (productId: string) => {
        console.log('Added to cart:', productId);
    };

    const handleAddToFavorite = (productId: string) => {
        setFavorites((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    useEffect(() => {
        setDisplayCount(ITEMS_PER_PAGE);
    }, [filters, sortBy]);

    return (
        <div className="min-h-screen bg-page-background">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* filter */}
                    <aside className="w-full lg:w-60 flex-shrink-0">
                        <FilterCatalog onFiltersChange={setFilters} />
                    </aside>

                    {/* header content */}
                    <main className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
                            <div className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-900">
                                    {filteredProducts.length}
                                </span>{' '}
                                Sản phẩm
                            </div>

                            <div className="flex items-center gap-2">
                                <label htmlFor="sort" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Sắp xếp:
                                </label>
                                <div className="relative">
                                    <select
                                        id="sort"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="appearance-none bg-white border border-gray-300 rounded-none px-4 py-2 pr-8 text-sm font-medium text-gray-900 hover:border-gray-400 transition-colors cursor-pointer"
                                    >
                                        <option value="newest">Mới nhất</option>
                                        <option value="price-low">Giá: Thấp → Cao</option>
                                        <option value="price-high">Giá: Cao → Thấp</option>
                                        <option value="name-asc">Tên: A → Z</option>
                                        <option value="name-desc">Tên: Z → A</option>
                                        <option value="popular">Phổ biến nhất</option>
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* danh sách sản phẩm */}
                        {filteredProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-3 gap-6">
                                    {paginatedProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id!}
                                            name={product.name}
                                            price={product.price}
                                            originalPrice={product.originalPrice}
                                            image={
                                                (!product.images?.[0] || product.images[0] === 'string')
                                                    ? '/assets/images/products/default.png'
                                                    : (product.images[0].startsWith('http') || product.images[0].startsWith('/'))
                                                        ? product.images[0]
                                                        : '/assets/images/products/default.png'
                                            }
                                            isFavorite={favorites.includes(product.id!)}
                                            onAddToCart={() => handleAddToCart(product.id!)}
                                            onAddToFavorite={() => handleAddToFavorite(product.id!)}
                                            product={product as any}
                                        />
                                    ))}
                                </div>

                                {/* nút lấy thêm sản phẩm*/}
                                {displayCount < filteredProducts.length && (
                                    <div className="flex justify-center mt-12">
                                        <button
                                            onClick={handleShowMore}
                                            className="px-8 py-3 border border-gray-300 text-sm font-semibold uppercase tracking-wider text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
                                        >
                                            Show More{' '}
                                            <span className="font-normal">
                                                ({filteredProducts.length - displayCount} items)
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center py-16">
                                <div className="text-center">
                                    <p className="text-lg font-medium text-gray-900 mb-2">
                                        Không tìm thấy sản phẩm
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Hãy điều chỉnh bộ lọc để tìm sản phẩm bạn cần
                                    </p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Catalog;
