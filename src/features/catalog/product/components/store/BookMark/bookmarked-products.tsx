'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ChevronDown, Heart, Loader2, ArrowRight, Search } from 'lucide-react';
import ProductCard from '../Common/product-card';
import { ProductService } from '../../../services/product-service';
import { ProductLoadMoreForModal } from '../../../models/product-load-more';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';
import Link from 'next/link';

type SortOption = 'newest' | 'name-asc' | 'name-desc';

export const BookmarkedProducts: React.FC = () => {
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<ProductLoadMoreForModal[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Fetch data từ API, để API xử lý Sắp xếp và Tìm kiếm
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            // Theo đúng yêu cầu: sử dụng getLoadMore với các tham số điều hướng
            const result = await ProductService.getLoadMore({
                pageSize: 9,
                searchTerm: searchTerm,
                sortByName: sortBy !== 'newest' ? true : false,
                isDescending: sortBy === 'name-asc' ? false : true
            });

            if (result) {
                setProducts(result.items);
            }
        } catch (error) {
            console.error('>>> Lỗi khi fetch sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    }, [sortBy, searchTerm]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('bookmarkedProducts');
            setFavorites(saved ? JSON.parse(saved) : []);
        }
        setIsMounted(true);
    }, []);

    // Re-fetch khi tiêu chí lọc/sắp xếp thay đổi
    useEffect(() => {
        if (isMounted) {
            const timer = setTimeout(() => {
                fetchProducts();
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [fetchProducts, isMounted]);

    // Lọc các sản phẩm bookmarked từ kết quả API đã được sắp xếp/tìm kiếm
    const bookmarkedProducts = useMemo(() => {
        return products.filter((p) => favorites.includes(p.id));
    }, [products, favorites]);

    const handleAddToFavorite = (productId: string) => {
        const newFavorites = favorites.includes(productId)
            ? favorites.filter((id) => id !== productId)
            : [...favorites, productId];

        setFavorites(newFavorites);
        localStorage.setItem('bookmarkedProducts', JSON.stringify(newFavorites));
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-page-background font-sans">
            <StoreBreadcrumb
                items={[
                    { label: 'Trang chủ', href: '/' },
                    { label: 'Cửa hàng', href: '/shop' },
                    { label: 'Sản phẩm yêu thích' }
                ]}
                backLink="/shop"
                backLabel="Quay lại cửa hàng"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-green">
                            <Heart size={18} fill="currentColor" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">DANH SÁCH LƯU TRỮ</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-gray-900 leading-none">
                            Yêu thích
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                            TỔNG CỘNG: <span className="text-gray-900">{favorites.length}</span> SẢN PHẨM
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Search Bar - API Driven */}
                        <div className="relative group w-full sm:w-64">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="TÌM KIẾM TRONG MỤC YÊU THÍCH..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-filter-border text-[10px] font-bold uppercase tracking-widest text-gray-900 focus:outline-none focus:border-gray-900 transition-all placeholder:text-gray-300"
                            />
                        </div>

                        {/* Sort Dropdown - API Driven */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sắp xếp:</span>
                            <div className="relative flex-1 sm:flex-none">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="appearance-none bg-white border border-filter-border px-6 py-3 pr-10 text-[10px] font-bold uppercase tracking-widest text-gray-900 focus:outline-none focus:border-gray-900 cursor-pointer w-full"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="name-asc">Tên: A-Z</option>
                                    <option value="name-desc">Tên: Z-A</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <Loader2 size={40} className="animate-spin text-brand-green" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">Đang đồng bộ dữ liệu...</p>
                    </div>
                ) : bookmarkedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {bookmarkedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                image={product.images?.[0] || '/assets/images/products/default.png'}
                                isFavorite={true}
                                onAddToFavorite={() => handleAddToFavorite(product.id)}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-filter-border bg-white/40">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 shadow-sm border border-filter-border">
                            <Heart size={40} className="text-gray-100" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-3">
                            {searchTerm ? 'KHÔNG TÌM THẤY SẢN PHẨM' : 'DANH SÁCH TRỐNG'}
                        </h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-12">
                            {searchTerm ? `KHÔNG CÓ KẾT QUẢ CHO "${searchTerm}" TRONG MỤC YÊU THÍCH` : 'BẠN CHƯA LƯU BẤT KỲ SẢN PHẨM NÀO'}
                        </p>
                        <Link
                            href="/shop"
                            className="group flex items-center gap-4 px-10 py-5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-green transition-all duration-500"
                        >
                            Khám phá cửa hàng <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarkedProducts;
