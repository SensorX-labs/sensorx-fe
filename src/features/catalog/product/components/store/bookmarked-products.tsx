'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ProductCard from './product-card';
import { MOCK_PRODUCTS } from '../../mocks/product-mocks';
import { MOCK_INTERNAL_PRICES } from '../../mocks/internal-price-mocks';
import { Product } from '../../models/product';

const getCatalogProducts = (): (Product & { price: number; originalPrice?: number })[] => {
    return MOCK_PRODUCTS.map((product : Product) => {
        const priceData = MOCK_INTERNAL_PRICES.find(p => p.productId === product.id || p.productId === product.code);
        const price = priceData?.suggestedPrice || 0;
        const originalPrice = price ? price + 500000 : 0;

        return {
            ...product,
            price,
            originalPrice,
        };
    });
};

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular' | 'name-asc' | 'name-desc';

export const BookmarkedProducts: React.FC = () => {
    const ITEMS_PER_PAGE = 9;

    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [products, setProducts] = useState(() => getCatalogProducts());
    const [favorites, setFavorites] = useState<string[]>([]);
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const [isMounted, setIsMounted] = useState(false);

    // khởi tạo bookmarks từ localStorage khi mounted
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('bookmarkedProducts');
            setFavorites(saved ? JSON.parse(saved) : []);
        }
        setIsMounted(true);
    }, []);

    const bookmarkedProducts = useMemo(() => {
        return products.filter((p) => p.id && favorites.includes(p.id));
    }, [products, favorites]);

    // áp dụng sắp xếp
    const sortedProducts = useMemo(() => {
        let result = [...bookmarkedProducts];

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
    }, [bookmarkedProducts, sortBy]);

    // phân trang sản phẩm
    const paginatedProducts = useMemo(() => {
        return sortedProducts.slice(0, displayCount);
    }, [sortedProducts, displayCount]);

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

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-page-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* tiêu đề */}
                <div className="mb-8">
                    <h1 className="tracking-title-xl">Sản phẩm yêu thích</h1>
                </div>

                {sortedProducts.length > 0 ? (
                    <>
                        {/* thanh sắp xếp */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <span className="meta-label">Sắp xếp theo:</span>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-gray-900 cursor-pointer"
                                    >
                                        <option value="newest">Mới nhất</option>
                                        <option value="price-low">Giá: Thấp đến Cao</option>
                                        <option value="price-high">Giá: Cao đến Thấp</option>
                                        <option value="name-asc">Tên: A-Z</option>
                                        <option value="name-desc">Tên: Z-A</option>
                                        <option value="popular">Phổ biến</option>
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600"
                                    />
                                </div>
                            </div>
                            <span className="meta-label">
                                Hiển thị: <span className="font-semibold">{paginatedProducts.length}</span> / {sortedProducts.length}
                            </span>
                        </div>

                        {/* lưới sản phẩm */}
                        <div className="grid grid-cols-3 gap-6 mb-12">
                            {paginatedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id!}
                                    name={product.name}
                                    price={product.price}
                                    originalPrice={product.originalPrice}
                                    image={product.productImages?.[0]?.imageUrl || '/assets/images/products/default.png'}
                                    isFavorite={favorites.includes(product.id!)}
                                    onAddToCart={() => handleAddToCart(product.id!)}
                                    onAddToFavorite={() => handleAddToFavorite(product.id!)}
                                    product={product}
                                />
                            ))}
                        </div>

                        {/* nút lấy thêm sản phẩm */}
                        {displayCount < sortedProducts.length && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={handleShowMore}
                                    className="px-8 py-3 border border-gray-300 text-sm font-semibold uppercase tracking-wider text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
                                >
                                    Show More{' '}
                                    <span className="font-normal">
                                        ({sortedProducts.length - displayCount} items)
                                    </span>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="tracking-label mb-4">Chưa có sản phẩm yêu thích</p>
                        <a href="/shop" className="px-6 py-2 bg-brand-green text-white font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-all">
                            Khám phá sản phẩm
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarkedProducts;
